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
    public class SorteosVendedoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SorteosVendedoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SorteosVendedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendedorDto>>> GetVendedores()
        {
            var vendedores = await _context.SorteosVendedores
                .Include(v => v.Alumno)
                .ToListAsync();

            return vendedores.Select(v => new VendedorDto
            {
                IdVendedor = v.IdVendedor,
                IdAlumno = v.IdAlumno,
                NombreAlumno = v.Alumno?.Nombre ?? "N/A",
                Apellido = v.Alumno?.Apellido ?? "N/A",
                Documento = v.IdAlumno,
                Telefono = v.Alumno?.Telefono ?? "N/A",
                Email = v.Alumno?.Email ?? "N/A",
                FechaRegistro = v.FechaRegistro,
                Activo = v.Activo,
                BoletasAsignadas = _context.SorteoBoletas.Count(b => b.IdVendedor == v.IdVendedor),
                BoletasVendidas = _context.SorteoBoletas.Count(b => b.IdVendedor == v.IdVendedor && b.Estado == "Vendida")
            }).ToList();
        }

        // GET: api/SorteosVendedores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VendedorDto>> GetVendedor(int id)
        {
            var vendedor = await _context.SorteosVendedores
                .Include(v => v.Alumno)
                .FirstOrDefaultAsync(v => v.IdVendedor == id);

            if (vendedor == null)
            {
                return NotFound();
            }

            return new VendedorDto
            {
                IdVendedor = vendedor.IdVendedor,
                IdAlumno = vendedor.IdAlumno,
                NombreAlumno = vendedor.Alumno?.Nombre ?? "N/A",
                Apellido = vendedor.Alumno?.Apellido ?? "N/A",
                Documento = vendedor.IdAlumno,
                Telefono = vendedor.Alumno?.Telefono ?? "N/A",
                Email = vendedor.Alumno?.Email ?? "N/A",
                FechaRegistro = vendedor.FechaRegistro,
                Activo = vendedor.Activo,
                BoletasAsignadas = _context.SorteoBoletas.Count(b => b.IdVendedor == vendedor.IdVendedor),
                BoletasVendidas = _context.SorteoBoletas.Count(b => b.IdVendedor == vendedor.IdVendedor && b.Estado == "Vendida")
            };
        }

        // POST: api/SorteosVendedores
        [HttpPost]
        public async Task<ActionResult<VendedorDto>> CreateVendedor(CrearVendedorDto crearVendedorDto)
        {
            // Verify the alumno exists
            var alumno = await _context.Alumnos.FindAsync(crearVendedorDto.IdAlumno);
            if (alumno == null)
            {
                return BadRequest($"El alumno con ID {crearVendedorDto.IdAlumno} no existe");
            }

            // Check if the alumno is already a vendedor
            var existingVendedor = await _context.SorteosVendedores
                .FirstOrDefaultAsync(v => v.IdAlumno == crearVendedorDto.IdAlumno);
            
            if (existingVendedor != null)
            {
                return BadRequest("Este alumno ya está registrado como vendedor");
            }

            var vendedor = new SorteoVendedor
            {
                IdAlumno = crearVendedorDto.IdAlumno,
                Activo = crearVendedorDto.Activo,
                FechaRegistro = DateTime.Now
            };

            _context.SorteosVendedores.Add(vendedor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVendedor), new { id = vendedor.IdVendedor }, new VendedorDto
            {
                IdVendedor = vendedor.IdVendedor,
                IdAlumno = vendedor.IdAlumno,
                NombreAlumno = alumno.Nombre,
                Apellido = alumno.Apellido,
                Documento = vendedor.IdAlumno,
                Telefono = alumno.Telefono,
                Email = alumno.Email,
                FechaRegistro = vendedor.FechaRegistro,
                Activo = vendedor.Activo,
                BoletasAsignadas = 0,
                BoletasVendidas = 0
            });
        }

        // PUT: api/SorteosVendedores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVendedor(int id, ActualizarVendedorDto actualizarVendedorDto)
        {
            if (id != actualizarVendedorDto.IdVendedor)
            {
                return BadRequest("El ID del vendedor no coincide con el ID de la ruta");
            }

            var vendedor = await _context.SorteosVendedores.FindAsync(id);
            if (vendedor == null)
            {
                return NotFound();
            }

            vendedor.Activo = actualizarVendedorDto.Activo;

            _context.Entry(vendedor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VendedorExists(id))
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

        // PATCH: api/SorteosVendedores/5/estado
        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, CambiarEstadoVendedorDto cambiarEstadoDto)
        {
            var vendedor = await _context.SorteosVendedores.FindAsync(id);
            if (vendedor == null)
            {
                return NotFound();
            }

            vendedor.Activo = cambiarEstadoDto.Activo;
            _context.Entry(vendedor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VendedorExists(id))
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

        private bool VendedorExists(int id)
        {
            return _context.SorteosVendedores.Any(e => e.IdVendedor == id);
        }
    }
}