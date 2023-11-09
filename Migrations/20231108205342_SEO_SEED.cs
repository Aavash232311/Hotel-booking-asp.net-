using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bespeaking.Migrations
{
    /// <inheritdoc />
    public partial class SEO_SEED : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string[] location =
            {
                "pokhara",
                "pokhara nepal",
                "nepal pokhara",
                "gandaki",
                "pokhara gandaki",
                "fewa pokhara",
                "begnas pokhara",
                "pokhara street 13",
                "kathmandu nepal",
                "kathmandu baneshowr",
                "kathmandu jorpati",
                "kathmandu tinkune",
                "new road kathmahdu",
            };
            string[] name =
            {
                "hotel resort",
                "guest house and hotel",
                "hotel gandaki",
                "hotel mountain view",
                "luxuary hotel",
                "hotel new view",
                "hotel luxuary street",
                "nice hotel",
                "traverels hotel",
                "your own hotel",
                "your own home",
                "hotel feel like how",
                "hotel road kathmahdu",
            };
            for (int i = 0; i < location.Length - 1; i++)
            {
                var hotelId = Guid.NewGuid();
                double radiusInDegrees = 5000 / 111000f; // Convert radius from meters to degrees
                Random random = new Random();
                double latitude = 27.7104397;
                double longitude = 85.3915323;

                double u = random.NextDouble();
                double v = random.NextDouble();
                double w = radiusInDegrees * Math.Sqrt(u);
                double t = 2 * Math.PI * v;
                double x = w * Math.Cos(t);
                double y = w * Math.Sin(t);

                // Adjust the x-coordinate for the shrinking of the east-west distances
                double newLatitude = x / Math.Cos(Math.PI / 180 * longitude);

                newLatitude = newLatitude + latitude;
                double newLongitude = y + longitude;
                Guid LicenseKey = new Guid();

                migrationBuilder.InsertData(
                    table: "Hotels",
                    columns: new[] { "Id", "LicenseKey", "name", "position", "location", "description", "image_1", "live", "checkIn", "checkOut" },
                    values: new object[] { hotelId, LicenseKey, name[i], $"{{\"latitude\":{newLatitude},\"longitude\":{newLongitude},\"altitude\":0,\"altitudeReference\":-1}}", $"kathmandu {i}", "Hello world", "5cf56fbb-a136-4d09-951b-ce27beccb7c810d39546ba3c7ecb2850d1647bb46337.jpeg", true, "21:08", "21:08" }
                );

                migrationBuilder.InsertData(
                    table: "Rooms",
                    columns: new[] { "type", "roomSize", "price", "roomImage", "description", "NumberOfBed", "hotelId" },
                    values: new object[] { $"Type {i}", 30, 1, "5cf56fbb-a136-4d09-951b-ce27beccb7c810d39546ba3c7ecb2850d1647bb46337.jpeg", "Hello world", 2, hotelId }
                );
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove all hotels and rooms
            migrationBuilder.Sql("DELETE FROM Rooms");
            migrationBuilder.Sql("DELETE FROM Hotels");
        }
    }
}
