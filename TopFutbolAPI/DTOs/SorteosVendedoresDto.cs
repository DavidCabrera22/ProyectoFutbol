using System;

namespace TopFutbolAPI.DTOs
{
    // Add the Documento property to your VendedorDto class
public class VendedorDto
{
    public int IdVendedor { get; set; }
    public string IdAlumno { get; set; }
    public string NombreAlumno { get; set; }
    public string Apellido { get; set; }
    public string Documento { get; set; } // Add this property
    public string Telefono { get; set; }
    public string Email { get; set; }
    public DateTime FechaRegistro { get; set; }
    public bool Activo { get; set; }
    public int BoletasAsignadas { get; set; }
    public int BoletasVendidas { get; set; }
}

    public class CrearVendedorDto
    {
        public string IdAlumno { get; set; }
        public bool Activo { get; set; } = true;
    }

    public class ActualizarVendedorDto
    {
        public int IdVendedor { get; set; }
        public bool Activo { get; set; }
    }

    public class CambiarEstadoVendedorDto
    {
        public bool Activo { get; set; }
    }
}