using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class Formador
    {
        public Formador()
    {
        Alumnos = new List<Alumno>();
    }
        [Key]
        public int IdFormador { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public virtual ICollection<Alumno> Alumnos { get; set; }
    }
}