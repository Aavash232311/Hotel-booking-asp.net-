using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace Bespeaking__Backup.Migrations
{
    public partial class SuperUserSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Name", "Email", "Password", "Address", "Username", "Salt", "OnTimePassword", "IsActive", "JoinedDate", "RefreshToken", "DateCreated", "DateExpires" },
                values: new object[] { Guid.NewGuid(), "Aavash", "aavash3150@.com", new byte[0], "Kathmandu Nepal", "admin", new byte[0], 123456, true, DateTime.UtcNow, "", DateTime.UtcNow, DateTime.UtcNow.AddDays(7) }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("the-guid-of-the-user-you-inserted")
            );
        }
    }
}

