
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Storage;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Policy;
using System.Web;
using System.Web.Services.Description;

namespace Flowers.Models
{
    public class FlowerContext : DbContext
    {
        public DbSet<RegisterViewModel> Contact { get; set; }
        public DbSet<Flower> Flower { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //var connectionString = "server=localhost;port=3306;database=Flowers;user=root;password=123454321+";
            //var serverVersion = ServerVersion.AutoDetect(connectionString);
            optionsBuilder.UseMySql("server=localhost;port=3306;database=Flowers;user=root;password=123454321");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RegisterViewModel>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).IsRequired();
                entity.Property(d => d.Password);
                entity.Ignore(e => e.ConfirmPassword);
            });

            modelBuilder.Entity<Flower>(entity =>
            {
                entity.HasKey(e => e.Id); // Первинний ключ
                entity.Property(e => e.Id).ValueGeneratedNever(); // бо в SQL: Id INT PRIMARY KEY (без автоінкременту)

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Category)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Img)
                      .HasMaxLength(100);

                entity.Property(e => e.Price)
                      .HasColumnType("decimal(6,2)");

                entity.Property(e => e.Description)
                      .HasMaxLength(100);
            });
        }
    }



    public class RegisterViewModel
    {
        public RegisterViewModel()
        { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required(ErrorMessage = "Введіть логін")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Введіть пароль")]
        [DataType(DataType.Password)]
        public string Password { get; set; }


        [Required(ErrorMessage = "Повторіть пароль")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Паролі не співпадають")]
        public string ConfirmPassword { get; set; }
    }

    public class Flower
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Img { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
    }
}