using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiciosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiciosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Servicios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioDTO>>> GetServicios()
        {
            var servicios = await _context.Servicios.ToListAsync();
            
            var serviciosDTO = servicios.Select(s => new ServicioDTO
            {
                IdServicio = s.IdServicio,
                Nombre = s.Nombre,
                Valor = s.Valor
            }).ToList();

            return serviciosDTO;
        }

        // GET: api/Servicios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServicioDTO>> GetServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);

            if (servicio == null)
            {
                return NotFound();
            }

            var servicioDTO = new ServicioDTO
            {
                IdServicio = servicio.IdServicio,
                Nombre = servicio.Nombre,
                Valor = servicio.Valor
            };

            return servicioDTO;
        }

        // PUT: api/Servicios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicio(int id, ServicioDTO servicioDTO)
        {
            if (id != servicioDTO.IdServicio)
            {
                return BadRequest();
            }

            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null)
            {
                return NotFound();
            }

            servicio.Nombre = servicioDTO.Nombre;
            servicio.Valor = servicioDTO.Valor;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Servicios
        [HttpPost]
        public async Task<ActionResult<ServicioDTO>> PostServicio(ServicioDTO servicioDTO)
        {
            var servicio = new Servicio
            {
                Nombre = servicioDTO.Nombre,
                Valor = servicioDTO.Valor
            };

            _context.Servicios.Add(servicio);
            await _context.SaveChangesAsync();

            servicioDTO.IdServicio = servicio.IdServicio;

            return CreatedAtAction(nameof(GetServicio), new { id = servicio.IdServicio }, servicioDTO);
        }

        // DELETE: api/Servicios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null)
            {
                return NotFound();
            }

            _context.Servicios.Remove(servicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Servicios/reset
        [HttpPost("reset")]
        public async Task<ActionResult> ResetServicios()
        {
            // Eliminar todos los servicios existentes
            _context.Servicios.RemoveRange(await _context.Servicios.ToListAsync());
            await _context.SaveChangesAsync();

            // Agregar los servicios predeterminados
            var servicios = new List<Servicio>
            {
                new Servicio { IdServicio = 1, Nombre = "Mensualidad", Valor = 70000.00m },
                new Servicio { IdServicio = 2, Nombre = "Torneo Nacional", Valor = 150000.00m },
                new Servicio { IdServicio = 3, Nombre = "Abono a Mensualidad", Valor = 0.00m },
                new Servicio { IdServicio = 4, Nombre = "Abono a Torneo Nacional", Valor = 0.00m }
            };

            _context.Servicios.AddRange(servicios);
            await _context.SaveChangesAsync();

            return Ok("Servicios restablecidos correctamente");
        }

        private bool ServicioExists(int id)
        {
            return _context.Servicios.Any(e => e.IdServicio == id);
        }
    }
}