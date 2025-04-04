using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class SorteoTalonario
    {
        [Key]
        public int IdTalonario { get; set; }
        public int NumeroInicial { get; set; }
        public int NumeroFinal { get; set; }
        public int CantidadBoletas { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorBoleta { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Descripcion { get; set; }
        public bool Activo { get; set; }
        
        // Foreign key to Sorteo
        public int IdSorteo { get; set; }
        
        [ForeignKey("IdSorteo")]
        public virtual Sorteo Sorteo { get; set; }

        // Relación con boletas
        public virtual ICollection<SorteoBoleta> Boletas { get; set; }
    }
}