using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class Saldo
    {
        [Key]
        public int IdSaldo { get; set; }
        
        [Required]
        public int IdSede { get; set; }
        
        [ForeignKey("IdSede")]
        public virtual Sede? Sede { get; set; }
        
        [Required]
        public DateTime Fecha { get; set; }
        
        [Required]
        public decimal Valor { get; set; }
    }
}