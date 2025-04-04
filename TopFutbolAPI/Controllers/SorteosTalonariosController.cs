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
    public class SorteosTalonariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SorteosTalonariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SorteosTalonarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TalonarioDto>>> GetTalonarios()
        {
            var talonarios = await _context.SorteosTalonarios
                .Include(t => t.Boletas)
                .ToListAsync();

            return talonarios.Select(t => new TalonarioDto
            {
                IdTalonario = t.IdTalonario,
                NumeroInicial = t.NumeroInicial,
                NumeroFinal = t.NumeroFinal,
                CantidadBoletas = t.CantidadBoletas,
                ValorBoleta = t.ValorBoleta,
                FechaCreacion = t.FechaCreacion,
                FechaSorteo = t.FechaSorteo,
                Descripcion = t.Descripcion ?? "",
                Activo = t.Activo,
                BoletasGeneradas = t.Boletas?.Count ?? 0
            }).ToList();
        }

        // GET: api/SorteosTalonarios/sorteo/{idSorteo}
        [HttpGet("sorteo/{idSorteo}")]
        public async Task<ActionResult<IEnumerable<TalonarioDto>>> GetTalonariosPorSorteo(int idSorteo)
        {
            var talonarios = await _context.SorteosTalonarios
                .Include(t => t.Boletas)
                .Where(t => t.IdSorteo == idSorteo)
                .ToListAsync();

            return talonarios.Select(t => new TalonarioDto
            {
                IdTalonario = t.IdTalonario,
                NumeroInicial = t.NumeroInicial,
                NumeroFinal = t.NumeroFinal,
                CantidadBoletas = t.CantidadBoletas,
                ValorBoleta = t.ValorBoleta,
                FechaCreacion = t.FechaCreacion,
                FechaSorteo = t.FechaSorteo,
                Descripcion = t.Descripcion ?? "",
                Activo = t.Activo,
                BoletasGeneradas = t.Boletas?.Count ?? 0
            }).ToList();
        }

        // GET: api/SorteosTalonarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TalonarioDto>> GetTalonario(int id)
        {
            var talonario = await _context.SorteosTalonarios
                .Include(t => t.Boletas)
                .FirstOrDefaultAsync(t => t.IdTalonario == id);

            if (talonario == null)
            {
                return NotFound();
            }

            return new TalonarioDto
            {
                IdTalonario = talonario.IdTalonario,
                NumeroInicial = talonario.NumeroInicial,
                NumeroFinal = talonario.NumeroFinal,
                CantidadBoletas = talonario.CantidadBoletas,
                ValorBoleta = talonario.ValorBoleta,
                FechaCreacion = talonario.FechaCreacion,
                FechaSorteo = talonario.FechaSorteo,
                Descripcion = talonario.Descripcion ?? "",
                Activo = talonario.Activo,
                BoletasGeneradas = talonario.Boletas?.Count ?? 0
            };
        }

        // POST: api/SorteosTalonarios
        [HttpPost]
        public async Task<ActionResult<TalonarioDto>> CreateTalonario(CrearTalonarioDto crearTalonarioDto)
        {
            var talonario = new SorteoTalonario
            {
                NumeroInicial = crearTalonarioDto.NumeroInicial,
                NumeroFinal = crearTalonarioDto.NumeroFinal,
                CantidadBoletas = crearTalonarioDto.NumeroFinal - crearTalonarioDto.NumeroInicial + 1,
                ValorBoleta = crearTalonarioDto.ValorBoleta,
                FechaCreacion = DateTime.Now,
                FechaSorteo = crearTalonarioDto.FechaSorteo,
                Descripcion = crearTalonarioDto.Descripcion,
                Activo = crearTalonarioDto.Activo,
                IdSorteo = crearTalonarioDto.IdSorteo // Usar el IdSorteo proporcionado
            };

            _context.SorteosTalonarios.Add(talonario);
            
            try {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) {
                return StatusCode(500, $"Error al guardar el talonario: {ex.Message}. Inner exception: {ex.InnerException?.Message}");
            }
            
            return await GetTalonario(talonario.IdTalonario);
        }

        // PUT: api/SorteosTalonarios/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TalonarioDto>> UpdateTalonario(int id, ActualizarTalonarioDto actualizarTalonarioDto)
        {
            var talonario = await _context.SorteosTalonarios.FindAsync(id);
            if (talonario == null)
            {
                return NotFound();
            }

            // Solo permitir actualizar ciertos campos si no hay boletas generadas
            var boletasGeneradas = await _context.SorteoBoletas.AnyAsync(b => b.IdTalonario == id);
            
            if (!boletasGeneradas)
            {
                talonario.NumeroInicial = actualizarTalonarioDto.NumeroInicial;
                talonario.NumeroFinal = actualizarTalonarioDto.NumeroFinal;
                talonario.CantidadBoletas = actualizarTalonarioDto.NumeroFinal - actualizarTalonarioDto.NumeroInicial + 1;
            }

            talonario.ValorBoleta = actualizarTalonarioDto.ValorBoleta;
            talonario.FechaSorteo = actualizarTalonarioDto.FechaSorteo;
            talonario.Descripcion = actualizarTalonarioDto.Descripcion;
            talonario.Activo = actualizarTalonarioDto.Activo;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TalonarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return await GetTalonario(id);
        }

        // DELETE: api/SorteosTalonarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTalonario(int id)
        {
            var talonario = await _context.SorteosTalonarios.FindAsync(id);
            if (talonario == null)
            {
                return NotFound();
            }

            // Verificar si hay boletas asociadas
            var tieneBoletas = await _context.SorteoBoletas.AnyAsync(b => b.IdTalonario == id);
            if (tieneBoletas)
            {
                return BadRequest("No se puede eliminar el talonario porque tiene boletas asociadas");
            }

            _context.SorteosTalonarios.Remove(talonario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ... código existente ...

// POST: api/SorteosTalonarios/5/generar-boletas
[HttpPost("{id}/generar-boletas")]
public async Task<IActionResult> GenerarBoletas(int id)
{
    try
    {
        var talonario = await _context.SorteosTalonarios
            .Include(t => t.Boletas)
            .FirstOrDefaultAsync(t => t.IdTalonario == id);

        if (talonario == null)
        {
            return NotFound("Talonario no encontrado");
        }

        // Verificar si ya hay boletas generadas
        if (talonario.Boletas != null && talonario.Boletas.Any())
        {
            return BadRequest("Ya se han generado boletas para este talonario");
        }

        // Verificar que el sorteo exista
        var sorteo = await _context.Sorteos.FindAsync(talonario.IdSorteo);
        if (sorteo == null)
        {
            return BadRequest("El sorteo asociado no existe");
        }

        // Buscar un alumno predeterminado para asignar a las boletas
        // Esto es necesario porque la columna IdAlumno no acepta NULL
        var alumnoDefault = await _context.Alumnos.FirstOrDefaultAsync();
        if (alumnoDefault == null)
        {
            // Si no hay alumnos en la base de datos, crear uno temporal
            return BadRequest("No hay alumnos en el sistema. Se requiere al menos un alumno para generar boletas.");
        }

        // Usar una transacción para asegurar que todas las boletas se creen o ninguna
        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                // Generar boletas
                for (int i = talonario.NumeroInicial; i <= talonario.NumeroFinal; i++)
                {
                    var boleta = new SorteoBoleta
                    {
                        IdTalonario = talonario.IdTalonario,
                        IdSorteo = sorteo.IdSorteo,
                        NumeroBoleta = i.ToString().PadLeft(3, '0'),
                        Estado = "Disponible",
                        FechaCreacion = DateTime.Now,
                        // Agregar valores predeterminados para campos obligatorios
                        NombreComprador = string.Empty,
                        TelefonoComprador = string.Empty,
                        Observaciones = string.Empty,
                        // Asignar el ID del alumno predeterminado
                        IdAlumno = alumnoDefault.ID
                    };

                    _context.SorteoBoletas.Add(boleta);
                }

                await _context.SaveChangesAsync();
                
                // Actualizar contadores del sorteo
                await ActualizarContadoresSorteo(sorteo.IdSorteo);

                // Confirmar la transacción
                await transaction.CommitAsync();

                return Ok(new { message = "Boletas generadas con éxito" });
            }
            catch (Exception ex)
            {
                // Revertir la transacción en caso de error
                await transaction.RollbackAsync();
                throw; // Re-lanzar la excepción para que sea capturada por el bloque catch exterior
            }
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error al generar boletas: {ex.Message}. Inner exception: {ex.InnerException?.Message}");
    }
}

// ... resto del código ...

        // Método privado para actualizar contadores
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

        private bool TalonarioExists(int id)
        {
            return _context.SorteosTalonarios.Any(e => e.IdTalonario == id);
        }
    }
}