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
    public class SaldosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SaldosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaldoDTO>>> GetSaldos()
        {
            return await _context.Saldos
                .Include(s => s.Sede)
                .Select(s => new SaldoDTO
                {
                    IdSaldo = s.IdSaldo,
                    IdSede = s.IdSede,
                    NombreSede = s.Sede.NombreSede,
                    Fecha = s.Fecha,
                    Valor = s.Valor
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaldoDTO>> GetSaldo(int id)
        {
            var saldo = await _context.Saldos
                .Include(s => s.Sede)
                .Where(s => s.IdSaldo == id)
                .Select(s => new SaldoDTO
                {
                    IdSaldo = s.IdSaldo,
                    IdSede = s.IdSede,
                    NombreSede = s.Sede.NombreSede,
                    Fecha = s.Fecha,
                    Valor = s.Valor
                })
                .FirstOrDefaultAsync();

            if (saldo == null)
            {
                return NotFound();
            }

            return saldo;
        }

        [HttpGet("sede/{idSede}")]
        public async Task<ActionResult<IEnumerable<SaldoDTO>>> GetSaldosBySede(int idSede)
        {
            return await _context.Saldos
                .Include(s => s.Sede)
                .Where(s => s.IdSede == idSede)
                .Select(s => new SaldoDTO
                {
                    IdSaldo = s.IdSaldo,
                    IdSede = s.IdSede,
                    NombreSede = s.Sede.NombreSede,
                    Fecha = s.Fecha,
                    Valor = s.Valor
                })
                .ToListAsync();
        }

        [HttpGet("fecha")]
        public async Task<ActionResult<IEnumerable<SaldoDTO>>> GetSaldosByFecha([FromQuery] DateTime fecha)
        {
            return await _context.Saldos
                .Include(s => s.Sede)
                .Where(s => s.Fecha.Date == fecha.Date)
                .Select(s => new SaldoDTO
                {
                    IdSaldo = s.IdSaldo,
                    IdSede = s.IdSede,
                    NombreSede = s.Sede.NombreSede,
                    Fecha = s.Fecha,
                    Valor = s.Valor
                })
                .ToListAsync();
        }

        [HttpGet("rango")]
        public async Task<ActionResult<IEnumerable<SaldoDTO>>> GetSaldosByRangoFechas(
            [FromQuery] DateTime fechaInicio, 
            [FromQuery] DateTime fechaFin)
        {
            return await _context.Saldos
                .Include(s => s.Sede)
                .Where(s => s.Fecha.Date >= fechaInicio.Date && s.Fecha.Date <= fechaFin.Date)
                .Select(s => new SaldoDTO
                {
                    IdSaldo = s.IdSaldo,
                    IdSede = s.IdSede,
                    NombreSede = s.Sede.NombreSede,
                    Fecha = s.Fecha,
                    Valor = s.Valor
                })
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<SaldoDTO>> PostSaldo(SaldoDTO saldoDTO)
        {
            // Verificar si la sede existe
            var sede = await _context.Sedes.FindAsync(saldoDTO.IdSede);
            if (sede == null)
            {
                return BadRequest("La sede especificada no existe.");
            }

            var saldo = new Saldo
            {
                IdSede = saldoDTO.IdSede,
                Fecha = saldoDTO.Fecha,
                Valor = saldoDTO.Valor
            };

            _context.Saldos.Add(saldo);
            await _context.SaveChangesAsync();

            saldoDTO.IdSaldo = saldo.IdSaldo;
            saldoDTO.NombreSede = sede.NombreSede;

            return CreatedAtAction(nameof(GetSaldo), new { id = saldo.IdSaldo }, saldoDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSaldo(int id, SaldoDTO saldoDTO)
        {
            if (id != saldoDTO.IdSaldo)
            {
                return BadRequest();
            }

            // Verificar si la sede existe
            var sede = await _context.Sedes.FindAsync(saldoDTO.IdSede);
            if (sede == null)
            {
                return BadRequest("La sede especificada no existe.");
            }

            var saldo = await _context.Saldos.FindAsync(id);
            if (saldo == null)
            {
                return NotFound();
            }

            saldo.IdSede = saldoDTO.IdSede;
            saldo.Fecha = saldoDTO.Fecha;
            saldo.Valor = saldoDTO.Valor;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaldoExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSaldo(int id)
        {
            var saldo = await _context.Saldos.FindAsync(id);
            if (saldo == null)
            {
                return NotFound();
            }

            _context.Saldos.Remove(saldo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Saldos/resumen
        [HttpGet("resumen")]
        public async Task<ActionResult<IEnumerable<object>>> GetResumenSaldos()
        {
            // Obtener el saldo más reciente para cada sede
            var sedes = await _context.Sedes.ToListAsync();
            var resultado = new List<object>();

            foreach (var sede in sedes)
            {
                var ultimoSaldo = await _context.Saldos
                    .Where(s => s.IdSede == sede.IdSede)
                    .OrderByDescending(s => s.Fecha)
                    .FirstOrDefaultAsync();

                resultado.Add(new
                {
                    IdSede = sede.IdSede,
                    NombreSede = sede.NombreSede,
                    UltimaFecha = ultimoSaldo?.Fecha.ToString("dd/MM/yyyy") ?? "Sin registros",
                    Saldo = ultimoSaldo?.Valor ?? 0
                });
            }

            return resultado;
        }

        private bool SaldoExists(int id)
        {
            return _context.Saldos.Any(e => e.IdSaldo == id);
        }
    }
}