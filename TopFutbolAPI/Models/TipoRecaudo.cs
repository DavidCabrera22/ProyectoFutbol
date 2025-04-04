using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class TipoRecaudo
    {
        [Key]
        public int IdTipoRecaudo { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;
    }
}