using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    [Table("AlumnoInactivacionesHistorial")]
    public class AlumnoInactivacionHistorial
    {
        [Key]
        public int Id { get; set; }
        
        public string IdAlumno { get; set; }
        
        [ForeignKey("IdAlumno")]
        public virtual Alumno Alumno { get; set; }
        
        public DateTime FechaInactivacion { get; set; }
        
        public DateTime? FechaReactivacion { get; set; }
        
        public bool EstadoAnterior { get; set; }
        
        public bool EstadoNuevo { get; set; }
        
        public string Motivo { get; set; }
        
        public string UsuarioModificacion { get; set; }
        
        public DateTime FechaRegistro { get; set; }
    }
}