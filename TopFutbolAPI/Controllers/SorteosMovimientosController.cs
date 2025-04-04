using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.DTOs;
using TopFutbolAPI.Models;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SorteosMovimientosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SorteosMovimientosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SorteosMovimientos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SorteoMovimientoDto>>> GetMovimientos()
        {
            var movimientos = await _context.SorteoMovimientos
                .Include(m => m.Alumno)
                .Include(m => m.Boleta)
                .ToListAsync();

            return movimientos.Select(m => new SorteoMovimientoDto
            {
                IdMovimiento = m.IdMovimiento,
                IdAlumno = m.IdAlumno,
                NombreAlumno = m.Alumno?.Nombre ?? "",
                IdBoleta = m.IdBoleta,
                NumeroBoleta = m.Boleta != null ? Convert.ToInt32(m.Boleta.NumeroBoleta) : 0,
                Concepto = m.Concepto ?? "",
                Tipo = m.Tipo ?? "",
                Fecha = m.Fecha,
                Referencia = m.Referencia ?? "",
                Monto = m.Monto,
                Estado = m.Estado ?? "",
                Observaciones = m.Observaciones ?? ""
            }).ToList();
        }

        // GET: api/SorteosMovimientos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SorteoMovimientoDto>> GetMovimiento(int id)
        {
            var movimiento = await _context.SorteoMovimientos
                .Include(m => m.Alumno)
                .Include(m => m.Boleta)
                .FirstOrDefaultAsync(m => m.IdMovimiento == id);

            if (movimiento == null)
            {
                return NotFound();
            }

            return new SorteoMovimientoDto
            {
                IdMovimiento = movimiento.IdMovimiento,
                IdAlumno = movimiento.IdAlumno,
                NombreAlumno = movimiento.Alumno?.Nombre ?? "",
                IdBoleta = movimiento.IdBoleta,
                NumeroBoleta = movimiento.Boleta != null ? Convert.ToInt32(movimiento.Boleta.NumeroBoleta) : 0,
                Concepto = movimiento.Concepto ?? "",
                Tipo = movimiento.Tipo ?? "",
                Fecha = movimiento.Fecha,
                Referencia = movimiento.Referencia ?? "",
                Monto = movimiento.Monto,
                Estado = movimiento.Estado ?? "",
                Observaciones = movimiento.Observaciones ?? ""
            };
        }

        // POST: api/SorteosMovimientos
        [HttpPost]
        public async Task<ActionResult<SorteoMovimientoDto>> CreateMovimiento(CrearMovimientoDto crearMovimientoDto)
        {
            var movimiento = new SorteoMovimiento
            {
                IdAlumno = crearMovimientoDto.IdAlumno,
                IdBoleta = crearMovimientoDto.IdBoleta,
                Concepto = crearMovimientoDto.Concepto,
                Tipo = crearMovimientoDto.Tipo,
                Fecha = DateTime.Now,
                Referencia = crearMovimientoDto.Referencia,
                Monto = crearMovimientoDto.Monto,
                Estado = "Registrado",
                Observaciones = crearMovimientoDto.Observaciones
            };

            _context.SorteoMovimientos.Add(movimiento);
            await _context.SaveChangesAsync();

            return await GetMovimiento(movimiento.IdMovimiento);
        }

        // PUT: api/SorteosMovimientos/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SorteoMovimientoDto>> UpdateMovimiento(int id, ActualizarMovimientoDto actualizarMovimientoDto)
        {
            var movimiento = await _context.SorteoMovimientos.FindAsync(id);
            if (movimiento == null)
            {
                return NotFound();
            }

            movimiento.Concepto = actualizarMovimientoDto.Concepto;
            movimiento.Tipo = actualizarMovimientoDto.Tipo;
            movimiento.Referencia = actualizarMovimientoDto.Referencia;
            movimiento.Monto = actualizarMovimientoDto.Monto;
            movimiento.Estado = actualizarMovimientoDto.Estado;
            movimiento.Observaciones = actualizarMovimientoDto.Observaciones;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovimientoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return await GetMovimiento(id);
        }

        // DELETE: api/SorteosMovimientos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovimiento(int id)
        {
            var movimiento = await _context.SorteoMovimientos.FindAsync(id);
            if (movimiento == null)
            {
                return NotFound();
            }

            _context.SorteoMovimientos.Remove(movimiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovimientoExists(int id)
        {
            return _context.SorteoMovimientos.Any(e => e.IdMovimiento == id);
        }
    }
}