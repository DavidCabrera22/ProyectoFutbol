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
    public class SorteosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SorteosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Sorteos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SorteoDto>>> GetSorteos()
        {
            var sorteos = await _context.Sorteos
                .Include(s => s.Categoria)
                .Include(s => s.Boletas)
                .ToListAsync();

            return sorteos.Select(s => new SorteoDto
            {
                IdSorteo = s.IdSorteo,
                Nombre = s.Nombre ?? "",
                Descripcion = s.Descripcion ?? "",
                IdCategoria = s.IdCategoria,
                NombreCategoria = s.Categoria?.Nombre ?? "",
                ValorBoleta = s.ValorBoleta,
                FechaInicio = s.FechaInicio,
                FechaSorteo = s.FechaSorteo,
                Premio = s.Premio ?? "",
                Estado = s.Estado ?? "",
                TotalBoletas = s.Boletas?.Count ?? 0,
                BoletasVendidas = s.Boletas?.Count(b => b.Estado == "Vendida") ?? 0,
                BoletasDisponibles = s.Boletas?.Count(b => b.Estado == "Disponible") ?? 0
            }).ToList();
        }

        // GET: api/Sorteos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SorteoDto>> GetSorteo(int id)
        {
            var sorteo = await _context.Sorteos
                .Include(s => s.Categoria)
                .Include(s => s.Boletas)
                .FirstOrDefaultAsync(s => s.IdSorteo == id);

            if (sorteo == null)
            {
                return NotFound();
            }

            return new SorteoDto
            {
                IdSorteo = sorteo.IdSorteo,
                Nombre = sorteo.Nombre ?? "",
                Descripcion = sorteo.Descripcion ?? "",
                IdCategoria = sorteo.IdCategoria,
                NombreCategoria = sorteo.Categoria?.Nombre ?? "",
                ValorBoleta = sorteo.ValorBoleta,
                FechaInicio = sorteo.FechaInicio,
                FechaSorteo = sorteo.FechaSorteo,
                Premio = sorteo.Premio ?? "",
                Estado = sorteo.Estado ?? "",
                TotalBoletas = sorteo.Boletas?.Count ?? 0,
                BoletasVendidas = sorteo.Boletas?.Count(b => b.Estado == "Vendida") ?? 0,
                BoletasDisponibles = sorteo.Boletas?.Count(b => b.Estado == "Disponible") ?? 0
            };
        }

        // POST: api/Sorteos
        [HttpPost]
        public async Task<ActionResult<SorteoDto>> CreateSorteo(CrearSorteoDto crearSorteoDto)
        {
            var sorteo = new Sorteo
            {
                Nombre = crearSorteoDto.Nombre,
                Descripcion = crearSorteoDto.Descripcion,
                IdCategoria = crearSorteoDto.IdCategoria,
                ValorBoleta = crearSorteoDto.ValorBoleta,
                FechaInicio = crearSorteoDto.FechaInicio,
                FechaSorteo = crearSorteoDto.FechaSorteo,
                Premio = crearSorteoDto.Premio,
                Estado = "Activo"
            };

            _context.Sorteos.Add(sorteo);
            await _context.SaveChangesAsync();

            return await GetSorteo(sorteo.IdSorteo);
        }

        // PUT: api/Sorteos/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SorteoDto>> UpdateSorteo(int id, ActualizarSorteoDto actualizarSorteoDto)
        {
            var sorteo = await _context.Sorteos.FindAsync(id);
            if (sorteo == null)
            {
                return NotFound();
            }

            sorteo.Nombre = actualizarSorteoDto.Nombre;
            sorteo.Descripcion = actualizarSorteoDto.Descripcion;
            sorteo.ValorBoleta = actualizarSorteoDto.ValorBoleta;
            sorteo.FechaSorteo = actualizarSorteoDto.FechaSorteo;
            sorteo.Premio = actualizarSorteoDto.Premio;
            sorteo.Estado = actualizarSorteoDto.Estado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SorteoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return await GetSorteo(id);
        }

        // DELETE: api/Sorteos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSorteo(int id)
        {
            var sorteo = await _context.Sorteos.FindAsync(id);
            if (sorteo == null)
            {
                return NotFound();
            }

            _context.Sorteos.Remove(sorteo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SorteoExists(int id)
        {
            return _context.Sorteos.Any(e => e.IdSorteo == id);
        }
    }
}