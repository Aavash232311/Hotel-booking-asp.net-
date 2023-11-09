using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bespeaking.Models
{
    public class BalanceSheet
    {
        public Guid id { get; set; }
        public User? client { get; set; }
        public decimal amount { get; set; } 
        public decimal discount { get; set; }
        [MaxLength(100)]
        public string? api { get; set;} = string.Empty;
        [Required]
        [MaxLength(100)]
        public string pid { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string metchantKey { get; set; } = string.Empty;
        public int room { get; set; }
        public bool completed { get; set; } = false;
        public string? ApiServerResponse { get; set; } = string.Empty;

    }
}
