using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopFutbolAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Formadores",
                columns: table => new
                {
                    IdFormador = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Formadores", x => x.IdFormador);
                });

            migrationBuilder.CreateTable(
                name: "Sedes",
                columns: table => new
                {
                    IdSede = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ciudad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NombreSede = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sedes", x => x.IdSede);
                });

            migrationBuilder.CreateTable(
                name: "Servicios",
                columns: table => new
                {
                    IdServicio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servicios", x => x.IdServicio);
                });

            migrationBuilder.CreateTable(
                name: "SorteosTalonarios",
                columns: table => new
                {
                    IdTalonario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumeroInicial = table.Column<int>(type: "int", nullable: false),
                    NumeroFinal = table.Column<int>(type: "int", nullable: false),
                    CantidadBoletas = table.Column<int>(type: "int", nullable: false),
                    ValorBoleta = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaSorteo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SorteosTalonarios", x => x.IdTalonario);
                });

            migrationBuilder.CreateTable(
                name: "TiposMovimiento",
                columns: table => new
                {
                    IdTipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Estado = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposMovimiento", x => x.IdTipo);
                });

            migrationBuilder.CreateTable(
                name: "TiposRecaudo",
                columns: table => new
                {
                    IdTipoRecaudo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposRecaudo", x => x.IdTipoRecaudo);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                });

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    IdCategoria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdFormador = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.IdCategoria);
                    table.ForeignKey(
                        name: "FK_Categorias_Formadores_IdFormador",
                        column: x => x.IdFormador,
                        principalTable: "Formadores",
                        principalColumn: "IdFormador");
                });

            migrationBuilder.CreateTable(
                name: "Alumnos",
                columns: table => new
                {
                    ID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdSede = table.Column<int>(type: "int", nullable: false),
                    IdCategoria = table.Column<int>(type: "int", nullable: false),
                    IdFormador = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alumnos", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Alumnos_Categorias_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "Categorias",
                        principalColumn: "IdCategoria");
                    table.ForeignKey(
                        name: "FK_Alumnos_Formadores_IdFormador",
                        column: x => x.IdFormador,
                        principalTable: "Formadores",
                        principalColumn: "IdFormador");
                    table.ForeignKey(
                        name: "FK_Alumnos_Sedes_IdSede",
                        column: x => x.IdSede,
                        principalTable: "Sedes",
                        principalColumn: "IdSede");
                });

            migrationBuilder.CreateTable(
                name: "Sorteos",
                columns: table => new
                {
                    IdSorteo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdCategoria = table.Column<int>(type: "int", nullable: false),
                    ValorBoleta = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaSorteo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Premio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalBoletas = table.Column<int>(type: "int", nullable: false),
                    BoletasVendidas = table.Column<int>(type: "int", nullable: false),
                    BoletasDisponibles = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sorteos", x => x.IdSorteo);
                    table.ForeignKey(
                        name: "FK_Sorteos_Categorias_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "Categorias",
                        principalColumn: "IdCategoria");
                });

            migrationBuilder.CreateTable(
                name: "BalancesAlumnos",
                columns: table => new
                {
                    IdBalance = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IdSede = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BalancesAlumnos", x => x.IdBalance);
                    table.ForeignKey(
                        name: "FK_BalancesAlumnos_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_BalancesAlumnos_Sedes_IdSede",
                        column: x => x.IdSede,
                        principalTable: "Sedes",
                        principalColumn: "IdSede");
                });

            migrationBuilder.CreateTable(
                name: "Movimientos",
                columns: table => new
                {
                    IdMovimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IdTipo = table.Column<int>(type: "int", nullable: false),
                    IdSede = table.Column<int>(type: "int", nullable: false),
                    IdTipoRecaudo = table.Column<int>(type: "int", nullable: false),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IdServicio = table.Column<int>(type: "int", nullable: false),
                    Caja = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Soporte = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Hora = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimientos", x => x.IdMovimiento);
                    table.ForeignKey(
                        name: "FK_Movimientos_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Movimientos_Sedes_IdSede",
                        column: x => x.IdSede,
                        principalTable: "Sedes",
                        principalColumn: "IdSede");
                    table.ForeignKey(
                        name: "FK_Movimientos_Servicios_IdServicio",
                        column: x => x.IdServicio,
                        principalTable: "Servicios",
                        principalColumn: "IdServicio");
                    table.ForeignKey(
                        name: "FK_Movimientos_TiposMovimiento_IdTipo",
                        column: x => x.IdTipo,
                        principalTable: "TiposMovimiento",
                        principalColumn: "IdTipo");
                    table.ForeignKey(
                        name: "FK_Movimientos_TiposRecaudo_IdTipoRecaudo",
                        column: x => x.IdTipoRecaudo,
                        principalTable: "TiposRecaudo",
                        principalColumn: "IdTipoRecaudo");
                });

            migrationBuilder.CreateTable(
                name: "SorteoBoletas",
                columns: table => new
                {
                    IdBoleta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSorteo = table.Column<int>(type: "int", nullable: false),
                    IdTalonario = table.Column<int>(type: "int", nullable: false),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NumeroBoleta = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NombreComprador = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TelefonoComprador = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaVenta = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaAsignacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SorteoBoletas", x => x.IdBoleta);
                    table.ForeignKey(
                        name: "FK_SorteoBoletas_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_SorteoBoletas_SorteosTalonarios_IdTalonario",
                        column: x => x.IdTalonario,
                        principalTable: "SorteosTalonarios",
                        principalColumn: "IdTalonario");
                    table.ForeignKey(
                        name: "FK_SorteoBoletas_Sorteos_IdSorteo",
                        column: x => x.IdSorteo,
                        principalTable: "Sorteos",
                        principalColumn: "IdSorteo");
                });

            migrationBuilder.CreateTable(
                name: "SorteoMovimientos",
                columns: table => new
                {
                    IdMovimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IdBoleta = table.Column<int>(type: "int", nullable: false),
                    Concepto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Referencia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SorteoMovimientos", x => x.IdMovimiento);
                    table.ForeignKey(
                        name: "FK_SorteoMovimientos_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_SorteoMovimientos_SorteoBoletas_IdBoleta",
                        column: x => x.IdBoleta,
                        principalTable: "SorteoBoletas",
                        principalColumn: "IdBoleta");
                });

            migrationBuilder.CreateTable(
                name: "SorteoPagos",
                columns: table => new
                {
                    IdPago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdBoleta = table.Column<int>(type: "int", nullable: false),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaPago = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MetodoPago = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Referencia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SorteoPagos", x => x.IdPago);
                    table.ForeignKey(
                        name: "FK_SorteoPagos_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_SorteoPagos_SorteoBoletas_IdBoleta",
                        column: x => x.IdBoleta,
                        principalTable: "SorteoBoletas",
                        principalColumn: "IdBoleta");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_IdCategoria",
                table: "Alumnos",
                column: "IdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_IdFormador",
                table: "Alumnos",
                column: "IdFormador");

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_IdSede",
                table: "Alumnos",
                column: "IdSede");

            migrationBuilder.CreateIndex(
                name: "IX_BalancesAlumnos_IdAlumno",
                table: "BalancesAlumnos",
                column: "IdAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_BalancesAlumnos_IdSede",
                table: "BalancesAlumnos",
                column: "IdSede");

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_IdFormador",
                table: "Categorias",
                column: "IdFormador");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_IdAlumno",
                table: "Movimientos",
                column: "IdAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_IdSede",
                table: "Movimientos",
                column: "IdSede");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_IdServicio",
                table: "Movimientos",
                column: "IdServicio");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_IdTipo",
                table: "Movimientos",
                column: "IdTipo");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_IdTipoRecaudo",
                table: "Movimientos",
                column: "IdTipoRecaudo");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoBoletas_IdAlumno",
                table: "SorteoBoletas",
                column: "IdAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoBoletas_IdSorteo",
                table: "SorteoBoletas",
                column: "IdSorteo");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoBoletas_IdTalonario",
                table: "SorteoBoletas",
                column: "IdTalonario");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoMovimientos_IdAlumno",
                table: "SorteoMovimientos",
                column: "IdAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoMovimientos_IdBoleta",
                table: "SorteoMovimientos",
                column: "IdBoleta");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoPagos_IdAlumno",
                table: "SorteoPagos",
                column: "IdAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_SorteoPagos_IdBoleta",
                table: "SorteoPagos",
                column: "IdBoleta");

            migrationBuilder.CreateIndex(
                name: "IX_Sorteos_IdCategoria",
                table: "Sorteos",
                column: "IdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BalancesAlumnos");

            migrationBuilder.DropTable(
                name: "Movimientos");

            migrationBuilder.DropTable(
                name: "SorteoMovimientos");

            migrationBuilder.DropTable(
                name: "SorteoPagos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Servicios");

            migrationBuilder.DropTable(
                name: "TiposMovimiento");

            migrationBuilder.DropTable(
                name: "TiposRecaudo");

            migrationBuilder.DropTable(
                name: "SorteoBoletas");

            migrationBuilder.DropTable(
                name: "Alumnos");

            migrationBuilder.DropTable(
                name: "SorteosTalonarios");

            migrationBuilder.DropTable(
                name: "Sorteos");

            migrationBuilder.DropTable(
                name: "Sedes");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropTable(
                name: "Formadores");
        }
    }
}
