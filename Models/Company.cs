using System.ComponentModel.DataAnnotations;

namespace Bespeaking.Models
{
    public class Company
    {
        public Guid Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; set; } = string.Empty;
        [MaxLength(100)]
        [Required]
        public string Description { get; set; } = string.Empty;
        [MaxLength(5)]
        [Required]
        public int Rating { get; set; }
        [MaxLength(11)]
        [Required]
        public int CompanyContactNumber { get; set; }
        public Guid CompanyId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
