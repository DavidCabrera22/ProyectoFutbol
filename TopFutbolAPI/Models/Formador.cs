using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class Formador
    {
        [Key]
        public int IdFormador { get; set; }
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public bool Activo { get; set; }
        
        // Navigation properties
        public virtual ICollection<Alumno> Alumnos { get; set; }
        public virtual ICollection<Categoria> Categorias { get; set; }
    }
}