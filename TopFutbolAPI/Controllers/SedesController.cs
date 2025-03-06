using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SedesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SedesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SedeDTO>>> GetSedes()
        {
            return await _context.Sedes
                  .Select(s => new SedeDTO
        {
            IdSede = s.IdSede,
            Ciudad = s.Ciudad,
               NombreSede = s.NombreSede
        })
        .ToListAsync();
}

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SedeDTO>>> SearchSedes([FromQuery] string query)
        {
            return await _context.Sedes
                .Where(s => s.Ciudad.Contains(query) || s.NombreSede.Contains(query))
                .Select(s => new SedeDTO
                {
                    Ciudad = s.Ciudad,
                    NombreSede = s.NombreSede
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SedeDTO>> GetSede(int id)
        {
            var sede = await _context.Sedes
                .Where(s => s.IdSede == id)
                .Select(s => new SedeDTO
                {
                    Ciudad = s.Ciudad,
                    NombreSede = s.NombreSede
                })
                .FirstOrDefaultAsync();

            if (sede == null)
            {
                return NotFound();
            }

            return sede;
        }

        [HttpPost]
        public async Task<ActionResult<SedeDTO>> PostSede(SedeDTO sedeDTO)
        {
            var sede = new Sede
            {
                Ciudad = sedeDTO.Ciudad,
                NombreSede = sedeDTO.NombreSede
            };

            _context.Sedes.Add(sede);
            await _context.SaveChangesAsync();

            return new SedeDTO
            {
                Ciudad = sede.Ciudad,
                NombreSede = sede.NombreSede
            };
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SedeDTO>> PutSede(int id, SedeDTO sedeDTO)
        {
            var sede = await _context.Sedes.FindAsync(id);
            if (sede == null)
            {
                return NotFound();
            }

            sede.Ciudad = sedeDTO.Ciudad;
            sede.NombreSede = sedeDTO.NombreSede;

            try
            {
                await _context.SaveChangesAsync();
                return new SedeDTO
                {
                    Ciudad = sede.Ciudad,
                    NombreSede = sede.NombreSede
                };
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SedeExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSede(int id)
        {
            var sede = await _context.Sedes.FindAsync(id);
            if (sede == null)
            {
                return NotFound();
            }

            _context.Sedes.Remove(sede);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SedeExists(int id)
        {
            return _context.Sedes.Any(e => e.IdSede == id);
        }
    }
}