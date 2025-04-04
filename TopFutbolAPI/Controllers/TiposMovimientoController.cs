using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiposMovimientoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TiposMovimientoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TiposMovimiento
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoMovimientoDTO>>> GetTiposMovimiento()
        {
            var tiposMovimiento = await _context.TiposMovimiento.ToListAsync();
            
            var tiposMovimientoDTO = tiposMovimiento.Select(t => new TipoMovimientoDTO
            {
                IdTipo = t.IdTipo,
                Nombre = t.Nombre,
                Estado = t.Estado
            }).ToList();

            return tiposMovimientoDTO;
        }

        // GET: api/TiposMovimiento/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoMovimientoDTO>> GetTipoMovimiento(int id)
        {
            var tipoMovimiento = await _context.TiposMovimiento.FindAsync(id);

            if (tipoMovimiento == null)
            {
                return NotFound();
            }

            var tipoMovimientoDTO = new TipoMovimientoDTO
            {
                IdTipo = tipoMovimiento.IdTipo,
                Nombre = tipoMovimiento.Nombre,
                Estado = tipoMovimiento.Estado
            };

            return tipoMovimientoDTO;
        }

        // PUT: api/TiposMovimiento/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoMovimiento(int id, TipoMovimientoDTO tipoMovimientoDTO)
        {
            if (id != tipoMovimientoDTO.IdTipo)
            {
                return BadRequest();
            }

            var tipoMovimiento = new TipoMovimiento
            {
                IdTipo = tipoMovimientoDTO.IdTipo,
                Nombre = tipoMovimientoDTO.Nombre,
                Estado = tipoMovimientoDTO.Estado
            };

            _context.Entry(tipoMovimiento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoMovimientoExists(id))
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

        // POST: api/TiposMovimiento
        [HttpPost]
        public async Task<ActionResult<TipoMovimientoDTO>> PostTipoMovimiento(TipoMovimientoDTO tipoMovimientoDTO)
        {
            var tipoMovimiento = new TipoMovimiento
            {
                Nombre = tipoMovimientoDTO.Nombre,
                Estado = tipoMovimientoDTO.Estado
            };

            _context.TiposMovimiento.Add(tipoMovimiento);
            await _context.SaveChangesAsync();

            tipoMovimientoDTO.IdTipo = tipoMovimiento.IdTipo;

            return CreatedAtAction(nameof(GetTipoMovimiento), new { id = tipoMovimiento.IdTipo }, tipoMovimientoDTO);
        }

        // DELETE: api/TiposMovimiento/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoMovimiento(int id)
        {
            var tipoMovimiento = await _context.TiposMovimiento.FindAsync(id);
            if (tipoMovimiento == null)
            {
                return NotFound();
            }

            _context.TiposMovimiento.Remove(tipoMovimiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoMovimientoExists(int id)
        {
            return _context.TiposMovimiento.Any(e => e.IdTipo == id);
        }
    }
}