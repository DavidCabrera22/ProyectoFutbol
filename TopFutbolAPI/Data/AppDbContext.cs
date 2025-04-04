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
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Formador> Formadores { get; set; }
        public DbSet<Sede> Sedes { get; set; }
        public DbSet<Sorteo> Sorteos { get; set; }
        public DbSet<SorteoBoleta> SorteoBoletas { get; set; }
        public DbSet<SorteoPago> SorteoPagos { get; set; }
        public DbSet<SorteoMovimiento> SorteoMovimientos { get; set; }
        public DbSet<SorteoTalonario> SorteosTalonarios { get; set; }
        public DbSet<BalanceAlumno> BalancesAlumnos { get; set; }
        public DbSet<SorteoVendedor> SorteosVendedores { get; set; }

        
        // Add missing DbSet properties
        public DbSet<TipoMovimiento> TiposMovimiento { get; set; }
        public DbSet<Servicio> Servicios { get; set; }
        public DbSet<TipoRecaudo> TiposRecaudo { get; set; }
        public DbSet<Movimiento> Movimientos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Disable cascade delete globally to prevent circular references
            foreach (var relationship in modelBuilder.Model.GetEntityTypes()
                .SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }

            // Configuraciones para las entidades principales
            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Categoria)
                .WithMany(c => c.Alumnos)
                .HasForeignKey(a => a.IdCategoria);

            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Formador)
                .WithMany(f => f.Alumnos)
                .HasForeignKey(a => a.IdFormador);

            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Sede)
                .WithMany(s => s.Alumnos)
                .HasForeignKey(a => a.IdSede);

            // Eliminada la relación entre Categoria y Formador
            // modelBuilder.Entity<Categoria>()
            //    .HasOne(c => c.Formador)
            //    .WithMany(f => f.Categorias)
            //    .HasForeignKey(c => c.IdFormador);

            // Configuración para BalanceAlumno
            modelBuilder.Entity<BalanceAlumno>()
                .HasOne(b => b.Alumno)
                .WithMany()
                .HasForeignKey(b => b.IdAlumno)
                .IsRequired();

            modelBuilder.Entity<BalanceAlumno>()
                .HasOne(b => b.Sede)
                .WithMany()
                .HasForeignKey(b => b.IdSede)
                .IsRequired();

            modelBuilder.Entity<BalanceAlumno>()
                .HasIndex(b => b.IdAlumno)
                .IsUnique(false);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.Alumno)
                .WithMany(a => a.Movimientos)
                .HasForeignKey(m => m.IdAlumno);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.TipoMovimiento)
                .WithMany()
                .HasForeignKey(m => m.IdTipo);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.TipoRecaudo)
                .WithMany()
                .HasForeignKey(m => m.IdTipoRecaudo);

            // Configuraciones para las entidades de sorteo
            modelBuilder.Entity<Sorteo>()
                .HasOne(s => s.Categoria)
                .WithMany()
                .HasForeignKey(s => s.IdCategoria);

            modelBuilder.Entity<SorteoBoleta>()
                .HasOne(b => b.Alumno)
                .WithMany()
                .HasForeignKey(b => b.IdAlumno);

            modelBuilder.Entity<SorteoBoleta>()
                .HasOne(b => b.Sorteo)
                .WithMany(s => s.Boletas)
                .HasForeignKey(b => b.IdSorteo);

            modelBuilder.Entity<SorteoBoleta>()
                .HasOne(b => b.Talonario)
                .WithMany(t => t.Boletas)
                .HasForeignKey(b => b.IdTalonario);

            modelBuilder.Entity<SorteoPago>()
                .HasOne(p => p.Alumno)
                .WithMany()
                .HasForeignKey(p => p.IdAlumno);

            modelBuilder.Entity<SorteoPago>()
                .HasOne(p => p.Boleta)
                .WithMany()
                .HasForeignKey(p => p.IdBoleta);

            modelBuilder.Entity<SorteoMovimiento>()
                .HasOne(m => m.Alumno)
                .WithMany()
                .HasForeignKey(m => m.IdAlumno);

            modelBuilder.Entity<SorteoMovimiento>()
                .HasOne(m => m.Boleta)
                .WithMany()
                .HasForeignKey(m => m.IdBoleta);

            // Configuración para Usuario
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}