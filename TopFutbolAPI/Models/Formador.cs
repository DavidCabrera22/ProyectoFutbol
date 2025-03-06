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
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public virtual ICollection<Alumno> Alumnos { get; set; }
    }
}