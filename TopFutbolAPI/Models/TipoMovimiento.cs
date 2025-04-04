using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class TipoMovimiento
    {
        [Key]
        public int IdTipo { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Nombre { get; set; } = string.Empty;
        
        // 0 para suma, 1 para resta
        public int Estado { get; set; }
    }
}