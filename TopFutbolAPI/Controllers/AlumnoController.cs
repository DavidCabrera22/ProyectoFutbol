using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                    NombreFormador = a.Formador.Nombre,
                    Activo = a.Activo,
                    RecomendadoPor = a.RecomendadoPor
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
                    NombreFormador = a.Formador.Nombre,
                    Activo = a.Activo,
                    RecomendadoPor = a.RecomendadoPor
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
                    NombreFormador = a.Formador.Nombre,
                    Activo = a.Activo,
                    RecomendadoPor = a.RecomendadoPor
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
                IdFormador = alumnoDTO.IdFormador,
                Activo = alumnoDTO.Activo,
                RecomendadoPor = alumnoDTO.RecomendadoPor
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
                    NombreFormador = a.Formador.Nombre,
                    Activo = a.Activo,
                    RecomendadoPor = a.RecomendadoPor
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
            alumno.Activo = alumnoDTO.Activo;
            alumno.RecomendadoPor = alumnoDTO.RecomendadoPor;

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
                        NombreFormador = a.Formador.Nombre,
                        Activo = a.Activo,
                        RecomendadoPor = a.RecomendadoPor
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

        // PATCH: api/Alumnos/{id}/estado
        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> CambiarEstadoAlumno(string id, [FromBody] CambiarEstadoAlumnoDto cambiarEstadoDto)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
            {
                return NotFound($"No se encontró un alumno con ID {id}");
            }

            // Guardar el estado anterior para comparar
            bool estadoAnterior = alumno.Activo;

            // Actualizar el estado
            alumno.Activo = cambiarEstadoDto.Activo;
            
            // Si se proporciona un motivo, guardarlo temporalmente
            // (el trigger no puede acceder a este campo, pero lo usamos para el registro)
            alumno.MotivoInactividad = cambiarEstadoDto.Motivo ?? 
                (cambiarEstadoDto.Activo ? "Reactivación de alumno" : "Inactivación de alumno");

            try
            {
                await _context.SaveChangesAsync();
                
                // Devolver información sobre el cambio realizado
                return Ok(new { 
                    mensaje = cambiarEstadoDto.Activo ? "Alumno reactivado correctamente" : "Alumno inactivado correctamente",
                    estadoAnterior,
                    estadoNuevo = alumno.Activo
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlumnoExists(id))
                {
                    return NotFound($"No se encontró un alumno con ID {id}");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al cambiar el estado del alumno: {ex.Message}");
            }
        }

        // GET: api/Alumnos/{id}/historial-inactivaciones
        [HttpGet("{id}/historial-inactivaciones")]
        public async Task<ActionResult<IEnumerable<AlumnoInactivacionHistorialDto>>> GetHistorialInactivaciones(string id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
            {
                return NotFound($"No se encontró un alumno con ID {id}");
            }

            var historial = await _context.AlumnoInactivacionesHistorial
                .Where(h => h.IdAlumno == id)
                .OrderByDescending(h => h.FechaInactivacion)
                .ToListAsync();

            return historial.Select(h => new AlumnoInactivacionHistorialDto
            {
                Id = h.Id,
                FechaInactivacion = h.FechaInactivacion,
                FechaReactivacion = h.FechaReactivacion,
                EstadoAnterior = h.EstadoAnterior,
                EstadoNuevo = h.EstadoNuevo,
                Motivo = h.Motivo,
                UsuarioModificacion = h.UsuarioModificacion,
                FechaRegistro = h.FechaRegistro
            }).ToList();
        }

        private bool AlumnoExists(string id)
        {
            return _context.Alumnos.Any(e => e.ID == id);
        }
    }
}