using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class SorteoBoleta
    {
        [Key]
        public int IdBoleta { get; set; }
        
        public int IdSorteo { get; set; }
        
        [ForeignKey("IdSorteo")]
        public virtual Sorteo Sorteo { get; set; }
        
        public int IdTalonario { get; set; }
        
        [ForeignKey("IdTalonario")]
        public virtual SorteoTalonario Talonario { get; set; }
        
        public string IdAlumno { get; set; }
        
        [ForeignKey("IdAlumno")]
        public virtual Alumno Alumno { get; set; }
        
        public int? IdVendedor { get; set; }
        
        [ForeignKey("IdVendedor")]
        public virtual SorteoVendedor Vendedor { get; set; }
        
        public string NumeroBoleta { get; set; }
        public string Estado { get; set; }
        public string NombreComprador { get; set; }
        public string TelefonoComprador { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaVenta { get; set; }
        public DateTime? FechaAsignacion { get; set; }
        public string Observaciones { get; set; }
    }
}