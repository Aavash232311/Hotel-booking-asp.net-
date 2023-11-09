namespace Bespeaking.Hub
{
    using Microsoft.AspNetCore.SignalR;
    public class ReviewHub: Hub
    {
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine(message);
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
