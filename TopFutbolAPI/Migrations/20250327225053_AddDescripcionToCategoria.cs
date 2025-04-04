using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopFutbolAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDescripcionToCategoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoriaIdCategoria",
                table: "Categorias",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_CategoriaIdCategoria",
                table: "Categorias",
                column: "CategoriaIdCategoria");

            migrationBuilder.AddForeignKey(
                name: "FK_Categorias_Categorias_CategoriaIdCategoria",
                table: "Categorias",
                column: "CategoriaIdCategoria",
                principalTable: "Categorias",
                principalColumn: "IdCategoria");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categorias_Categorias_CategoriaIdCategoria",
                table: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Categorias_CategoriaIdCategoria",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "CategoriaIdCategoria",
                table: "Categorias");
        }
    }
}
