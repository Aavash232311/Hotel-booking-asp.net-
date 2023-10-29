using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking__Backup.Migrations
{
    /// <inheritdoc />
    public partial class SeedTempUser123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "username", "password", "email", "phone", "city", "Address", "DateJoined", "RefreshToken", "DateCreated", "BlackListToken" },
                values: new object[] { "898369D1-C0F1-4196-F1EE-08DBCFCC1361", "user1", "aavash123", "aavash3150@gmail.com", "9813180333", "Kathmandu", "Mulpani", DateTime.Now, "", DateTime.Now, DateTime.Now }
            );
            migrationBuilder.InsertData(
            table: "Roles",
            columns: new[] { "Id", "UserId", "RoleId" },
            values: new object[] { 1, "898369D1-C0F1-4196-F1EE-08DBCFCC1361", "2" }
        );

            migrationBuilder.InsertData(
              table: "Users",
              columns: new[] { "Id", "username", "password", "email", "phone", "city", "Address", "DateJoined", "RefreshToken", "DateCreated", "BlackListToken" },
              values: new object[] { "898369D1-C0F1-4196-F1EE-08DBCFCC1365", "user2", "aavash123", "aavash3150@gmail.com", "9813180333", "Kathmandu", "Mulpani", DateTime.Now, "", DateTime.Now, DateTime.Now }
          );
            migrationBuilder.InsertData(
       table: "Roles",
       columns: new[] { "Id", "UserId", "RoleId" },
       values: new object[] { 45, "898369D1-C0F1-4196-F1EE-08DBCFCC1365", "2" }
   );

            migrationBuilder.InsertData(
              table: "Users",
              columns: new[] { "Id", "username", "password", "email", "phone", "city", "Address", "DateJoined", "RefreshToken", "DateCreated", "BlackListToken" },
              values: new object[] { "898369D1-C0F1-4196-F1EE-08DBCFCC1362", "user3", "aavash123", "aavash3150@gmail.com", "9813180333", "Kathmandu", "Mulpani", DateTime.Now, "", DateTime.Now, DateTime.Now }
          );
            migrationBuilder.InsertData(
 table: "Roles",
 columns: new[] { "Id", "UserId", "RoleId" },
 values: new object[] { 98, "898369D1-C0F1-4196-F1EE-08DBCFCC1362", "2" }
);
            migrationBuilder.InsertData(
              table: "Users",
              columns: new[] { "Id", "username", "password", "email", "phone", "city", "Address", "DateJoined", "RefreshToken", "DateCreated", "BlackListToken" },
              values: new object[] { "898369D1-C0F1-4196-F1EE-08DBCFCC1360", "user4", "aavash123", "aavash3150@gmail.com", "9813180333", "Kathmandu", "Mulpani", DateTime.Now, "", DateTime.Now, DateTime.Now }
          );
            migrationBuilder.InsertData(
table: "Roles",
columns: new[] { "Id", "UserId", "RoleId" },
values: new object[] { 12, "898369D1-C0F1-4196-F1EE-08DBCFCC1360", "2" }
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
