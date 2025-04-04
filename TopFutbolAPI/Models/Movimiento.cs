using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TopFutbolAPI.Models
{
    public class Movimiento
    {
        [Key]
        public int IdMovimiento { get; set; }
        
        [Required]
        public DateTime Fecha { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }
        
        // Relación con TipoMovimiento
        public int IdTipo { get; set; }
        [ForeignKey("IdTipo")]
        public TipoMovimiento? TipoMovimiento { get; set; }
        
        // Relación con Sede
        public int IdSede { get; set; }
        [ForeignKey("IdSede")]
        public Sede? Sede { get; set; }
        
        // Relación con TipoRecaudo
        public int IdTipoRecaudo { get; set; }
        [ForeignKey("IdTipoRecaudo")]
        public TipoRecaudo? TipoRecaudo { get; set; }
        
        // Relación con Alumno
        public string IdAlumno { get; set; } = string.Empty;
        [ForeignKey("IdAlumno")]
        public Alumno? Alumno { get; set; }
        
        // Relación con Servicio
        public int IdServicio { get; set; }
        [ForeignKey("IdServicio")]
        public Servicio? Servicio { get; set; }
        
        [StringLength(100)]
        public string? Caja { get; set; }
        
        [StringLength(255)]
        public string? Soporte { get; set; }
        
        [Column(TypeName = "time")]
        public TimeSpan Hora { get; set; }
    }
}