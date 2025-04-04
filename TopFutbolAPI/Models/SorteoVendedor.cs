using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class SorteoVendedor
    {
        [Key]
        public int IdVendedor { get; set; }
        
        public string IdAlumno { get; set; }
        
        [ForeignKey("IdAlumno")]
        public virtual Alumno Alumno { get; set; }
        
        public bool Activo { get; set; }
        
        public DateTime FechaRegistro { get; set; }
    }
}