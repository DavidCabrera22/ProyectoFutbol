using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    [Table("Categorias")]
    public class Categoria
    {
        public Categoria()
        {
            Alumnos = new List<Alumno>();
        }
        
        [Key]
        public int IdCategoria { get; set; }
        
        [Required]
        public string Nombre { get; set; } = string.Empty;
        
        public virtual ICollection<Alumno> Alumnos { get; set; }
    }
}