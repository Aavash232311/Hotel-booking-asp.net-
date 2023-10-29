using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking__Backup.Migrations
{
    /// <inheritdoc />
    public partial class HotelImageFix123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "userId",
                table: "Hotels",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_userId",
                table: "Hotels",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Users_userId",
                table: "Hotels",
                column: "userId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Users_userId",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_userId",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "Hotels");
        }
    }
}
