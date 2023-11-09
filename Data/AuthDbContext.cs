using System.Collections.Generic;
using Bespeaking.Models;
using Microsoft.EntityFrameworkCore;


namespace Bespeaking.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Company> Comapnies { get; set; }   
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Esewa> Esewas { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<BalanceSheet> BalanceSheets { get; set; }
        public DbSet<CheckIn> Checkin { get; set; }
    /*    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<BalanceSheet>()
                .HasOne(e => e.client)
                .WithMany()
                .OnDelete(DeleteBehavior.Cascade); // This sets ON DELETE CASCADE for merchant

            // Repeat for other relationships as needed...
        }*/


    }
}