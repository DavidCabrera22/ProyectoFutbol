using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class Sede
    {

        public Sede()
    {
        Alumnos = new List<Alumno>();
    }
        [Key]
        public int IdSede { get; set; }
        public string Ciudad { get; set; }
        public string NombreSede { get; set; }
        public virtual ICollection<Alumno> Alumnos { get; set; }
    }
}