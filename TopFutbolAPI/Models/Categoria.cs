using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class Categoria
    {
         public Categoria()
    {
        Alumnos = new List<Alumno>();
    }
        [Key]
        public int IdCategoria { get; set; }
        public string Nombre { get; set; }
        public virtual ICollection<Alumno> Alumnos { get; set; }
    }
}