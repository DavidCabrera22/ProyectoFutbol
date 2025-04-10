using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class Alumno
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // Esto evita que se genere automáticamente
        public string ID { get; set; } = string.Empty;
        
        [Required]
        public string Nombre { get; set; } = string.Empty;
        
        [Required]
        public string Apellido { get; set; } = string.Empty;
        
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Telefono { get; set; } = string.Empty;
        
        public int IdSede { get; set; }
        
        [ForeignKey("IdSede")]
        public virtual Sede? Sede { get; set; }
        
        public int IdCategoria { get; set; }
        
        [ForeignKey("IdCategoria")]
        public virtual Categoria? Categoria { get; set; }
        
        public int IdFormador { get; set; }
        
        [ForeignKey("IdFormador")]
        public virtual Formador? Formador { get; set; }

        public bool Activo { get; set; } = true;
        public string RecomendadoPor { get; set; } = string.Empty;
        
        [NotMapped]
        public string MotivoInactividad { get; set; } = string.Empty;

        public virtual ICollection<Movimiento> Movimientos { get; set; } = new List<Movimiento>();

        public virtual ICollection<AlumnoInactivacionHistorial> Inactivaciones { get; set; } = new List<AlumnoInactivacionHistorial>();
    }
}