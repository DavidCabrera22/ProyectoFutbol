using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class SorteoPago
    {
        [Key]
        public int IdPago { get; set; }
        public int? IdBoleta { get; set; }
        public string? IdAlumno { get; set; }  // Cambiado de int? a string? para coincidir con Alumno.ID
        public decimal Monto { get; set; }
        public DateTime FechaPago { get; set; }
        public string? MetodoPago { get; set; }
        public string? Referencia { get; set; }
        public string? Estado { get; set; }
        public string? Observaciones { get; set; }
        public string? ImagenSoporte { get; set; }

        // Relaciones
        [ForeignKey("IdBoleta")]
        public virtual SorteoBoleta? Boleta { get; set; }
        
        [ForeignKey("IdAlumno")]
        public virtual Alumno? Alumno { get; set; }
    }
}