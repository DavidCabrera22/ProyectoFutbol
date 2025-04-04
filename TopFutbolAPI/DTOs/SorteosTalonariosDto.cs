using System;

namespace TopFutbolAPI.DTOs
{
    public class TalonarioDto
    {
        public int IdTalonario { get; set; }
        public int NumeroInicial { get; set; }
        public int NumeroFinal { get; set; }
        public int CantidadBoletas { get; set; }
        public decimal ValorBoleta { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Descripcion { get; set; }
        public bool Activo { get; set; }
        public int BoletasGeneradas { get; set; }
    }

    public class CrearTalonarioDto
{
    public int NumeroInicial { get; set; }
    public int NumeroFinal { get; set; }
    public decimal ValorBoleta { get; set; }
    public DateTime FechaSorteo { get; set; }
    public string Descripcion { get; set; }
    public bool Activo { get; set; }
    public int IdCategoria { get; set; }
    public int IdSorteo { get; set; } // Asegúrate de que esta propiedad exista
}

    public class ActualizarTalonarioDto
    {
        public int NumeroInicial { get; set; }
        public int NumeroFinal { get; set; }
        public decimal ValorBoleta { get; set; }
        public DateTime FechaSorteo { get; set; }
        public string Descripcion { get; set; }
        public bool Activo { get; set; }
    }
}