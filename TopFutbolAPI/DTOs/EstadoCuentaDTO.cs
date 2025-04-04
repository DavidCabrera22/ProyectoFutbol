using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TopFutbolAPI.DTOs
{
    public class EstadoCuentaDTO
    {
        public int IdServicio { get; set; }
        public string NombreServicio { get; set; } = string.Empty;
        public decimal ValorTotal { get; set; }
        public decimal Abonado { get; set; }
        public decimal Saldo { get; set; }
        public bool EstaAlDia { get; set; }
        public string UltimoPago { get; set; } = string.Empty;
        public string MetodoPago { get; set; } = string.Empty;
        public string NumeroSoporte { get; set; } = string.Empty; 
    }
}



       
  