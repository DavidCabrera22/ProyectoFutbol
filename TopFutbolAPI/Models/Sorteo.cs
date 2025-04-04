using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class Sorteo
    {
        [Key]
        public int IdSorteo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int IdCategoria { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorBoleta { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Premio { get; set; }
        public string Estado { get; set; }
        public int TotalBoletas { get; set; }
        public int BoletasVendidas { get; set; }
        public int BoletasDisponibles { get; set; }
        
        // Navigation properties
        [ForeignKey("IdCategoria")]
        public virtual Categoria Categoria { get; set; }
        
        public virtual ICollection<SorteoBoleta> Boletas { get; set; }
    }
}