using System;

namespace TopFutbolAPI.DTOs
{
    public class BalanceAlumnoDTO
    {
        public int IdBalance { get; set; }
        public int IdSede { get; set; }
        public string NombreSede { get; set; }
        public string IdAlumno { get; set; }
        public string NombreAlumno { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Valor { get; set; }
    }
}