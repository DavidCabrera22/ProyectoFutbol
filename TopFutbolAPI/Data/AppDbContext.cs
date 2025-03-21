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
        // Añade estas líneas al DbContext existente
        public DbSet<TipoMovimiento> TiposMovimiento { get; set; }
        public DbSet<Servicio> Servicios { get; set; }
        public DbSet<TipoRecaudo> TiposRecaudo { get; set; }
        public DbSet<Movimiento> Movimientos { get; set; }
        public DbSet<Saldo> Saldos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

      // ... existing code ...

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Configure decimal precision
    modelBuilder.Entity<Saldo>()
        .Property(s => s.Valor)
        .HasColumnType("decimal(18,2)");

    modelBuilder.Entity<Servicio>()
        .Property(s => s.Valor)
        .HasColumnType("decimal(18,2)");

    modelBuilder.Entity<Movimiento>()
        .Property(m => m.Valor)
        .HasColumnType("decimal(18,2)");

    // Configure relationships with Restrict instead of Cascade for some relationships
    modelBuilder.Entity<Alumno>()
        .HasOne(a => a.Sede)
        .WithMany(s => s.Alumnos)
        .HasForeignKey(a => a.IdSede)
        .OnDelete(DeleteBehavior.Restrict); // Cambiado de Cascade a Restrict

    modelBuilder.Entity<Alumno>()
        .HasOne(a => a.Categoria)
        .WithMany(c => c.Alumnos)
        .HasForeignKey(a => a.IdCategoria)
        .OnDelete(DeleteBehavior.Restrict); // Cambiado de Cascade a Restrict

    modelBuilder.Entity<Alumno>()
        .HasOne(a => a.Formador)
        .WithMany(f => f.Alumnos)
        .HasForeignKey(a => a.IdFormador)
        .OnDelete(DeleteBehavior.Restrict); // Cambiado de Cascade a Restrict

    // Configurar las relaciones de Movimiento para evitar ciclos en cascada
    modelBuilder.Entity<Movimiento>()
        .HasOne(m => m.Sede)
        .WithMany()
        .HasForeignKey(m => m.IdSede)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Movimiento>()
        .HasOne(m => m.TipoMovimiento)
        .WithMany()
        .HasForeignKey(m => m.IdTipo)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Movimiento>()
        .HasOne(m => m.TipoRecaudo)
        .WithMany()
        .HasForeignKey(m => m.IdTipoRecaudo)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Movimiento>()
        .HasOne(m => m.Servicio)
        .WithMany()
        .HasForeignKey(m => m.IdServicio)
        .OnDelete(DeleteBehavior.Restrict);
}

// ... existing code ...
    }
}