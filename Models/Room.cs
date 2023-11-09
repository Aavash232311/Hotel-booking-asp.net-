using System.ComponentModel.DataAnnotations;

namespace Bespeaking.Models
{
    public class Room
    {
        public int Id { get; set; }
        [MaxLength(20)]
        public string type { get; set; } = string.Empty;
        [MaxLength(10)]
        public int roomSize { get; set; }
        [MaxLength(10)]
        public decimal price { get; set; }
        public decimal? discount { get; set; }
        [MaxLength(1024)]
        public string? roomImage { get; set; } = string.Empty;
        [MaxLength(30)]
        public string? description { get; set; } = string.Empty;
        [MaxLength (10)]
        public int NumberOfBed { get; set; }
        public Hotel hotel { get; set; }

    }
}
