using TopFutbolAPI.Models;
using System;
using System.Linq;

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

            // Agregar Formadores
            var formadores = new Formador[]
            {
                new Formador { Nombre = "Juan Pérez", Telefono = "123456789", Activo = true },
                new Formador { Nombre = "María López", Telefono = "987654321", Activo = true },
                new Formador { Nombre = "Carlos Rodríguez", Telefono = "555666777", Activo = true }
            };

            context.Formadores.AddRange(formadores);
            context.SaveChanges();

            // Agregar Categorías
          // ... existing code ...

           // Agregar Categorías
            var categorias = new Categoria[]
            {
               new Categoria { IdCategoria = 1, Nombre = "Infantil" },
               new Categoria { IdCategoria = 2, Nombre = "Juvenil" },
               new Categoria { IdCategoria = 3, Nombre = "Senior" }
            };

context.Categorias.AddRange(categorias);
context.SaveChanges();

// ... existing code ...

            // Agregar Tipos de Movimiento
            var tiposMovimiento = new TipoMovimiento[]
            {
                new TipoMovimiento { Nombre = "Ingreso", Estado = 0 },
                new TipoMovimiento { Nombre = "Egreso", Estado = 1 },
                new TipoMovimiento { Nombre = "Transferencia", Estado = 0 }
            };

            context.TiposMovimiento.AddRange(tiposMovimiento);
            context.SaveChanges();

            // Agregar Servicios
            var servicios = new Servicio[]
            {
                new Servicio { Nombre = "Matrícula", Valor = 100.00m },
                new Servicio { Nombre = "Mensualidad", Valor = 50.00m },
                new Servicio { Nombre = "Equipamiento", Valor = 75.00m }
            };

            context.Servicios.AddRange(servicios);
            context.SaveChanges();

            // Agregar Tipos de Recaudo
            var tiposRecaudo = new TipoRecaudo[]
            {
                new TipoRecaudo { Nombre = "Efectivo" },
                new TipoRecaudo { Nombre = "Tarjeta de Crédito" },
                new TipoRecaudo { Nombre = "Transferencia Bancaria" }
            };

            context.TiposRecaudo.AddRange(tiposRecaudo);
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

            // Agregar algunos movimientos de ejemplo
            var movimientos = new Movimiento[]
            {
                new Movimiento {
                    Fecha = DateTime.Now.AddDays(-10),
                    Valor = 100.00m,
                    IdTipo = 1,
                    IdSede = 1,
                    IdTipoRecaudo = 1,
                    IdAlumno = "A001",
                    IdServicio = 1,
                    Caja = "Caja 1",
                    Soporte = "Recibo 001",
                    Hora = DateTime.Now.TimeOfDay
                },
                new Movimiento {
                    Fecha = DateTime.Now.AddDays(-5),
                    Valor = 50.00m,
                    IdTipo = 1,
                    IdSede = 2,
                    IdTipoRecaudo = 2,
                    IdAlumno = "A002",
                    IdServicio = 2,
                    Caja = "Caja 2",
                    Soporte = "Recibo 002",
                    Hora = DateTime.Now.TimeOfDay
                }
            };

            context.Movimientos.AddRange(movimientos);
            context.SaveChanges();

            // Agregar balances iniciales
            var balances = new BalanceAlumno[]
            {
                new BalanceAlumno {
                    IdSede = 1,
                    IdAlumno = "A001",
                    Fecha = DateTime.Now,
                    Valor = 100.00m
                },
                new BalanceAlumno {
                    IdSede = 2,
                    IdAlumno = "A002",
                    Fecha = DateTime.Now,
                    Valor = 50.00m
                },
                new BalanceAlumno {
                    IdSede = 3,
                    IdAlumno = "A003",
                    Fecha = DateTime.Now,
                    Valor = 0.00m
                }
            };

            context.BalancesAlumnos.AddRange(balances);
            context.SaveChanges();
        }
    }
}