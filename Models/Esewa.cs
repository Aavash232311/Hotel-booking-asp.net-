using System.ComponentModel.DataAnnotations;

namespace Bespeaking.Models
{
    public class Esewa
    {
        public int Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string MerchantKey { get; set; } = string.Empty;
        public User? user { get; set; }
    }
}