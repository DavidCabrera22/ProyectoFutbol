using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetodosRecaudoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MetodosRecaudoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/MetodosRecaudo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoRecaudo>>> GetMetodosRecaudo()
        {
            return await _context.TiposRecaudo.ToListAsync();
        }

        // GET: api/MetodosRecaudo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoRecaudo>> GetMetodoRecaudo(int id)
        {
            var tipoRecaudo = await _context.TiposRecaudo.FindAsync(id);

            if (tipoRecaudo == null)
            {
                return NotFound();
            }

            return tipoRecaudo;
        }

        // POST: api/MetodosRecaudo
        [HttpPost]
        public async Task<ActionResult<TipoRecaudo>> CreateMetodoRecaudo(TipoRecaudo tipoRecaudo)
        {
            _context.TiposRecaudo.Add(tipoRecaudo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMetodoRecaudo), new { id = tipoRecaudo.IdTipoRecaudo }, tipoRecaudo);
        }

        // PUT: api/MetodosRecaudo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMetodoRecaudo(int id, TipoRecaudo tipoRecaudo)
        {
            if (id != tipoRecaudo.IdTipoRecaudo)
            {
                return BadRequest();
            }

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

        // DELETE: api/MetodosRecaudo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMetodoRecaudo(int id)
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