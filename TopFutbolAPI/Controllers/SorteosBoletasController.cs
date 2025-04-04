using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TopFutbolAPI.Data;
using TopFutbolAPI.DTOs;
using TopFutbolAPI.Models;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SorteosBoletasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SorteosBoletasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SorteosBoletas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SorteoBoletaDto>>> GetBoletas()
        {
            var boletas = await _context.SorteoBoletas
                .Include(b => b.Alumno)
                .Include(b => b.Sorteo)
                .ToListAsync();

            return boletas.Select(b => new SorteoBoletaDto
            {
                IdBoleta = b.IdBoleta,
                IdSorteo = b.IdSorteo,
                IdTalonario = b.IdTalonario,
                IdAlumno = b.IdAlumno,
                NombreAlumno = b.Alumno?.Nombre ?? "",
                NumeroBoleta = b.NumeroBoleta,
                Estado = b.Estado,
                NombreComprador = b.NombreComprador ?? "",
                TelefonoComprador = b.TelefonoComprador ?? "",
                FechaVenta = b.FechaVenta,
                FechaAsignacion = b.FechaAsignacion,
                Observaciones = b.Observaciones ?? ""
            }).ToList();
        }

        // GET: api/SorteosBoletas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SorteoBoletaDto>> GetBoleta(int id)
        {
            var boleta = await _context.SorteoBoletas
                .Include(b => b.Alumno)
                .Include(b => b.Sorteo)
                .FirstOrDefaultAsync(b => b.IdBoleta == id);

            if (boleta == null)
            {
                return NotFound();
            }

            return new SorteoBoletaDto
            {
                IdBoleta = boleta.IdBoleta,
                IdSorteo = boleta.IdSorteo,
                IdTalonario = boleta.IdTalonario,
                IdAlumno = boleta.IdAlumno,
                NombreAlumno = boleta.Alumno?.Nombre ?? "",
                NumeroBoleta = boleta.NumeroBoleta,
                Estado = boleta.Estado,
                NombreComprador = boleta.NombreComprador ?? "",
                TelefonoComprador = boleta.TelefonoComprador ?? "",
                FechaVenta = boleta.FechaVenta,
                FechaAsignacion = boleta.FechaAsignacion,
                Observaciones = boleta.Observaciones ?? ""
            };
        }

        // GET: api/SorteosBoletas/sorteo/5
        [HttpGet("sorteo/{idSorteo}")]
        public async Task<ActionResult<IEnumerable<SorteoBoletaDto>>> GetBoletasPorSorteo(int idSorteo)
        {
            var boletas = await _context.SorteoBoletas
                .Include(b => b.Alumno)
                .Include(b => b.Sorteo)
                .Where(b => b.IdSorteo == idSorteo)
                .ToListAsync();

            return boletas.Select(b => new SorteoBoletaDto
            {
                IdBoleta = b.IdBoleta,
                IdSorteo = b.IdSorteo,
                IdTalonario = b.IdTalonario,
                IdAlumno = b.IdAlumno,
                NombreAlumno = b.Alumno?.Nombre ?? "",
                NumeroBoleta = b.NumeroBoleta,
                Estado = b.Estado,
                NombreComprador = b.NombreComprador ?? "",
                TelefonoComprador = b.TelefonoComprador ?? "",
                FechaVenta = b.FechaVenta,
                FechaAsignacion = b.FechaAsignacion,
                Observaciones = b.Observaciones ?? ""
            }).ToList();
        }

        // GET: api/SorteosBoletas/talonario/5
        [HttpGet("talonario/{idTalonario}")]
        public async Task<ActionResult<IEnumerable<SorteoBoletaDto>>> GetBoletasPorTalonario(int idTalonario)
        {
            var boletas = await _context.SorteoBoletas
                .Include(b => b.Alumno)
                .Include(b => b.Sorteo)
                .Where(b => b.IdTalonario == idTalonario)
                .ToListAsync();

            return boletas.Select(b => new SorteoBoletaDto
            {
                IdBoleta = b.IdBoleta,
                IdSorteo = b.IdSorteo,
                IdTalonario = b.IdTalonario,
                IdAlumno = b.IdAlumno,
                NombreAlumno = b.Alumno?.Nombre ?? "",
                NumeroBoleta = b.NumeroBoleta,
                Estado = b.Estado,
                NombreComprador = b.NombreComprador ?? "",
                TelefonoComprador = b.TelefonoComprador ?? "",
                FechaVenta = b.FechaVenta,
                FechaAsignacion = b.FechaAsignacion,
                Observaciones = b.Observaciones ?? ""
            }).ToList();
        }

        // GET: api/SorteosBoletas/alumno/5
        [HttpGet("alumno/{idAlumno}")]
        public async Task<ActionResult<IEnumerable<SorteoBoletaDto>>> GetBoletasPorAlumno(string idAlumno)
        {
            var boletas = await _context.SorteoBoletas
                .Include(b => b.Alumno)
                .Include(b => b.Sorteo)
                .Where(b => b.IdAlumno == idAlumno)
                .ToListAsync();

            return boletas.Select(b => new SorteoBoletaDto
            {
                IdBoleta = b.IdBoleta,
                IdSorteo = b.IdSorteo,
                IdTalonario = b.IdTalonario,
                IdAlumno = b.IdAlumno,
                NombreAlumno = b.Alumno?.Nombre ?? "",
                NumeroBoleta = b.NumeroBoleta,
                Estado = b.Estado,
                NombreComprador = b.NombreComprador ?? "",
                TelefonoComprador = b.TelefonoComprador ?? "",
                FechaVenta = b.FechaVenta,
                FechaAsignacion = b.FechaAsignacion,
                Observaciones = b.Observaciones ?? ""
            }).ToList();
        }

        // PUT: api/SorteosBoletas/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SorteoBoletaDto>> UpdateBoleta(int id, ActualizarBoletaDto actualizarBoletaDto)
        {
            var boleta = await _context.SorteoBoletas.FindAsync(id);
            if (boleta == null)
            {
                return NotFound();
            }

            boleta.Estado = actualizarBoletaDto.Estado;
            boleta.NombreComprador = actualizarBoletaDto.NombreComprador ?? string.Empty;
            boleta.TelefonoComprador = actualizarBoletaDto.TelefonoComprador ?? string.Empty;
            boleta.Observaciones = actualizarBoletaDto.Observaciones ?? string.Empty;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BoletaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return await GetBoleta(id);
        }

        // PUT: api/SorteosBoletas/5/vender
        [HttpPut("{id}/vender")]
        public async Task<ActionResult<SorteoBoletaDto>> VenderBoleta(int id, VenderBoletaDto venderBoletaDto)
        {
            var boleta = await _context.SorteoBoletas.FindAsync(id);
            if (boleta == null)
            {
                return NotFound();
            }

            if (boleta.Estado != "Asignada")
            {
                return BadRequest("Solo se pueden vender boletas que estén asignadas a un alumno");
            }

            boleta.Estado = "Vendida";
            boleta.NombreComprador = venderBoletaDto.NombreComprador ?? string.Empty;
            boleta.TelefonoComprador = venderBoletaDto.TelefonoComprador ?? string.Empty;
            boleta.FechaVenta = DateTime.Now;
            boleta.Observaciones = venderBoletaDto.Observaciones ?? string.Empty;

            await _context.SaveChangesAsync();

            // Actualizar contadores en el sorteo
            await ActualizarContadoresSorteo(boleta.IdSorteo);

            return await GetBoleta(id);
        }

        // POST: api/SorteosBoletas/asignar/5
        [HttpPost("asignar/{id}")]
        public async Task<ActionResult<SorteoBoletaDto>> AsignarBoleta(int id, AsignarBoletaDto asignarBoletaDto)
        {
            var boleta = await _context.SorteoBoletas.FindAsync(id);
            if (boleta == null)
            {
                return NotFound();
            }

            // Verificar que el alumno exista
            var alumno = await _context.Alumnos.FindAsync(asignarBoletaDto.IdAlumno);
            if (alumno == null)
            {
                return BadRequest("El alumno especificado no existe");
            }

            boleta.Estado = "Asignada";
            boleta.IdAlumno = asignarBoletaDto.IdAlumno;
            boleta.FechaAsignacion = DateTime.Now;
            boleta.Observaciones = asignarBoletaDto.Observaciones ?? string.Empty;

            await _context.SaveChangesAsync();

            return await GetBoleta(id);
        }

        // POST: api/SorteosBoletas/asignar-lote
        [HttpPost("asignar-lote")]
        public async Task<ActionResult> AsignarLoteBoletas(AsignarLoteBoletasDto asignarLoteDto)
        {
            try
            {
                // Verificar que el talonario exista
                var talonario = await _context.SorteosTalonarios.FindAsync(asignarLoteDto.IdTalonario);
                if (talonario == null)
                {
                    return NotFound("El talonario especificado no existe");
                }

                // Verificar que el alumno exista
                var alumno = await _context.Alumnos.FindAsync(asignarLoteDto.IdAlumno);
                if (alumno == null)
                {
                    return BadRequest("El alumno especificado no existe");
                }

                // Obtener boletas disponibles del talonario
                var boletasDisponibles = await _context.SorteoBoletas
                    .Where(b => b.IdTalonario == asignarLoteDto.IdTalonario && b.Estado == "Disponible")
                    .Take(asignarLoteDto.Cantidad)
                    .ToListAsync();

                if (boletasDisponibles.Count < asignarLoteDto.Cantidad)
                {
                    return BadRequest($"No hay suficientes boletas disponibles. Solo hay {boletasDisponibles.Count} boletas disponibles.");
                }

                // Asignar boletas al alumno
                foreach (var boleta in boletasDisponibles)
                {
                    boleta.Estado = "Asignada";
                    boleta.IdAlumno = asignarLoteDto.IdAlumno;
                    boleta.FechaAsignacion = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"{boletasDisponibles.Count} boletas asignadas con éxito al alumno {alumno.Nombre}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/SorteosBoletas/estadisticas/alumno/{idAlumno}
        [HttpGet("estadisticas/alumno/{idAlumno}")]
        public async Task<ActionResult<object>> GetEstadisticasAlumno(string idAlumno)
        {
            var alumno = await _context.Alumnos.FindAsync(idAlumno);
            if (alumno == null)
            {
                return NotFound("El alumno especificado no existe");
            }

            var boletasAsignadas = await _context.SorteoBoletas
                .CountAsync(b => b.IdAlumno == idAlumno && b.Estado == "Asignada");
            
            var boletasVendidas = await _context.SorteoBoletas
                .CountAsync(b => b.IdAlumno == idAlumno && b.Estado == "Vendida");
            
            var totalRecaudado = await _context.SorteoBoletas
                .Where(b => b.IdAlumno == idAlumno && b.Estado == "Vendida")
                .Join(_context.SorteosTalonarios, 
                      b => b.IdTalonario, 
                      t => t.IdTalonario, 
                      (b, t) => t.ValorBoleta)
                .SumAsync();

            return new
            {
                NombreAlumno = $"{alumno.Nombre} {alumno.Apellido}",
                BoletasAsignadas = boletasAsignadas,
                BoletasVendidas = boletasVendidas,
                PorcentajeVenta = boletasAsignadas > 0 ? (boletasVendidas * 100.0 / boletasAsignadas) : 0,
                TotalRecaudado = totalRecaudado
            };
        }

        private async Task ActualizarContadoresSorteo(int idSorteo)
        {
            var sorteo = await _context.Sorteos.FindAsync(idSorteo);
            if (sorteo != null)
            {
                var totalBoletas = await _context.SorteoBoletas.CountAsync(b => b.IdSorteo == idSorteo);
                var boletasVendidas = await _context.SorteoBoletas.CountAsync(b => b.IdSorteo == idSorteo && b.Estado == "Vendida");
                var boletasDisponibles = await _context.SorteoBoletas.CountAsync(b => b.IdSorteo == idSorteo && b.Estado == "Disponible");

                sorteo.TotalBoletas = totalBoletas;
                sorteo.BoletasVendidas = boletasVendidas;
                sorteo.BoletasDisponibles = boletasDisponibles;

                await _context.SaveChangesAsync();
            }
        }

        private bool BoletaExists(int id)
        {
            return _context.SorteoBoletas.Any(e => e.IdBoleta == id);
        }
    }
}