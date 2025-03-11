using TopFutbolAPI.Models;

namespace TopFutbolAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Asegurarse de que la base de datos existe
            context.Database.EnsureCreated();
            
            // Verificar si ya existen datos
            if (context.Sedes.Any() || context.Categorias.Any() || context.Formadores.Any())
            {
                return; // La base de datos ya tiene datos
            }

            // Agregar Sedes
            var sedes = new Sede[]
            {
                new Sede { Ciudad = "Madrid", NombreSede = "Centro Deportivo Madrid" },
                new Sede { Ciudad = "Barcelona", NombreSede = "Centro Deportivo Barcelona" },
                new Sede { Ciudad = "Valencia", NombreSede = "Centro Deportivo Valencia" }
            };

            context.Sedes.AddRange(sedes);
            context.SaveChanges();

            // Agregar Categorías
            var categorias = new Categoria[]
            {
                new Categoria { Nombre = "Infantil" },
                new Categoria { Nombre = "Juvenil" },
                new Categoria { Nombre = "Senior" }
            };

            context.Categorias.AddRange(categorias);
            context.SaveChanges();

            // Agregar Formadores
            var formadores = new Formador[]
            {
                new Formador { Nombre = "Juan Pérez", Telefono = "123456789" },
                new Formador { Nombre = "María López", Telefono = "987654321" },
                new Formador { Nombre = "Carlos Rodríguez", Telefono = "555666777" }
            };

            context.Formadores.AddRange(formadores);
            context.SaveChanges();

            // Agregar Alumnos con IDs de tipo string
            var alumnos = new Alumno[]
            {
                new Alumno {
                    ID = "A001",
                    Nombre = "Pedro",
                    Apellido = "García",
                    Email = "pedro@example.com",
                    Telefono = "111222333",
                    IdSede = 1,
                    IdCategoria = 1,
                    IdFormador = 1
                },
                new Alumno {
                    ID = "A002",
                    Nombre = "Ana",
                    Apellido = "Martínez",
                    Email = "ana@example.com",
                    Telefono = "444555666",
                    IdSede = 2,
                    IdCategoria = 2,
                    IdFormador = 2
                },
                new Alumno {
                    ID = "A003",
                    Nombre = "Luis",
                    Apellido = "Fernández",
                    Email = "luis@example.com",
                    Telefono = "777888999",
                    IdSede = 3,
                    IdCategoria = 3,
                    IdFormador = 3
                }
            };

            context.Alumnos.AddRange(alumnos);
            context.SaveChanges();
        }
    }
}