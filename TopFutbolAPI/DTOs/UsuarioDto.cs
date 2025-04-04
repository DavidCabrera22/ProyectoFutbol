using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TopFutbolAPI.DTOs
{
    public class RegistroUsuarioDto
    {
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginUsuarioDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UsuarioResponseDto
    {
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
        public string Token { get; set; }
    }
}