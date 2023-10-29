using System.ComponentModel.DataAnnotations;

namespace Bespeaking.Models
{
    public class Company
    {
        public Guid Id { get; set; }
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;
        [MaxLength(5)]
        public int Rating { get; set; }
        [MaxLength(11)]
        public int CompanyContactNumber { get; set; }
        public Guid CompanyId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
