using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiposRecaudoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TiposRecaudoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TiposRecaudo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoRecaudoDTO>>> GetTiposRecaudo()
        {
            var tiposRecaudo = await _context.TiposRecaudo.ToListAsync();
            
            var tiposRecaudoDTO = tiposRecaudo.Select(t => new TipoRecaudoDTO
            {
                IdTipoRecaudo = t.IdTipoRecaudo,
                Nombre = t.Nombre
            }).ToList();

            return tiposRecaudoDTO;
        }

        // GET: api/TiposRecaudo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoRecaudoDTO>> GetTipoRecaudo(int id)
        {
            var tipoRecaudo = await _context.TiposRecaudo.FindAsync(id);

            if (tipoRecaudo == null)
            {
                return NotFound();
            }

            var tipoRecaudoDTO = new TipoRecaudoDTO
            {
                IdTipoRecaudo = tipoRecaudo.IdTipoRecaudo,
                Nombre = tipoRecaudo.Nombre
            };

            return tipoRecaudoDTO;
        }

        // PUT: api/TiposRecaudo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoRecaudo(int id, TipoRecaudoDTO tipoRecaudoDTO)
        {
            if (id != tipoRecaudoDTO.IdTipoRecaudo)
            {
                return BadRequest();
            }

            var tipoRecaudo = new TipoRecaudo
            {
                IdTipoRecaudo = tipoRecaudoDTO.IdTipoRecaudo,
                Nombre = tipoRecaudoDTO.Nombre
            };

            _context.Entry(tipoRecaudo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoRecaudoExists(id))
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

        // POST: api/TiposRecaudo
        [HttpPost]
        public async Task<ActionResult<TipoRecaudoDTO>> PostTipoRecaudo(TipoRecaudoDTO tipoRecaudoDTO)
        {
            var tipoRecaudo = new TipoRecaudo
            {
                Nombre = tipoRecaudoDTO.Nombre
            };

            _context.TiposRecaudo.Add(tipoRecaudo);
            await _context.SaveChangesAsync();

            tipoRecaudoDTO.IdTipoRecaudo = tipoRecaudo.IdTipoRecaudo;

            return CreatedAtAction(nameof(GetTipoRecaudo), new { id = tipoRecaudo.IdTipoRecaudo }, tipoRecaudoDTO);
        }

        // DELETE: api/TiposRecaudo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoRecaudo(int id)
        {
            var tipoRecaudo = await _context.TiposRecaudo.FindAsync(id);
            if (tipoRecaudo == null)
            {
                return NotFound();
            }

            _context.TiposRecaudo.Remove(tipoRecaudo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoRecaudoExists(int id)
        {
            return _context.TiposRecaudo.Any(e => e.IdTipoRecaudo == id);
        }
    }
}