using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovimientosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovimientosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Movimientos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoDTO>>> GetMovimientos()
        {
            var movimientos = await _context.Movimientos
                .Include(m => m.TipoMovimiento)
                .Include(m => m.Sede)
                .Include(m => m.TipoRecaudo)
                .Include(m => m.Alumno)
                .Include(m => m.Servicio)
                .ToListAsync();
            
            var movimientosDTO = movimientos.Select(m => new MovimientoDTO
            {
                IdMovimiento = m.IdMovimiento,
                Fecha = m.Fecha,
                Valor = m.Valor,
                IdTipo = m.IdTipo,
                NombreTipo = m.TipoMovimiento?.Nombre ?? string.Empty,
                IdSede = m.IdSede,
                NombreSede = m.Sede?.NombreSede ?? string.Empty,
                IdTipoRecaudo = m.IdTipoRecaudo,
                NombreTipoRecaudo = m.TipoRecaudo?.Nombre ?? string.Empty,
                IdAlumno = m.IdAlumno,
                NombreAlumno = m.Alumno != null ? $"{m.Alumno.Nombre} {m.Alumno.Apellido}" : string.Empty,
                IdServicio = m.IdServicio,
                NombreServicio = m.Servicio?.Nombre ?? string.Empty,
                Caja = m.Caja,
                Soporte = m.Soporte,
                Hora = m.Hora.ToString(@"hh\:mm")
            }).ToList();

            return movimientosDTO;
        }

        // GET: api/Movimientos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoDTO>> GetMovimiento(int id)
        {
            var movimiento = await _context.Movimientos
                .Include(m => m.TipoMovimiento)
                .Include(m => m.Sede)
                .Include(m => m.TipoRecaudo)
                .Include(m => m.Alumno)
                .Include(m => m.Servicio)
                .FirstOrDefaultAsync(m => m.IdMovimiento == id);

            if (movimiento == null)
            {
                return NotFound();
            }

            var movimientoDTO = new MovimientoDTO
            {
                IdMovimiento = movimiento.IdMovimiento,
                Fecha = movimiento.Fecha,
                Valor = movimiento.Valor,
                IdTipo = movimiento.IdTipo,
                NombreTipo = movimiento.TipoMovimiento?.Nombre ?? string.Empty,
                IdSede = movimiento.IdSede,
                NombreSede = movimiento.Sede?.NombreSede ?? string.Empty,
                IdTipoRecaudo = movimiento.IdTipoRecaudo,
                NombreTipoRecaudo = movimiento.TipoRecaudo?.Nombre ?? string.Empty,
                IdAlumno = movimiento.IdAlumno,
                NombreAlumno = movimiento.Alumno != null ? $"{movimiento.Alumno.Nombre} {movimiento.Alumno.Apellido}" : string.Empty,
                IdServicio = movimiento.IdServicio,
                NombreServicio = movimiento.Servicio?.Nombre ?? string.Empty,
                Caja = movimiento.Caja,
                Soporte = movimiento.Soporte,
                Hora = movimiento.Hora.ToString(@"hh\:mm")
            };

            return movimientoDTO;
        }

        // POST: api/Movimientos
        [HttpPost]
        public async Task<ActionResult<MovimientoDTO>> PostMovimiento(MovimientoDTO movimientoDTO)
        {
            // Convertir string a TimeSpan
            TimeSpan horaTimeSpan;
            if (!TimeSpan.TryParse(movimientoDTO.Hora, out horaTimeSpan))
            {
                // Si falla la conversión, usar la hora actual
                horaTimeSpan = DateTime.Now.TimeOfDay;
            }

            var movimiento = new Movimiento
            {
                Fecha = movimientoDTO.Fecha,
                Valor = movimientoDTO.Valor,
                IdTipo = movimientoDTO.IdTipo,
                IdSede = movimientoDTO.IdSede,
                IdTipoRecaudo = movimientoDTO.IdTipoRecaudo,
                IdAlumno = movimientoDTO.IdAlumno,
                IdServicio = movimientoDTO.IdServicio,
                Caja = movimientoDTO.Caja,
                Soporte = movimientoDTO.Soporte,
                Hora = horaTimeSpan
            };

            _context.Movimientos.Add(movimiento);
            await _context.SaveChangesAsync();

            // Recargar el movimiento con sus relaciones
            await _context.Entry(movimiento)
                .Reference(m => m.TipoMovimiento)
                .LoadAsync();
            await _context.Entry(movimiento)
                .Reference(m => m.Sede)
                .LoadAsync();
            await _context.Entry(movimiento)
                .Reference(m => m.TipoRecaudo)
                .LoadAsync();
            await _context.Entry(movimiento)
                .Reference(m => m.Alumno)
                .LoadAsync();
            await _context.Entry(movimiento)
                .Reference(m => m.Servicio)
                .LoadAsync();

            movimientoDTO.IdMovimiento = movimiento.IdMovimiento;
            movimientoDTO.NombreTipo = movimiento.TipoMovimiento?.Nombre ?? string.Empty;
            movimientoDTO.NombreSede = movimiento.Sede?.NombreSede ?? string.Empty;
            movimientoDTO.NombreTipoRecaudo = movimiento.TipoRecaudo?.Nombre ?? string.Empty;
            movimientoDTO.NombreAlumno = movimiento.Alumno != null ? $"{movimiento.Alumno.Nombre} {movimiento.Alumno.Apellido}" : string.Empty;
            movimientoDTO.NombreServicio = movimiento.Servicio?.Nombre ?? string.Empty;
            movimientoDTO.Hora = movimiento.Hora.ToString(@"hh\:mm");

            return CreatedAtAction(nameof(GetMovimiento), new { id = movimiento.IdMovimiento }, movimientoDTO);
        }

        // PUT: api/Movimientos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovimiento(int id, MovimientoDTO movimientoDTO)
        {
            if (id != movimientoDTO.IdMovimiento)
            {
                return BadRequest();
            }

            var movimiento = await _context.Movimientos.FindAsync(id);
            if (movimiento == null)
            {
                return NotFound();
            }

            // Convertir string a TimeSpan
            TimeSpan horaTimeSpan;
            if (!TimeSpan.TryParse(movimientoDTO.Hora, out horaTimeSpan))
            {
                // Si falla la conversión, mantener la hora actual del registro
                horaTimeSpan = movimiento.Hora;
            }

            movimiento.Fecha = movimientoDTO.Fecha;
            movimiento.Valor = movimientoDTO.Valor;
            movimiento.IdTipo = movimientoDTO.IdTipo;
            movimiento.IdSede = movimientoDTO.IdSede;
            movimiento.IdTipoRecaudo = movimientoDTO.IdTipoRecaudo;
            movimiento.IdAlumno = movimientoDTO.IdAlumno;
            movimiento.IdServicio = movimientoDTO.IdServicio;
            movimiento.Caja = movimientoDTO.Caja;
            movimiento.Soporte = movimientoDTO.Soporte;
            movimiento.Hora = horaTimeSpan;

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

            return NoContent();
        }

        // DELETE: api/Movimientos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovimiento(int id)
        {
            var movimiento = await _context.Movimientos.FindAsync(id);
            if (movimiento == null)
            {
                return NotFound();
            }

            _context.Movimientos.Remove(movimiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovimientoExists(int id)
        {
            return _context.Movimientos.Any(e => e.IdMovimiento == id);
        }
    }
}