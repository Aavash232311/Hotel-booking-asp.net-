using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking__Backup.Migrations
{
    /// <inheritdoc />
    public partial class SeedRichUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "username", "password", "email", "phone", "city", "Address", "DateJoined", "RefreshToken", "DateCreated", "BlackListToken" },
                values: new object[] { Guid.NewGuid(), "Aavash", "aavash123", "aavash3150@gmail.com", "9813180333", "Kathmandu", "Mulpani", DateTime.Now, "", DateTime.Now, DateTime.Now }
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
