using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;
using System.Collections.Generic;

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

        // GET: api/Movimientos/alumno/{idAlumno}
        [HttpGet("alumno/{idAlumno}")]
        public async Task<ActionResult<IEnumerable<MovimientoDTO>>> GetMovimientosByAlumno(string idAlumno)
        {
            var movimientos = await _context.Movimientos
                .Include(m => m.TipoMovimiento)
                .Include(m => m.Sede)
                .Include(m => m.TipoRecaudo)
                .Include(m => m.Alumno)
                .Include(m => m.Servicio)
                .Where(m => m.IdAlumno == idAlumno)
                .OrderByDescending(m => m.Fecha)
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

        // GET: api/Movimientos/resumen/{idAlumno}
        [HttpGet("resumen/{idAlumno}")]
        public async Task<ActionResult<Dictionary<string, decimal>>> GetResumenDeudaAlumno(string idAlumno)
        {
            // Obtener todos los servicios
            var servicios = await _context.Servicios.ToListAsync();
            
            // Obtener todos los movimientos del alumno
            var movimientos = await _context.Movimientos
                .Include(m => m.TipoMovimiento)
                .Include(m => m.Servicio)
                .Where(m => m.IdAlumno == idAlumno)
                .ToListAsync();
            
            // Inicializar diccionario de resumen de deuda
            var resumenDeuda = new Dictionary<string, decimal>();
            
            // Inicializar todos los servicios con deuda 0
            foreach (var servicio in servicios)
            {
                resumenDeuda[servicio.Nombre] = 0;
            }
            
            // Calcular deuda por servicio (asumiendo que tipo 1 es cargo y tipo 2 es abono)
            foreach (var movimiento in movimientos)
            {
                if (movimiento.Servicio != null)
                {
                    if (movimiento.IdTipo == 1) // Cargo
                    {
                        resumenDeuda[movimiento.Servicio.Nombre] += movimiento.Valor;
                    }
                    else if (movimiento.IdTipo == 2) // Abono
                    {
                        resumenDeuda[movimiento.Servicio.Nombre] -= movimiento.Valor;
                    }
                }
            }
            
            return resumenDeuda;
        }

// GET: api/Movimientos/estadocuenta/{idAlumno}
[HttpGet("estadocuenta/{idAlumno}")]
public async Task<ActionResult<IEnumerable<EstadoCuentaDTO>>> GetEstadoCuentaAlumno(string idAlumno)
{
    // Verificar que el alumno exista
    var alumno = await _context.Alumnos.FirstOrDefaultAsync(a => a.ID == idAlumno);
    if (alumno == null)
    {
        return NotFound($"No se encontró el alumno con ID {idAlumno}");
    }

    // Obtener todos los servicios principales (que no son abonos)
    var serviciosPrincipales = await _context.Servicios
        .Where(s => !s.Nombre.ToLower().Contains("abono"))
        .ToListAsync();
    
    // Obtener todos los servicios de abono
    var serviciosAbono = await _context.Servicios
        .Where(s => s.Nombre.ToLower().Contains("abono"))
        .ToListAsync();
    
    // Obtener todos los movimientos del alumno
    var movimientos = await _context.Movimientos
        .Include(m => m.TipoMovimiento)
        .Include(m => m.Servicio)
        .Include(m => m.TipoRecaudo)
        .Where(m => m.IdAlumno == idAlumno)
        .OrderByDescending(m => m.Fecha)
        .ToListAsync();
    
    var resultado = new List<EstadoCuentaDTO>();
    
    foreach (var servicio in serviciosPrincipales)
    {
        // Encontrar el servicio de abono correspondiente basado en el nombre
        var servicioAbono = serviciosAbono.FirstOrDefault(s => 
            s.Nombre.ToLower().Contains(servicio.Nombre.ToLower()));
        
        // Calcular el total de cargos para este servicio
        decimal totalCargos = movimientos
            .Where(m => m.IdServicio == servicio.IdServicio)
            .Sum(m => m.Valor);
        
        // Calcular el total de abonos para este servicio
        decimal totalAbonos = 0;
        if (servicioAbono != null)
        {
            totalAbonos = movimientos
                .Where(m => m.IdServicio == servicioAbono.IdServicio)
                .Sum(m => m.Valor);
        }
        
        // Calcular saldo pendiente
        decimal saldoPendiente = totalCargos - totalAbonos;
        
        // Determinar si está al día (saldo <= 0)
        bool estaAlDia = saldoPendiente <= 0;
        
        // Obtener información del último pago (abono)
        var ultimoAbono = movimientos
            .Where(m => servicioAbono != null && m.IdServicio == servicioAbono.IdServicio)
            .OrderByDescending(m => m.Fecha)
            .ThenByDescending(m => m.Hora)
            .FirstOrDefault();
        
        string ultimoPago = "Nunca";
        string metodoPago = "";
        string numeroSoporte = "";
        
        if (ultimoAbono != null)
        {
            ultimoPago = ultimoAbono.Fecha.ToString("dd/MM/yyyy");
            metodoPago = ultimoAbono.TipoRecaudo?.Nombre ?? "";
            numeroSoporte = ultimoAbono.Soporte ?? "";
        }
        
        resultado.Add(new EstadoCuentaDTO
        {
            IdServicio = servicio.IdServicio,
            NombreServicio = servicio.Nombre,
            ValorTotal = totalCargos,
            Abonado = totalAbonos,
            Saldo = saldoPendiente,
            EstaAlDia = estaAlDia,
            UltimoPago = ultimoPago,
            MetodoPago = metodoPago,
            NumeroSoporte = numeroSoporte
        });
    }
    
    return resultado;
}

private bool MovimientoExists(int id)
{
    return _context.Movimientos.Any(e => e.IdMovimiento == id);
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
    
    // Actualizar el saldo de la sede
    var saldoActual = await _context.Saldos
        .Where(s => s.IdSede == movimientoDTO.IdSede && s.Fecha.Date == movimientoDTO.Fecha.Date)
        .FirstOrDefaultAsync();
    
    if (saldoActual == null)
    {
        // Si no existe un saldo para esta fecha y sede, crear uno nuevo
        saldoActual = new Saldo
        {
            IdSede = movimientoDTO.IdSede,
            Fecha = movimientoDTO.Fecha,
            Valor = 0
        };
        _context.Saldos.Add(saldoActual);
    }
    
    // Actualizar el valor del saldo según el tipo de movimiento
    if (movimiento.IdTipo == 1) // Cargo (ingreso)
    {
        saldoActual.Valor += movimiento.Valor;
    }
    else if (movimiento.IdTipo == 2) // Abono (egreso)
    {
        saldoActual.Valor -= movimiento.Valor;
    }
    
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

    // Guardar los valores originales para actualizar el saldo
    var fechaOriginal = movimiento.Fecha;
    var valorOriginal = movimiento.Valor;
    var idTipoOriginal = movimiento.IdTipo;
    var idSedeOriginal = movimiento.IdSede;

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
        // Actualizar el saldo de la sede original (revertir el movimiento)
        var saldoOriginal = await _context.Saldos
            .Where(s => s.IdSede == idSedeOriginal && s.Fecha.Date == fechaOriginal.Date)
            .FirstOrDefaultAsync();
        
        if (saldoOriginal != null)
        {
            // Revertir el efecto del movimiento original
            if (idTipoOriginal == 1) // Cargo (ingreso)
            {
                saldoOriginal.Valor -= valorOriginal;
            }
            else if (idTipoOriginal == 2) // Abono (egreso)
            {
                saldoOriginal.Valor += valorOriginal;
            }
        }
        
        // Actualizar el saldo de la nueva sede
        var saldoNuevo = await _context.Saldos
            .Where(s => s.IdSede == movimientoDTO.IdSede && s.Fecha.Date == movimientoDTO.Fecha.Date)
            .FirstOrDefaultAsync();
        
        if (saldoNuevo == null)
        {
            // Si no existe un saldo para esta fecha y sede, crear uno nuevo
            saldoNuevo = new Saldo
            {
                IdSede = movimientoDTO.IdSede,
                Fecha = movimientoDTO.Fecha,
                Valor = 0
            };
            _context.Saldos.Add(saldoNuevo);
        }
        
        // Aplicar el efecto del nuevo movimiento
        if (movimiento.IdTipo == 1) // Cargo (ingreso)
        {
            saldoNuevo.Valor += movimiento.Valor;
        }
        else if (movimiento.IdTipo == 2) // Abono (egreso)
        {
            saldoNuevo.Valor -= movimiento.Valor;
        }
        
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

    // Actualizar el saldo de la sede
    var saldo = await _context.Saldos
        .Where(s => s.IdSede == movimiento.IdSede && s.Fecha.Date == movimiento.Fecha.Date)
        .FirstOrDefaultAsync();
    
    if (saldo != null)
    {
        // Revertir el efecto del movimiento
        if (movimiento.IdTipo == 1) // Cargo (ingreso)
        {
            saldo.Valor -= movimiento.Valor;
        }
        else if (movimiento.IdTipo == 2) // Abono (egreso)
        {
            saldo.Valor += movimiento.Valor;
        }
    }

    _context.Movimientos.Remove(movimiento);
    await _context.SaveChangesAsync();

    return NoContent();
}
    }
}