using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormadoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FormadoresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FormadorDTO>>> GetFormadores()
        {
            return await _context.Formadores
                .Select(f => new FormadorDTO
                {
                    IdFormador = f.IdFormador,
                    Nombre = f.Nombre,
                    Telefono = f.Telefono
                })
                .ToListAsync();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<FormadorDTO>>> SearchFormadores([FromQuery] string query)
        {
            return await _context.Formadores
                .Where(f => f.Nombre.Contains(query))
                .Select(f => new FormadorDTO
                {
                    IdFormador = f.IdFormador,
                    Nombre = f.Nombre,
                    Telefono = f.Telefono
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FormadorDTO>> GetFormador(int id)
        {
            var formador = await _context.Formadores
                .Where(f => f.IdFormador == id)
                .Select(f => new FormadorDTO
                {
                    IdFormador = f.IdFormador,
                    Nombre = f.Nombre,
                    Telefono = f.Telefono
                })
                .FirstOrDefaultAsync();

            if (formador == null)
            {
                return NotFound();
            }

            return formador;
        }

        [HttpPost]
        public async Task<ActionResult<FormadorDTO>> PostFormador(FormadorDTO formadorDTO)
        {
            var formador = new Formador
            {
                Nombre = formadorDTO.Nombre,
                Telefono = formadorDTO.Telefono
            };

            _context.Formadores.Add(formador);
            await _context.SaveChangesAsync();

            return new FormadorDTO
            {
                IdFormador = formador.IdFormador,
                Nombre = formador.Nombre,
                Telefono = formador.Telefono
            };
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FormadorDTO>> PutFormador(int id, FormadorDTO formadorDTO)
        {
            var formador = await _context.Formadores.FindAsync(id);
            if (formador == null)
            {
                return NotFound();
            }

            formador.Nombre = formadorDTO.Nombre;
            formador.Telefono = formadorDTO.Telefono;

            try
            {
                await _context.SaveChangesAsync();
                return new FormadorDTO
                {
                    IdFormador = formador.IdFormador,
                    Nombre = formador.Nombre,
                    Telefono = formador.Telefono
                };
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FormadorExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFormador(int id)
        {
            var formador = await _context.Formadores.FindAsync(id);
            if (formador == null)
            {
                return NotFound();
            }

            _context.Formadores.Remove(formador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FormadorExists(int id)
        {
            return _context.Formadores.Any(e => e.IdFormador == id);
        }
    }
}