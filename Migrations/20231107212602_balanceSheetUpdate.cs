using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking.Migrations
{
    /// <inheritdoc />
    public partial class balanceSheetUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BalanceSheets_Rooms_productId",
                table: "BalanceSheets");

            migrationBuilder.DropIndex(
                name: "IX_BalanceSheets_productId",
                table: "BalanceSheets");

            migrationBuilder.DropColumn(
                name: "productId",
                table: "BalanceSheets");

            migrationBuilder.AddColumn<string>(
                name: "room",
                table: "BalanceSheets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "room",
                table: "BalanceSheets");

            migrationBuilder.AddColumn<int>(
                name: "productId",
                table: "BalanceSheets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BalanceSheets_productId",
                table: "BalanceSheets",
                column: "productId");

            migrationBuilder.AddForeignKey(
                name: "FK_BalanceSheets_Rooms_productId",
                table: "BalanceSheets",
                column: "productId",
                principalTable: "Rooms",
                principalColumn: "Id");
        }
    }
}
