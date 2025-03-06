using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Models;

namespace TopFutbolAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Alumno> Alumnos { get; set; }
        public DbSet<Formador> Formadores { get; set; }
        public DbSet<Sede> Sedes { get; set; }
        public DbSet<Categoria> Categorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de relaciones
            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Sede)
                .WithMany(s => s.Alumnos)
                .HasForeignKey(a => a.IdSede);

            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Categoria)
                .WithMany(c => c.Alumnos)
                .HasForeignKey(a => a.IdCategoria);

            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Formador)
                .WithMany(f => f.Alumnos)
                .HasForeignKey(a => a.IdFormador);
        }
    }
}