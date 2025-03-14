using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class Servicio
    {
        [Key]
        public int IdServicio { get; set; }
        
        [Required]
        public string Nombre { get; set; } = string.Empty;
        
        // Agregar propiedad Valor
        [Required]
        public decimal Valor { get; set; }
    }
}