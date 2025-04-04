using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class BalanceAlumno
    {
        [Key]
        public int IdBalance { get; set; }
        
        [Required]
        public string IdAlumno { get; set; }
        
        [Required]
        public int IdSede { get; set; }
        
        [Required]
        public DateTime Fecha { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }
        
        // Propiedades de navegación
        public virtual Alumno Alumno { get; set; }
        public virtual Sede Sede { get; set; }
    }
}