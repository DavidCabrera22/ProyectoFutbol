using System.ComponentModel.DataAnnotations;

namespace TopFutbolAPI.Models
{
    public class Alumno
    {
        [Key]
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public int IdSede { get; set; }
        public int IdCategoria { get; set; }
        public int IdFormador { get; set; }

        public virtual Sede Sede { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual Formador Formador { get; set; }
    }
}