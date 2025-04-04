using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class SorteoMovimiento
    {
        [Key]
        public int IdMovimiento { get; set; }
        
        public string IdAlumno { get; set; }
        
        public int IdBoleta { get; set; }
        
        public string Concepto { get; set; }
        
        public string Tipo { get; set; }
        
        public DateTime Fecha { get; set; }
        
        public string Referencia { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Monto { get; set; }
        
        public string Estado { get; set; }
        
        public string Observaciones { get; set; }
        
        [ForeignKey("IdAlumno")]
        public virtual Alumno Alumno { get; set; }
        
        [ForeignKey("IdBoleta")]
        public virtual SorteoBoleta Boleta { get; set; }
    }
}