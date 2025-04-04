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
    public class BalancesAlumnosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BalancesAlumnosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BalancesAlumnos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BalanceAlumnoDTO>>> GetBalancesAlumnos()
        {
            var balances = await _context.BalancesAlumnos
                .Include(b => b.Alumno)
                .Include(b => b.Sede)
                .Select(b => new BalanceAlumnoDTO
                {
                    IdBalance = b.IdBalance,
                    IdSede = b.IdSede,
                    NombreSede = b.Sede.NombreSede,
                    IdAlumno = b.IdAlumno,
                    NombreAlumno = b.Alumno.Nombre + " " + b.Alumno.Apellido,
                    Fecha = b.Fecha,
                    Valor = b.Valor
                })
                .ToListAsync();

            return balances;
        }

        // GET: api/BalancesAlumnos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BalanceAlumnoDTO>> GetBalanceAlumno(int id)
        {
            var balance = await _context.BalancesAlumnos
                .Include(b => b.Alumno)
                .Include(b => b.Sede)
                .FirstOrDefaultAsync(b => b.IdBalance == id);

            if (balance == null)
            {
                return NotFound();
            }

            var balanceDTO = new BalanceAlumnoDTO
            {
                IdBalance = balance.IdBalance,
                IdSede = balance.IdSede,
                NombreSede = balance.Sede.NombreSede,
                IdAlumno = balance.IdAlumno,
                NombreAlumno = balance.Alumno.Nombre + " " + balance.Alumno.Apellido,
                Fecha = balance.Fecha,
                Valor = balance.Valor
            };

            return balanceDTO;
        }

        // GET: api/BalancesAlumnos/alumno/A001
        [HttpGet("alumno/{idAlumno}")]
        public async Task<ActionResult<BalanceAlumnoDTO>> GetBalanceByAlumno(string idAlumno)
        {
            var balance = await _context.BalancesAlumnos
                .Include(b => b.Alumno)
                .Include(b => b.Sede)
                .FirstOrDefaultAsync(b => b.IdAlumno == idAlumno);

            if (balance == null)
            {
                return NotFound();
            }

            var balanceDTO = new BalanceAlumnoDTO
            {
                IdBalance = balance.IdBalance,
                IdSede = balance.IdSede,
                NombreSede = balance.Sede.NombreSede,
                IdAlumno = balance.IdAlumno,
                NombreAlumno = balance.Alumno.Nombre + " " + balance.Alumno.Apellido,
                Fecha = balance.Fecha,
                Valor = balance.Valor
            };

            return balanceDTO;
        }

        // GET: api/BalancesAlumnos/fecha/2023-01-01/2023-12-31
        [HttpGet("fecha/{fechaInicio}/{fechaFin}")]
        public async Task<ActionResult<IEnumerable<BalanceAlumnoDTO>>> GetBalancesByRangoFechas(DateTime fechaInicio, DateTime fechaFin)
        {
            var balances = await _context.BalancesAlumnos
                .Include(b => b.Alumno)
                .Include(b => b.Sede)
                .Where(b => b.Fecha >= fechaInicio && b.Fecha <= fechaFin)
                .Select(b => new BalanceAlumnoDTO
                {
                    IdBalance = b.IdBalance,
                    IdSede = b.IdSede,
                    NombreSede = b.Sede.NombreSede,
                    IdAlumno = b.IdAlumno,
                    NombreAlumno = b.Alumno.Nombre + " " + b.Alumno.Apellido,
                    Fecha = b.Fecha,
                    Valor = b.Valor
                })
                .ToListAsync();

            return balances;
        }

        // POST: api/BalancesAlumnos
        [HttpPost]
        public async Task<ActionResult<BalanceAlumnoDTO>> PostBalanceAlumno(BalanceAlumnoDTO balanceDTO)
        {
            var balance = new BalanceAlumno
            {
                IdSede = balanceDTO.IdSede,
                IdAlumno = balanceDTO.IdAlumno,
                Fecha = balanceDTO.Fecha,
                Valor = balanceDTO.Valor
            };

            _context.BalancesAlumnos.Add(balance);
            await _context.SaveChangesAsync();

            return await GetBalanceAlumno(balance.IdBalance);
        }

        // PUT: api/BalancesAlumnos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBalanceAlumno(int id, BalanceAlumnoDTO balanceDTO)
        {
            if (id != balanceDTO.IdBalance)
            {
                return BadRequest();
            }

            var balance = await _context.BalancesAlumnos.FindAsync(id);
            if (balance == null)
            {
                return NotFound();
            }

            balance.IdSede = balanceDTO.IdSede;
            balance.IdAlumno = balanceDTO.IdAlumno;
            balance.Fecha = balanceDTO.Fecha;
            balance.Valor = balanceDTO.Valor;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BalanceAlumnoExists(id))
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

        // DELETE: api/BalancesAlumnos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBalanceAlumno(int id)
        {
            var balance = await _context.BalancesAlumnos.FindAsync(id);
            if (balance == null)
            {
                return NotFound();
            }

            _context.BalancesAlumnos.Remove(balance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BalanceAlumnoExists(int id)
        {
            return _context.BalancesAlumnos.Any(e => e.IdBalance == id);
        }
    }
}