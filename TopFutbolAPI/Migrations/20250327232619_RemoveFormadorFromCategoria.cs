using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopFutbolAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFormadorFromCategoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categorias_Categorias_CategoriaIdCategoria",
                table: "Categorias");

            migrationBuilder.DropForeignKey(
                name: "FK_Categorias_Formadores_IdFormador",
                table: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Categorias_IdFormador",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "IdFormador",
                table: "Categorias");

            migrationBuilder.RenameColumn(
                name: "CategoriaIdCategoria",
                table: "Categorias",
                newName: "FormadorIdFormador");

            migrationBuilder.RenameIndex(
                name: "IX_Categorias_CategoriaIdCategoria",
                table: "Categorias",
                newName: "IX_Categorias_FormadorIdFormador");

            migrationBuilder.AddForeignKey(
                name: "FK_Categorias_Formadores_FormadorIdFormador",
                table: "Categorias",
                column: "FormadorIdFormador",
                principalTable: "Formadores",
                principalColumn: "IdFormador");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categorias_Formadores_FormadorIdFormador",
                table: "Categorias");

            migrationBuilder.RenameColumn(
                name: "FormadorIdFormador",
                table: "Categorias",
                newName: "CategoriaIdCategoria");

            migrationBuilder.RenameIndex(
                name: "IX_Categorias_FormadorIdFormador",
                table: "Categorias",
                newName: "IX_Categorias_CategoriaIdCategoria");

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Categorias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "IdFormador",
                table: "Categorias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_IdFormador",
                table: "Categorias",
                column: "IdFormador");

            migrationBuilder.AddForeignKey(
                name: "FK_Categorias_Categorias_CategoriaIdCategoria",
                table: "Categorias",
                column: "CategoriaIdCategoria",
                principalTable: "Categorias",
                principalColumn: "IdCategoria");

            migrationBuilder.AddForeignKey(
                name: "FK_Categorias_Formadores_IdFormador",
                table: "Categorias",
                column: "IdFormador",
                principalTable: "Formadores",
                principalColumn: "IdFormador");
        }
    }
}
