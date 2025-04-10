namespace TopFutbolAPI.DTOs
{
    public class AlumnoDTO
    {
        public string ID { get; set; } = string.Empty; // Cambiado de Id a ID para coincidir con el controlador
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public int IdSede { get; set; }
        public int IdCategoria { get; set; }
        public int IdFormador { get; set; }
        public bool Activo { get; set; } = true;
        public string RecomendadoPor { get; set; } = string.Empty;
        public string MotivoInactividad { get; set; } = string.Empty;
    }
}