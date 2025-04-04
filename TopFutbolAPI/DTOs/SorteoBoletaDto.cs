using System;

namespace TopFutbolAPI.DTOs
{
    public class SorteoBoletaDto
    {
        public int IdBoleta { get; set; }
        public int IdSorteo { get; set; }
        public int IdTalonario { get; set; }
        public string IdAlumno { get; set; }
        public string NombreAlumno { get; set; }
        public string NumeroBoleta { get; set; }
        public string Estado { get; set; }
        public string NombreComprador { get; set; }
        public string TelefonoComprador { get; set; }
        public DateTime? FechaVenta { get; set; }
        public DateTime? FechaAsignacion { get; set; }
        public string Observaciones { get; set; }
    }

    public class ActualizarBoletaDto
    {
        public string Estado { get; set; }
        public string NombreComprador { get; set; }
        public string TelefonoComprador { get; set; }
        public string Observaciones { get; set; }
    }

    public class VenderBoletaDto
    {
        public string NombreComprador { get; set; }
        public string TelefonoComprador { get; set; }
        public string Observaciones { get; set; }
    }

    public class AsignarBoletaDto
    {
        public string IdAlumno { get; set; }
        public string Observaciones { get; set; }
    }

    public class AsignarLoteBoletasDto
    {
        public int IdTalonario { get; set; }
        public string IdAlumno { get; set; }
        public int Cantidad { get; set; }
    }
}