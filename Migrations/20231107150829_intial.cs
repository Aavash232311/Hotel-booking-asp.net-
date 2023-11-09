using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking.Migrations
{
    /// <inheritdoc />
    public partial class intial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comapnies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Rating = table.Column<int>(type: "int", maxLength: 5, nullable: false),
                    CompanyContactNumber = table.Column<int>(type: "int", maxLength: 11, nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comapnies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    city = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateJoined = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BlackListToken = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Esewas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MerchantKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    userId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Esewas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Esewas_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Hotels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseKey = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    position = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Toiletries = table.Column<bool>(type: "bit", nullable: true),
                    Treats_at_Turndown = table.Column<bool>(type: "bit", nullable: true),
                    Spa_like_Experience = table.Column<bool>(type: "bit", nullable: true),
                    Pillow_Options = table.Column<bool>(type: "bit", nullable: true),
                    Free_Breakfas = table.Column<bool>(type: "bit", nullable: true),
                    Free_WiFi_Access = table.Column<bool>(type: "bit", nullable: true),
                    In_Room_Coffee_and_Tea_Makers = table.Column<bool>(type: "bit", nullable: true),
                    Anytime_Front_Desk_Service = table.Column<bool>(type: "bit", nullable: true),
                    Gym_and_Fitness_Center = table.Column<bool>(type: "bit", nullable: true),
                    Swimming_Pool_and_Hot_Tub = table.Column<bool>(type: "bit", nullable: true),
                    Swimming_Pool = table.Column<bool>(type: "bit", nullable: true),
                    Business_Center_with_Printing_and_Fax_Services = table.Column<bool>(type: "bit", nullable: true),
                    Soundproofing = table.Column<bool>(type: "bit", nullable: true),
                    Safe_Box = table.Column<bool>(type: "bit", nullable: true),
                    Hair_Dryer = table.Column<bool>(type: "bit", nullable: true),
                    Refrigerator_Mini_Bar = table.Column<bool>(type: "bit", nullable: true),
                    Clean_Towels = table.Column<bool>(type: "bit", nullable: true),
                    Slippers = table.Column<bool>(type: "bit", nullable: true),
                    Ironing_Services = table.Column<bool>(type: "bit", nullable: true),
                    Kettle = table.Column<bool>(type: "bit", nullable: true),
                    description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    checkIn = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    checkOut = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    image_1 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    image_2 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_3 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_4 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_5 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_6 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_7 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_8 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_9 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    image_10 = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    live = table.Column<bool>(type: "bit", nullable: false),
                    userId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hotels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hotels_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    esewaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Esewas_esewaId",
                        column: x => x.esewaId,
                        principalTable: "Esewas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    roomSize = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", maxLength: 10, nullable: false),
                    discount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    roomImage = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    NumberOfBed = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    hotelId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rooms_Hotels_hotelId",
                        column: x => x.hotelId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BalanceSheets",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    clientId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    discount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    api = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    pid = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    metchantKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    productId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BalanceSheets", x => x.id);
                    table.ForeignKey(
                        name: "FK_BalanceSheets_Rooms_productId",
                        column: x => x.productId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BalanceSheets_Users_clientId",
                        column: x => x.clientId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BalanceSheets_clientId",
                table: "BalanceSheets",
                column: "clientId");

            migrationBuilder.CreateIndex(
                name: "IX_BalanceSheets_productId",
                table: "BalanceSheets",
                column: "productId");

            migrationBuilder.CreateIndex(
                name: "IX_Esewas_userId",
                table: "Esewas",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_userId",
                table: "Hotels",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_hotelId",
                table: "Rooms",
                column: "hotelId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_esewaId",
                table: "Transactions",
                column: "esewaId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_userId",
                table: "Transactions",
                column: "userId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BalanceSheets");

            migrationBuilder.DropTable(
                name: "Comapnies");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Esewas");

            migrationBuilder.DropTable(
                name: "Hotels");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
