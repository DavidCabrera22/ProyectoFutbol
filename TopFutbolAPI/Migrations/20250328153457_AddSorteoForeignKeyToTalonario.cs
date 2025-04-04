using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopFutbolAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddSorteoForeignKeyToTalonario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdSorteo",
                table: "SorteosTalonarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SorteosTalonarios_IdSorteo",
                table: "SorteosTalonarios",
                column: "IdSorteo");

            migrationBuilder.AddForeignKey(
                name: "FK_SorteosTalonarios_Sorteos_IdSorteo",
                table: "SorteosTalonarios",
                column: "IdSorteo",
                principalTable: "Sorteos",
                principalColumn: "IdSorteo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SorteosTalonarios_Sorteos_IdSorteo",
                table: "SorteosTalonarios");

            migrationBuilder.DropIndex(
                name: "IX_SorteosTalonarios_IdSorteo",
                table: "SorteosTalonarios");

            migrationBuilder.DropColumn(
                name: "IdSorteo",
                table: "SorteosTalonarios");
        }
    }
}
