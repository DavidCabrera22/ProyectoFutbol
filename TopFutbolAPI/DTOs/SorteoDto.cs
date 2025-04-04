using System;
using System.Collections.Generic;

namespace TopFutbolAPI.DTOs
{
    public class SorteoDto
    {
        public int IdSorteo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; }
        public decimal ValorBoleta { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Premio { get; set; }
        public string Estado { get; set; }
        public int TotalBoletas { get; set; }
        public int BoletasVendidas { get; set; }
        public int BoletasDisponibles { get; set; }
    }

    public class CrearSorteoDto
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int IdCategoria { get; set; }
        public decimal ValorBoleta { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Premio { get; set; }
    }

    public class ActualizarSorteoDto
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal ValorBoleta { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Premio { get; set; }
        public string Estado { get; set; }
    }
}