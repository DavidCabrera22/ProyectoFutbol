using System;

namespace TopFutbolAPI.DTOs
{
    public class AlumnoInactivacionHistorialDto
    {
        public int Id { get; set; }
        public string IdAlumno { get; set; }
        public string NombreAlumno { get; set; }
        public DateTime FechaInactivacion { get; set; }
        public DateTime? FechaReactivacion { get; set; }
        public bool EstadoAnterior { get; set; }
        public bool EstadoNuevo { get; set; }
        public string Motivo { get; set; }
        public string UsuarioModificacion { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}