using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations; // Añadido para los atributos de validación

namespace TopFutbolAPI.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        
        [Required]
        [StringLength(50)]
        public string NombreUsuario { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; }
        
        [Required]
        public byte[] PasswordHash { get; set; }
        
        [Required]
        public byte[] PasswordSalt { get; set; }
        
        public string Rol { get; set; } = "Usuario"; // Roles: Admin, Usuario, etc.
        
        public bool Activo { get; set; } = true;
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}



       

