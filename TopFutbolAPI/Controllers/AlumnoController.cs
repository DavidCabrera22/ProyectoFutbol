using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlumnosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlumnoResponseDTO>>> GetAlumnos()
        {
            return await _context.Alumnos
                .Include(a => a.Sede)
                .Include(a => a.Categoria)
                .Include(a => a.Formador)
                .Select(a => new AlumnoResponseDTO
                {
                    ID = a.ID,
                    Nombre = a.Nombre,
                    Apellido = a.Apellido,
                    Email = a.Email,
                    Telefono = a.Telefono,
                    NombreSede = a.Sede.NombreSede,
                    NombreCategoria = a.Categoria.Nombre,
                    NombreFormador = a.Formador.Nombre
                })
                .ToListAsync();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<AlumnoResponseDTO>>> SearchAlumnos([FromQuery] string query)
        {
            return await _context.Alumnos
                .Include(a => a.Sede)
                .Include(a => a.Categoria)
                .Include(a => a.Formador)
                .Where(a => a.Nombre.Contains(query) || 
                           a.Apellido.Contains(query) || 
                           a.Email.Contains(query))
                .Select(a => new AlumnoResponseDTO
                {
                    ID = a.ID,
                    Nombre = a.Nombre,
                    Apellido = a.Apellido,
                    Email = a.Email,
                    Telefono = a.Telefono,
                    NombreSede = a.Sede.NombreSede,
                    NombreCategoria = a.Categoria.Nombre,
                    NombreFormador = a.Formador.Nombre
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AlumnoResponseDTO>> GetAlumno(int id)
        {
            var alumno = await _context.Alumnos
                .Include(a => a.Sede)
                .Include(a => a.Categoria)
                .Include(a => a.Formador)
                .Where(a => a.ID == id)
                .Select(a => new AlumnoResponseDTO
                {
                    ID = a.ID,
                    Nombre = a.Nombre,
                    Apellido = a.Apellido,
                    Email = a.Email,
                    Telefono = a.Telefono,
                    NombreSede = a.Sede.NombreSede,
                    NombreCategoria = a.Categoria.Nombre,
                    NombreFormador = a.Formador.Nombre
                })
                .FirstOrDefaultAsync();

            if (alumno == null)
            {
                return NotFound();
            }

            return alumno;
        }

        [HttpPost]
        public async Task<ActionResult<AlumnoResponseDTO>> PostAlumno(AlumnoDTO alumnoDTO)
        {
            var alumno = new Alumno
            {
                Nombre = alumnoDTO.Nombre,
                Apellido = alumnoDTO.Apellido,
                Email = alumnoDTO.Email,
                Telefono = alumnoDTO.Telefono,
                IdSede = alumnoDTO.IdSede,
                IdCategoria = alumnoDTO.IdCategoria,
                IdFormador = alumnoDTO.IdFormador
            };

            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();

            var response = await _context.Alumnos
                .Include(a => a.Sede)
                .Include(a => a.Categoria)
                .Include(a => a.Formador)
                .Where(a => a.ID == alumno.ID)
                .Select(a => new AlumnoResponseDTO
                {
                    ID = a.ID,
                    Nombre = a.Nombre,
                    Apellido = a.Apellido,
                    Email = a.Email,
                    Telefono = a.Telefono,
                    NombreSede = a.Sede.NombreSede,
                    NombreCategoria = a.Categoria.Nombre,
                    NombreFormador = a.Formador.Nombre
                })
                .FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetAlumno), new { id = alumno.ID }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AlumnoResponseDTO>> PutAlumno(int id, AlumnoDTO alumnoDTO)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
            {
                return NotFound();
            }

            alumno.Nombre = alumnoDTO.Nombre;
            alumno.Apellido = alumnoDTO.Apellido;
            alumno.Email = alumnoDTO.Email;
            alumno.Telefono = alumnoDTO.Telefono;
            alumno.IdSede = alumnoDTO.IdSede;
            alumno.IdCategoria = alumnoDTO.IdCategoria;
            alumno.IdFormador = alumnoDTO.IdFormador;

            try
            {
                await _context.SaveChangesAsync();

                var response = await _context.Alumnos
                    .Include(a => a.Sede)
                    .Include(a => a.Categoria)
                    .Include(a => a.Formador)
                    .Where(a => a.ID == id)
                    .Select(a => new AlumnoResponseDTO
                    {
                        ID = a.ID,
                        Nombre = a.Nombre,
                        Apellido = a.Apellido,
                        Email = a.Email,
                        Telefono = a.Telefono,
                        NombreSede = a.Sede.NombreSede,
                        NombreCategoria = a.Categoria.Nombre,
                        NombreFormador = a.Formador.Nombre
                    })
                    .FirstOrDefaultAsync();

                return response;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlumnoExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
            {
                return NotFound();
            }

            _context.Alumnos.Remove(alumno);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AlumnoExists(int id)
        {
            return _context.Alumnos.Any(e => e.ID == id);
        }
    }
}