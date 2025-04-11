using Microsoft.EntityFrameworkCore;
using TopFutbolAPI.Data;
using TopFutbolAPI.Services; // Añadir esta línea para importar AuthService
using Microsoft.AspNetCore.Authentication.JwtBearer; // Añadir esta línea para JwtBearerDefaults
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IO; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), 
    sqlServerOptionsAction: sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));

// Registrar el servicio de autenticación
builder.Services.AddScoped<AuthService>();

// Configurar la autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", 
        corsBuilder => 
        {
            // Asegurar que el dominio de producción esté siempre permitido
            corsBuilder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
            
            // Leer orígenes adicionales de la configuración si existen
            var allowedOrigins = builder.Configuration["AllowedOrigins"];
            if (!string.IsNullOrEmpty(allowedOrigins))
            {
                var origins = allowedOrigins.Split(',');
                foreach (var origin in origins)
                {
                    if (!string.IsNullOrWhiteSpace(origin))
                    {
                        corsBuilder.WithOrigins(origin.Trim());
                    }
                }
            }
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // En producción, configurar manejo de errores
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Habilitar archivos estáticos para servir las imágenes
app.UseStaticFiles();

// Asegurarse de que CORS se aplique antes de otros middleware
app.UseCors("AllowAll");

app.UseHttpsRedirection();

// Añadir middleware de autenticación
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error en la solicitud {Path}: {Message}", context.Request.Path, ex.Message);
        
        // Determinar si es un error de base de datos
        bool isDbError = ex.InnerException?.Message?.Contains("database") == true ||
                         ex.InnerException?.Message?.Contains("SQL Server") == true ||
                         ex.StackTrace?.Contains("Microsoft.EntityFrameworkCore") == true;
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var errorResponse = new
        {
            error = isDbError ? "Error de conexión a la base de datos" : "Error interno del servidor",
            message = ex.Message,
            innerError = ex.InnerException?.Message,
            path = context.Request.Path.Value
        };
        
        await context.Response.WriteAsJsonAsync(errorResponse);
    }
});

// Inicializar la base de datos con datos de prueba
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        // Asegurar que la base de datos existe y está actualizada
        context.Database.Migrate();
        
        // Inicializar con datos de prueba solo en desarrollo
        if (app.Environment.IsDevelopment())
        {
            DbInitializer.Initialize(context);
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();