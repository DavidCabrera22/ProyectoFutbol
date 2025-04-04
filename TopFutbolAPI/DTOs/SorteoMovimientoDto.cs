using System;

namespace TopFutbolAPI.DTOs
{
    public class SorteoMovimientoDto
    {
        public int IdMovimiento { get; set; }
        public string IdAlumno { get; set; }
        public string NombreAlumno { get; set; }
        public int IdBoleta { get; set; }
        public int NumeroBoleta { get; set; }
        public string Concepto { get; set; }
        public string Tipo { get; set; }
        public DateTime Fecha { get; set; }
        public string Referencia { get; set; }
        public decimal Monto { get; set; }
        public string Estado { get; set; }
        public string Observaciones { get; set; }
    }

    public class CrearMovimientoDto
    {
        public string IdAlumno { get; set; }
        public int IdBoleta { get; set; }
        public string Concepto { get; set; }
        public string Tipo { get; set; }
        public string Referencia { get; set; }
        public decimal Monto { get; set; }
        public string Observaciones { get; set; }
    }

    public class ActualizarMovimientoDto
    {
        public string Concepto { get; set; }
        public string Tipo { get; set; }
        public string Referencia { get; set; }
        public decimal Monto { get; set; }
        public string Estado { get; set; }
        public string Observaciones { get; set; }
    }
}