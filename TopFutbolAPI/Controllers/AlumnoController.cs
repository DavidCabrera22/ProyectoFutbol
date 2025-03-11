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
                           a.Email.Contains(query) ||
                           a.ID.Contains(query))
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
        public async Task<ActionResult<AlumnoResponseDTO>> GetAlumno(string id)
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
            // Verificar si ya existe un alumno con ese ID
            if (await _context.Alumnos.AnyAsync(a => a.ID == alumnoDTO.ID))
            {
                return Conflict("Ya existe un alumno con ese número de identificación");
            }

            var alumno = new Alumno
            {
                ID = alumnoDTO.ID,
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
        public async Task<ActionResult<AlumnoResponseDTO>> PutAlumno(string id, AlumnoDTO alumnoDTO)
        {
            if (id != alumnoDTO.ID)
            {
                return BadRequest("El ID en la URL no coincide con el ID en los datos");
            }

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
        public async Task<IActionResult> DeleteAlumno(string id)
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

        private bool AlumnoExists(string id)
        {
            return _context.Alumnos.Any(e => e.ID == id);
        }
    }
}