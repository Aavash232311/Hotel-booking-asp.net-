using System.ComponentModel.DataAnnotations;

namespace Bespeaking.Models
{
    public class Register
    {
        [MaxLength(25)]
        public string username { get; set; } = string.Empty;
        [MaxLength(25)]
        public string password { get; set; } = string.Empty;
        [MaxLength(25)]
        public string confrom_password { get; set; } = string.Empty;
        [MaxLength(50)]
        public string email { get; set; } = string.Empty;
        [MaxLength(11)]
        public string phone { get; set; } = string.Empty;
        [MaxLength(50)]
        public string city { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Address { get; set; } = string.Empty;
    }
}
