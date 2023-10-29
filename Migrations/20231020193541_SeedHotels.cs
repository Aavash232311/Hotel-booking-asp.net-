using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking__Backup.Migrations
{
    /// <inheritdoc />
    public partial class SeedHotels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            for (int i = 0; i <= 200; i++)
            {
                //for integers
                Random r = new Random();
                int rInt = r.Next(0, 4);
                migrationBuilder.InsertData(
                table: "Comapnies",
                columns: new[] { "Id", "Name", "Description", "Rating", "CompanyContactNumber", "CompanyId", "CreatedDate" },
                values: new object[] { Guid.NewGuid(), "Hotel-" + i, "Description...", rInt, 9813180, Guid.NewGuid(), DateTime.Now}
            );
            }
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
