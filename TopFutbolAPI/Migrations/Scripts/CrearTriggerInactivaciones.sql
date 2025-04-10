-- Crear trigger para cambios de estado
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Alumnos_CambioEstado')
    DROP TRIGGER TR_Alumnos_CambioEstado;
GO

CREATE TRIGGER TR_Alumnos_CambioEstado
ON Alumnos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar si el estado Activo ha cambiado
    IF UPDATE(Activo)
    BEGIN
        -- Insertar en el historial cuando un alumno se inactiva
        INSERT INTO AlumnoInactivacionesHistorial (
            IdAlumno, 
            FechaInactivacion, 
            EstadoAnterior, 
            EstadoNuevo, 
            Motivo,
            UsuarioModificacion,
            FechaRegistro
        )
        SELECT 
            i.ID,
            CASE WHEN i.Activo = 0 AND d.Activo = 1 THEN GETDATE() ELSE NULL END,
            d.Activo,
            i.Activo,
            'Inactivación desde la aplicación', -- No podemos acceder a MotivoInactividad desde el trigger
            'Sistema',
            GETDATE()
        FROM 
            inserted i
        INNER JOIN 
            deleted d ON i.ID = d.ID
        WHERE 
            i.Activo <> d.Activo;
            
        -- Actualizar registros existentes cuando un alumno se reactiva
        UPDATE h
        SET h.FechaReactivacion = GETDATE()
        FROM AlumnoInactivacionesHistorial h
        INNER JOIN inserted i ON h.IdAlumno = i.ID
        INNER JOIN deleted d ON i.ID = d.ID
        WHERE 
            i.Activo = 1 AND d.Activo = 0 AND
            h.FechaReactivacion IS NULL;
    END
END
GO