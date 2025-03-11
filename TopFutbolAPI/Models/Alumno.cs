using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class Alumno
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // Quitar autoincremento
        public string ID { get; set; } = string.Empty; // Cambiado de int a string
        
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public int IdSede { get; set; }
        public int IdCategoria { get; set; }
        public int IdFormador { get; set; }
        
        public virtual Sede? Sede { get; set; }
        public virtual Categoria? Categoria { get; set; }
        public virtual Formador? Formador { get; set; }
    }
}