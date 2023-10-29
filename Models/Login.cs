using System.ComponentModel.DataAnnotations;

namespace Bespeaking.Models
{
    public class Login
    {
        [MaxLength(25)]
        public string Username { get; set; } = string.Empty;
        [MaxLength(25)]
        public string Password { get; set; } = string.Empty;
    }
}
