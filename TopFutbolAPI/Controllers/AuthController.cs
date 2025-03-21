using Microsoft.AspNetCore.Mvc;
using TopFutbolAPI.DTOs;
using TopFutbolAPI.Models;
using TopFutbolAPI.Services;
using TopFutbolAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AuthController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("registro")]
        public async Task<ActionResult<UsuarioResponseDto>> Registro(RegistroUsuarioDto request)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("El usuario ya existe.");
            }

            _authService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var usuario = new Usuario
            {
                NombreUsuario = request.NombreUsuario,
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var token = _authService.CreateToken(usuario);

            return Ok(new UsuarioResponseDto
            {
                IdUsuario = usuario.IdUsuario,
                NombreUsuario = usuario.NombreUsuario,
                Email = usuario.Email,
                Rol = usuario.Rol,
                Token = token
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UsuarioResponseDto>> Login(LoginUsuarioDto request)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (usuario == null)
            {
                return BadRequest("Usuario no encontrado.");
            }

            if (!_authService.VerifyPasswordHash(request.Password, usuario.PasswordHash, usuario.PasswordSalt))
            {
                return BadRequest("Contraseña incorrecta.");
            }

            var token = _authService.CreateToken(usuario);

            return Ok(new UsuarioResponseDto
            {
                IdUsuario = usuario.IdUsuario,
                NombreUsuario = usuario.NombreUsuario,
                Email = usuario.Email,
                Rol = usuario.Rol,
                Token = token
            });
        }
    }
}