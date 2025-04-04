using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Models;
using TopFutbolAPI.DTOs;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace TopFutbolAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SorteosPagosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SorteosPagosController(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/SorteosPagos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SorteoPagoDto>>> GetPagos()
        {
            var pagos = await _context.SorteoPagos
                .Include(p => p.Alumno)
                .Include(p => p.Boleta)
                .ToListAsync();

            return pagos.Select(p => new SorteoPagoDto
            {
                IdPago = p.IdPago,
                IdBoleta = p.IdBoleta ?? 0,
                NumeroBoleta = p.Boleta != null ? Convert.ToInt32(p.Boleta.NumeroBoleta) : 0,
                IdAlumno = p.IdAlumno?.ToString() ?? "",
                NombreAlumno = p.Alumno?.Nombre ?? "",
                Monto = p.Monto,
                FechaPago = p.FechaPago,
                MetodoPago = p.MetodoPago ?? "",
                Referencia = p.Referencia ?? "",
                Estado = p.Estado ?? "",
                Observaciones = p.Observaciones ?? "",
                ImagenSoporte = p.ImagenSoporte // Incluir la imagen de soporte en la respuesta
            }).ToList();
        }

        // GET: api/SorteosPagos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SorteoPagoDto>> GetPago(int id)
        {
            var pago = await _context.SorteoPagos
                .Include(p => p.Alumno)
                .Include(p => p.Boleta)
                .FirstOrDefaultAsync(p => p.IdPago == id);

            if (pago == null)
            {
                return NotFound();
            }

            return new SorteoPagoDto
            {
                IdPago = pago.IdPago,
                IdBoleta = pago.IdBoleta ?? 0,
                NumeroBoleta = pago.Boleta != null ? Convert.ToInt32(pago.Boleta.NumeroBoleta) : 0,
                IdAlumno = pago.IdAlumno?.ToString() ?? "",
                NombreAlumno = pago.Alumno?.Nombre ?? "",
                Monto = pago.Monto,
                FechaPago = pago.FechaPago,
                MetodoPago = pago.MetodoPago ?? "",
                Referencia = pago.Referencia ?? "",
                Estado = pago.Estado ?? "",
                Observaciones = pago.Observaciones ?? "",
                ImagenSoporte = pago.ImagenSoporte
            };
        }

        // POST: api/SorteosPagos
        [HttpPost]
        public async Task<ActionResult<SorteoPagoDto>> CreatePago(CrearPagoDto crearPagoDto)
        {
            try
            {
                // Validaciones
                if (string.IsNullOrEmpty(crearPagoDto.IdAlumno))
                {
                    return BadRequest("El ID del alumno es requerido");
                }
                
                if (crearPagoDto.Monto <= 0)
                {
                    return BadRequest("El monto debe ser mayor a 0");
                }
                
                if (string.IsNullOrEmpty(crearPagoDto.MetodoPago))
                {
                    return BadRequest("El método de pago es requerido");
                }
                
                // Verificar que el alumno existe
                var alumno = await _context.Alumnos.FindAsync(crearPagoDto.IdAlumno);
                if (alumno == null)
                {
                    return BadRequest($"No se encontró un alumno con ID {crearPagoDto.IdAlumno}");
                }
                
                var pago = new SorteoPago
                {
                    IdBoleta = crearPagoDto.IdBoleta > 0 ? crearPagoDto.IdBoleta : null,
                    IdAlumno = crearPagoDto.IdAlumno,
                    Monto = crearPagoDto.Monto,
                    FechaPago = DateTime.Now,
                    MetodoPago = crearPagoDto.MetodoPago,
                    Referencia = crearPagoDto.Referencia,
                    Estado = "Registrado",
                    Observaciones = crearPagoDto.Observaciones,
                    ImagenSoporte = crearPagoDto.ImagenSoporte
                };
                
                _context.SorteoPagos.Add(pago);
                await _context.SaveChangesAsync();
                
                return await GetPago(pago.IdPago);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al crear el pago: {ex.Message}");
            }
        }

        // PUT: api/SorteosPagos/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SorteoPagoDto>> UpdatePago(int id, ActualizarPagoDto actualizarPagoDto)
        {
            try
            {
                var pago = await _context.SorteoPagos.FindAsync(id);
                if (pago == null)
                {
                    return NotFound("Pago no encontrado");
                }

                pago.Monto = actualizarPagoDto.Monto;
                pago.MetodoPago = actualizarPagoDto.MetodoPago;
                pago.Referencia = actualizarPagoDto.Referencia;
                pago.Estado = actualizarPagoDto.Estado;
                pago.Observaciones = actualizarPagoDto.Observaciones;
                // No actualizamos la imagen aquí, se hace en un endpoint separado

                await _context.SaveChangesAsync();
                return await GetPago(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PagoExists(id))
                {
                    return NotFound("Pago no encontrado");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al actualizar el pago: {ex.Message}");
            }
        }

        // DELETE: api/SorteosPagos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePago(int id)
        {
            try
            {
                var pago = await _context.SorteoPagos.FindAsync(id);
                if (pago == null)
                {
                    return NotFound("Pago no encontrado");
                }

                _context.SorteoPagos.Remove(pago);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al eliminar el pago: {ex.Message}");
            }
        }

        // POST: api/SorteosPagos/{id}/imagen
        [HttpPost("{id}/imagen")]
        public async Task<IActionResult> SubirImagenSoporte(int id, IFormFile imagen)
        {
            try
            {
                // Validar que el pago existe
                var pago = await _context.SorteoPagos.FindAsync(id);
                if (pago == null)
                    return NotFound("Pago no encontrado");
                
                // Validar que la imagen no sea nula
                if (imagen == null || imagen.Length == 0)
                    return BadRequest("No se ha proporcionado una imagen válida");
                
                // Crear directorio si no existe
                var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "soportes");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);
                
                // Generar nombre único para la imagen
                var fileName = $"soporte_{id}_{Guid.NewGuid()}{Path.GetExtension(imagen.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);
                
                // Guardar la imagen
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imagen.CopyToAsync(stream);
                }
                
                // Actualizar la ruta en la base de datos
                var rutaRelativa = $"/uploads/soportes/{fileName}";
                pago.ImagenSoporte = rutaRelativa;
                await _context.SaveChangesAsync();
                
                return Ok(new { rutaImagen = rutaRelativa });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al subir la imagen: {ex.Message}");
            }
        }

        // PATCH: api/SorteosPagos/{id}/imagen
        [HttpPatch("{id}/imagen")]
        public async Task<IActionResult> ActualizarImagenFormData(int id, IFormFile imagen)
        {
            try
            {
                // Validar que el pago existe
                var pago = await _context.SorteoPagos.FindAsync(id);
                if (pago == null)
                    return NotFound("Pago no encontrado");
                
                // Validar que la imagen no sea nula
                if (imagen == null || imagen.Length == 0)
                    return BadRequest("No se ha proporcionado una imagen válida");
                
                // Crear directorio si no existe
                var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "soportes");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);
                
                // Generar nombre único para la imagen
                var fileName = $"soporte_{id}_{Guid.NewGuid()}{Path.GetExtension(imagen.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);
                
                // Guardar la imagen
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imagen.CopyToAsync(stream);
                }
                
                // Actualizar la ruta en la base de datos
                var rutaRelativa = $"/uploads/soportes/{fileName}";
                pago.ImagenSoporte = rutaRelativa;
                await _context.SaveChangesAsync();
                
                return Ok(new { rutaImagen = rutaRelativa });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al actualizar la imagen: {ex.Message}");
            }
        }

        // PATCH: api/SorteosPagos/{id}/imagen (para actualizar solo la ruta)
        [HttpPatch("{id}/imagen-ruta")]
        public async Task<IActionResult> ActualizarRutaImagen(int id, [FromBody] ActualizarImagenDto dto)
        {
            try
            {
                var pago = await _context.SorteoPagos.FindAsync(id);
                if (pago == null)
                    return NotFound("Pago no encontrado");
                
                pago.ImagenSoporte = dto.ImagenSoporte;
                await _context.SaveChangesAsync();
                
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al actualizar la ruta de la imagen: {ex.Message}");
            }
        }

        // PATCH: api/SorteosPagos/{id}/estado
        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] ActualizarEstadoDto dto)
        {
            try
            {
                var pago = await _context.SorteoPagos.FindAsync(id);
                if (pago == null)
                    return NotFound("Pago no encontrado");
                
                pago.Estado = dto.Estado;
                await _context.SaveChangesAsync();
                
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al actualizar el estado: {ex.Message}");
            }
        }

        private bool PagoExists(int id)
        {
            return _context.SorteoPagos.Any(e => e.IdPago == id);
        }
    }
}