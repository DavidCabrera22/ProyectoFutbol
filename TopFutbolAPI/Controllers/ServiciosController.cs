using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

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
                Nombre = s.Nombre
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
                Nombre = servicio.Nombre
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

            var servicio = new Servicio
            {
                IdServicio = servicioDTO.IdServicio,
                Nombre = servicioDTO.Nombre
            };

            _context.Entry(servicio).State = EntityState.Modified;

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
                Nombre = servicioDTO.Nombre
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

        private bool ServicioExists(int id)
        {
            return _context.Servicios.Any(e => e.IdServicio == id);
        }
    }
}