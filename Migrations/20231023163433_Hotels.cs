using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking__Backup.Migrations
{
    /// <inheritdoc />
    public partial class Hotels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hotels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseKey = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Toiletries = table.Column<bool>(type: "bit", nullable: false),
                    Treats_at_Turndown = table.Column<bool>(type: "bit", nullable: false),
                    Spa_like_Experience = table.Column<bool>(type: "bit", nullable: false),
                    Pillow_Options = table.Column<bool>(type: "bit", nullable: false),
                    Free_Breakfas = table.Column<bool>(type: "bit", nullable: false),
                    Free_WiFi_Access = table.Column<bool>(type: "bit", nullable: false),
                    In_Room_Coffee_and_Tea_Makers = table.Column<bool>(type: "bit", nullable: false),
                    Anytime_Front_Desk_Service = table.Column<bool>(type: "bit", nullable: false),
                    Gym_and_Fitness_Center = table.Column<bool>(type: "bit", nullable: false),
                    Swimming_Pool_and_Hot_Tub = table.Column<bool>(type: "bit", nullable: false),
                    Swimming_Pool = table.Column<bool>(type: "bit", nullable: false),
                    Business_Center_with_Printing_and_Fax_Services = table.Column<bool>(type: "bit", nullable: false),
                    Soundproofing = table.Column<bool>(type: "bit", nullable: false),
                    Safe_Box = table.Column<bool>(type: "bit", nullable: false),
                    Hair_Dryer = table.Column<bool>(type: "bit", nullable: false),
                    Refrigerator_Mini_Bar = table.Column<bool>(type: "bit", nullable: false),
                    Clean_Towels = table.Column<bool>(type: "bit", nullable: false),
                    Slippers = table.Column<bool>(type: "bit", nullable: false),
                    Ironing_Services = table.Column<bool>(type: "bit", nullable: false),
                    Kettle = table.Column<bool>(type: "bit", nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    checkIn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    checkOut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    image_1 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_2 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_3 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_4 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_5 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_6 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_7 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_8 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_9 = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    image_10 = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hotels", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Hotels");
        }
    }
}
