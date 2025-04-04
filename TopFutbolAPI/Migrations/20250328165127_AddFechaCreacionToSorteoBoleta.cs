using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopFutbolAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFechaCreacionToSorteoBoleta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdVendedor",
                table: "SorteoBoletas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SorteosVendedores",
                columns: table => new
                {
                    IdVendedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdAlumno = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SorteosVendedores", x => x.IdVendedor);
                    table.ForeignKey(
                        name: "FK_SorteosVendedores_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SorteoBoletas_IdVendedor",
                table: "SorteoBoletas",
                column: "IdVendedor");

            migrationBuilder.CreateIndex(
                name: "IX_SorteosVendedores_IdAlumno",
                table: "SorteosVendedores",
                column: "IdAlumno");

            migrationBuilder.AddForeignKey(
                name: "FK_SorteoBoletas_SorteosVendedores_IdVendedor",
                table: "SorteoBoletas",
                column: "IdVendedor",
                principalTable: "SorteosVendedores",
                principalColumn: "IdVendedor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SorteoBoletas_SorteosVendedores_IdVendedor",
                table: "SorteoBoletas");

            migrationBuilder.DropTable(
                name: "SorteosVendedores");

            migrationBuilder.DropIndex(
                name: "IX_SorteoBoletas_IdVendedor",
                table: "SorteoBoletas");

            migrationBuilder.DropColumn(
                name: "IdVendedor",
                table: "SorteoBoletas");
        }
    }
}
