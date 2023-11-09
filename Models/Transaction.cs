namespace Bespeaking.Models
{
    public class Transaction
    {
        public int Id { get; set; } 
        public User user { get; set; }
        public Esewa esewa { get; set; }

    }
}
