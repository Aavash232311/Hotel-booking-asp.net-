namespace Bespeaking.Models
{
    // success 
    public class CheckIn
    {
        public int Id { get; set; }
        public User user { get; set; }  
        public DateTime checkIn { get; set; }
        public DateTime checkOut { get; set; }
        public int adults { get; set; } 
        public int room { get; set; }
        public Hotel hotel { get; set; }    
    }
}
