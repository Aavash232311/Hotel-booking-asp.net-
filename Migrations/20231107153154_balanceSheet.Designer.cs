﻿// <auto-generated />
using System;
using Bespeaking.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Bespeaking.Migrations
{
    [DbContext(typeof(AuthDbContext))]
    [Migration("20231107153154_balanceSheet")]
    partial class balanceSheet
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Bespeaking.Models.BalanceSheet", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<decimal>("amount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("api")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<Guid?>("clientId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<decimal>("discount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("metchantKey")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("pid")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int?>("productId")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("clientId");

                    b.HasIndex("productId");

                    b.ToTable("BalanceSheets");
                });

            modelBuilder.Entity("Bespeaking.Models.Company", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("CompanyContactNumber")
                        .HasMaxLength(11)
                        .HasColumnType("int");

                    b.Property<Guid>("CompanyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("Rating")
                        .HasMaxLength(5)
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Comapnies");
                });

            modelBuilder.Entity("Bespeaking.Models.Esewa", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("MerchantKey")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<Guid?>("userId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("userId");

                    b.ToTable("Esewas");
                });

            modelBuilder.Entity("Bespeaking.Models.Hotel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool?>("Anytime_Front_Desk_Service")
                        .HasColumnType("bit");

                    b.Property<bool?>("Business_Center_with_Printing_and_Fax_Services")
                        .HasColumnType("bit");

                    b.Property<bool?>("Clean_Towels")
                        .HasColumnType("bit");

                    b.Property<bool?>("Free_Breakfas")
                        .HasColumnType("bit");

                    b.Property<bool?>("Free_WiFi_Access")
                        .HasColumnType("bit");

                    b.Property<bool?>("Gym_and_Fitness_Center")
                        .HasColumnType("bit");

                    b.Property<bool?>("Hair_Dryer")
                        .HasColumnType("bit");

                    b.Property<bool?>("In_Room_Coffee_and_Tea_Makers")
                        .HasColumnType("bit");

                    b.Property<bool?>("Ironing_Services")
                        .HasColumnType("bit");

                    b.Property<bool?>("Kettle")
                        .HasColumnType("bit");

                    b.Property<Guid>("LicenseKey")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool?>("Pillow_Options")
                        .HasColumnType("bit");

                    b.Property<bool?>("Refrigerator_Mini_Bar")
                        .HasColumnType("bit");

                    b.Property<bool?>("Safe_Box")
                        .HasColumnType("bit");

                    b.Property<bool?>("Slippers")
                        .HasColumnType("bit");

                    b.Property<bool?>("Soundproofing")
                        .HasColumnType("bit");

                    b.Property<bool?>("Spa_like_Experience")
                        .HasColumnType("bit");

                    b.Property<bool?>("Swimming_Pool")
                        .HasColumnType("bit");

                    b.Property<bool?>("Swimming_Pool_and_Hot_Tub")
                        .HasColumnType("bit");

                    b.Property<bool?>("Toiletries")
                        .HasColumnType("bit");

                    b.Property<bool?>("Treats_at_Turndown")
                        .HasColumnType("bit");

                    b.Property<string>("checkIn")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("checkOut")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("nvarchar(2000)");

                    b.Property<string>("image_1")
                        .IsRequired()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_10")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_2")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_3")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_4")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_5")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_6")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_7")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_8")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<string>("image_9")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<bool>("live")
                        .HasColumnType("bit");

                    b.Property<string>("location")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("position")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<Guid?>("userId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("userId");

                    b.ToTable("Hotels");
                });

            modelBuilder.Entity("Bespeaking.Models.Roles", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("Bespeaking.Models.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("NumberOfBed")
                        .HasMaxLength(10)
                        .HasColumnType("int");

                    b.Property<string>("description")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<decimal?>("discount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<Guid>("hotelId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<decimal>("price")
                        .HasMaxLength(10)
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("roomImage")
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<int>("roomSize")
                        .HasMaxLength(10)
                        .HasColumnType("int");

                    b.Property<string>("type")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("hotelId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("Bespeaking.Models.Transaction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("esewaId")
                        .HasColumnType("int");

                    b.Property<Guid>("userId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("esewaId");

                    b.HasIndex("userId");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("Bespeaking.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("BlackListToken")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateJoined")
                        .HasColumnType("datetime2");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("city")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Bespeaking.Models.UserRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("Bespeaking.Models.BalanceSheet", b =>
                {
                    b.HasOne("Bespeaking.Models.User", "client")
                        .WithMany()
                        .HasForeignKey("clientId");

                    b.HasOne("Bespeaking.Models.Room", "product")
                        .WithMany()
                        .HasForeignKey("productId");

                    b.Navigation("client");

                    b.Navigation("product");
                });

            modelBuilder.Entity("Bespeaking.Models.Esewa", b =>
                {
                    b.HasOne("Bespeaking.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userId");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Bespeaking.Models.Hotel", b =>
                {
                    b.HasOne("Bespeaking.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userId");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Bespeaking.Models.Room", b =>
                {
                    b.HasOne("Bespeaking.Models.Hotel", "hotel")
                        .WithMany()
                        .HasForeignKey("hotelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("hotel");
                });

            modelBuilder.Entity("Bespeaking.Models.Transaction", b =>
                {
                    b.HasOne("Bespeaking.Models.Esewa", "esewa")
                        .WithMany()
                        .HasForeignKey("esewaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Bespeaking.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("esewa");

                    b.Navigation("user");
                });
#pragma warning restore 612, 618
        }
    }
}
