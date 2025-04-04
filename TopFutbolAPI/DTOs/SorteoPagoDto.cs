using System;

namespace TopFutbolAPI.DTOs
{
    public class SorteoPagoDto
    {
        public int IdPago { get; set; }
        public int IdBoleta { get; set; }
        public int NumeroBoleta { get; set; }
        public string IdAlumno { get; set; }
        public string NombreAlumno { get; set; }
        public decimal Monto { get; set; }
        public DateTime FechaPago { get; set; }
        public string MetodoPago { get; set; }
        public string Referencia { get; set; }
        public string Estado { get; set; }
        public string Observaciones { get; set; }
        public string ImagenSoporte { get; set; }
    }

    public class CrearPagoDto
    {
        public int IdBoleta { get; set; }
        public string IdAlumno { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public string Referencia { get; set; }
        public string Observaciones { get; set; }
        public string ImagenSoporte { get; set; }
    }

    public class ActualizarPagoDto
    {
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public string Referencia { get; set; }
        public string Estado { get; set; }
        public string Observaciones { get; set; }
        public string ImagenSoporte { get; set; }
    }

    public class ActualizarImagenDto
    {
        public string ImagenSoporte { get; set; }
    }

    public class ActualizarEstadoDto
    {
        public string Estado { get; set; }
    }
}