using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopFutbolAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCamposEstadoAlumno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "Alumnos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RecomendadoPor",
                table: "Alumnos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AlumnoInactivacionesHistorial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FechaInactivacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaReactivacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EstadoAnterior = table.Column<bool>(type: "bit", nullable: false),
                    EstadoNuevo = table.Column<bool>(type: "bit", nullable: false),
                    Motivo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UsuarioModificacion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlumnoInactivacionesHistorial", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlumnoInactivacionesHistorial_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlumnoInactivacionesHistorial_IdAlumno",
                table: "AlumnoInactivacionesHistorial",
                column: "IdAlumno");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlumnoInactivacionesHistorial");

            migrationBuilder.DropColumn(
                name: "Activo",
                table: "Alumnos");

            migrationBuilder.DropColumn(
                name: "RecomendadoPor",
                table: "Alumnos");
        }
    }
}
