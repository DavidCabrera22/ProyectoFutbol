namespace TopFutbolAPI.DTOs
{
    public class MovimientoDTO
    {
        public int IdMovimiento { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Valor { get; set; }
        
        // Relaciones
        public int IdTipo { get; set; }
        public string NombreTipo { get; set; } = string.Empty;
        
        public int IdSede { get; set; }
        public string NombreSede { get; set; } = string.Empty;
        
        public int IdTipoRecaudo { get; set; }
        public string NombreTipoRecaudo { get; set; } = string.Empty;
        
        public string IdAlumno { get; set; } = string.Empty;
        public string NombreAlumno { get; set; } = string.Empty;
        
        public int IdServicio { get; set; }
        public string NombreServicio { get; set; } = string.Empty;
        
        public string? Caja { get; set; }
        public string? Soporte { get; set; }
        
        // Cambiar de TimeSpan a string para facilitar la recepción de datos desde el frontend
        public string Hora { get; set; } = "00:00";
    }
}