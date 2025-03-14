using System;

namespace TopFutbolAPI.DTOs
{
    public class SaldoDTO
    {
        public int IdSaldo { get; set; }
        public int IdSede { get; set; }
        public string NombreSede { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public decimal Valor { get; set; }
    }
}