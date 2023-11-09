using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace Bespeaking.Models
{
    public class Hotel
    {
        [Key]
        public Guid Id { get; set; }
        public Guid LicenseKey { get; set; }
        [MaxLength(100)]
        public string name { get; set; } = string.Empty;
        [MaxLength(100)]
        public string position { get; set; } = string.Empty;
        [MaxLength(100)]
        public string location { get; set; } = string.Empty;
        public bool? Toiletries { get; set; } = false;
        public bool? Treats_at_Turndown { get; set; } = false;
        public bool? Spa_like_Experience { get; set; } = false;
        public bool? Pillow_Options { get; set; } = false;
        public bool? Free_Breakfas { get; set; } = false;
        public bool? Free_WiFi_Access { get; set; } = false;
        public bool? In_Room_Coffee_and_Tea_Makers { get; set; } = false;
        public bool? Anytime_Front_Desk_Service { get; set; } = false;
        public bool? Gym_and_Fitness_Center { get; set; } = false;
        public bool? Swimming_Pool_and_Hot_Tub { get; set; } = false;
        public bool? Swimming_Pool { get; set; } = false;
        public bool? Business_Center_with_Printing_and_Fax_Services { get; set; } = false;
        public bool? Soundproofing { get; set; } = false;
        public bool? Safe_Box { get; set; } = false;
        public bool? Hair_Dryer { get; set; } = false;
        public bool? Refrigerator_Mini_Bar { get; set; } = false;
        public bool? Clean_Towels { get; set; } = false;
        public bool? Slippers { get; set; } = false;
        public bool? Ironing_Services { get; set; } = false;
        public bool? Kettle { get; set; } = false;
        [MaxLength(2000)]
        public string description { get; set; } = string.Empty;
        [MaxLength(20)]
        public string checkIn { get; set; } = string.Empty;
        [MaxLength(20)]
        public string checkOut { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string image_1 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_2 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_3 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_4 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_5 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_6 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_7 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_8 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_9 { get; set; } = string.Empty;
        [MaxLength(1024)]
        public string? image_10 { get; set; } = string.Empty;
        public bool live { get; set; } = false;
        public User? user { get; set; }
        public DateTime created { get; set; } = DateTime.Now;
    }
}
