# Entity Framework Core Cheat Sheet

## Install Packages using the CLI

* Install Entity Framework Core (EF Core) is a modern object-database mapper
    * `dotnet add package Microsoft.EntityFrameworkCore --version 9.0.0`
* Install EF Db Provider 
    * Sqlite
        * `dotnet add package Microsoft.EntityFrameworkCore.Sqlite.Core --version 9.0.0`
        * `dotnet add package SQLitePCLRaw.bundle_e_sqlite3 -v 2.1.10`			
    * oracle
        * `dotnet add package Oracle.ManagedDataAccess --version 19.25.0`
    * PostgreSQL
		* `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL`
    * SqlServer
        * `dotnet add package Microsoft.EntityFrameworkCore.SqlServer`            
* Install EF Tools & Design
    * `dotnet add package Microsoft.EntityFrameworkCore.Design`
    * `dotnet add package Microsoft.EntityFrameworkCore.Tools`
* Install useful Packages
    * ASP.NET Core Identity & Security provider
        * `dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore -v 9.0.0`
        * `dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer -v 9.0.0`            
        * `dotnet add package Microsoft.IdentityModel.Tokens -v 8.3.0`
        * `dotnet add package System.IdentityModel.Tokens.Jwt -v 8.3.0`
    * Serilog
        * `dotnet add package Serilog -v 4.2.0`
        * `dotnet add package Serilog.AspNetCore -v 9.0.0`
        * `dotnet add package Serilog.Sinks.Console -v 6.0.0`
        * `dotnet add package Serilog.Sinks.Debug -v 3.0.0`
        * `dotnet add package Serilog.Sinks.File -v 6.0.0`
   * Swagger
        * `dotnet add package Swashbuckle.AspNetCore -v 7.2.0`
        * `dotnet add package Swashbuckle.AspNetCore.Swagger --version 7.2.0`
        * `dotnet add package Swashbuckle.AspNetCore.SwaggerGen --version 7.2.0`


## Conventions 

  * By convention, a property named `Id` or `<type name>Id` will be configured as the <strong>`primary key`</strong> of an entity.
  * Keys that are `int` or `Guid` -> *by convention, automatically configure the key as an identity column. (`indentity(1,1)` for int keys) * 

    ```csharp

    internal class Car
    {
        //Primary key
        public string Id { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }

    internal class Truck
    {
        //Primary key
        public string TruckId { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }
    ```
  
  * Avoid Nullable types WARNINGS => C# 8.0 enable nulleable types by default! 
    * avoid warnings using "?", "null!" operators on properties!!

        ```csharp
        public class Customer
            {
                public int Id { get; set; }
                // Any DataType can be declared non-nullable by assign it "null!" value. use "!" the null-forgiving operator.
                public string FirstName { get; set; } = null!;
                public string LastName { get; set; } = null!;
                // Any DataType can be declared nullable type with the help of operator "?". 
                public string? Address { get; set; }
                public string? Phone { get; set; }
                public string? Email { get; set; }
                public ICollection<Order> Orders { get; set; } = null!;
            }
        ```

    * avoid warnings by setting the nulleable context!!
        - on project.csproj set nullable disable
        /// img img 
  

<br>

* Configure your model using...
  * ...*Data Annotations*

  * Entity Framework uses `nvarchar(max)` for as default for string properties 
   - You can use DataAnnotations.Schema to change that...
    
        ```csharp
            public class Book
            {
                public int BookId { get; set; }
                // DataAnnotations
                [MaxLength(12), MinLength(5)]
                public string Title { get; set; }
            }
        ```
    - You can use DataAnnotations for REQUIRED properties 

        ```csharp
            public class Dog
            {
                public int ID { get; set; }
                // DataAnnotations
                [Required(ErrorMessage="Empty dog name")]
                [MaxLength(10,ErrorMessage="Up to 10 chars")]
                public string Name { get; set; }
            }
        ```
<br>

* (codefirst) database Tables <strong>NAMES</strong>
    * The Name of the `DbSet<Entity>` property, will be name of the table <br/>


## Connection String in `appsettings.json`

* Add ConnectionString (SQLite)  to *appsettings.json* file:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "MyAppDb": "Data Source=C:\\NewAPI\\MyAppDb.sqlite",
    "MyAppAuthDb": "Data Source=C:\\NewAPI\\MyAppAuthDb.sqlite"
  },
  "JWT": {
    "Audience": "https://localhost:7252",
    "Issuer": "https://localhost:7252",
    "Key": "vMOjgxaL/M9xREQemPkqDdw15s4YouUp9Q5sPrjU/TQesGoupPhJMC0W2SZ8MX71dYduYRM2/Hv7orS+tJnX5w=="
  }
}
```



* Read connection string in Program.cs file class:

```csharp
using Microsoft.EntityFrameworkCore; 
using Microsoft.Extensions.DependencyInjection;

// Récupérer le chemin depuis appsettings.json
string? connectionString = builder.ConfiguratioGetConnectionString("MyAppDb");
builder.Services.AddDbContext<NZWalksDbContex(options => options.UseSqlite(connectionString))

// Configurer la chaîne de connexion pour la bd SQLite Authentication
string? authConnectionString = builder.ConfiguratioGetConnectionString("MyAppAuthDb");
builder.Services.AddDbContext<NZWalksAuthDbContex(options => options.UseSqlite(authConnectionString));
```
* Enable Dependency Injection on : `DbContext Class`

```csharp
//EF
using Microsoft.EntityFrameworkCore;
using NewZealandWalks.API.Models.Domain;
using SQLitePCL;

namespace NewZealandWalks.API.Data; 
public class NZWalksDbContext : DbContext 
{
    // add this instance 
    private readonly context;
    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    
    //Default Constructor
    public NZWalksDbContext()
    {
        //Necessaire pour sqlite: SQLitePCL.Batteries
        Batteries.Init();
    }
    
    //Injection du context
    public NZWalksDbContext(DbContextOptions<NZWalksDbContext> dbContextOptions) : base(dbContextOptions)
    {
    }

    public DbSet<Difficulty> Difficultys { get; set; }

    public DbSet<Region> Regions { get; set; }

    public DbSet<Walk> Walks { get; set; }

    public DbSet<Image> Images { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured) // Évite de reconfigurer si les options sont déjà définies
        {
            options.UseSqlite("Data Source=NZWalksDb.sqlite");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Permet de convertir du type GUID dans les classes C# vers le type TEXT des tables Sqlite.
        var converter = new GuidToStringConverter();

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(Guid) || p.PropertyType == typeof(Guid?));

            foreach (var property in properties)
            {
                modelBuilder.Entity(entityType.Name)
                    .Property(property.Name)
                    .HasConversion(converter)
                    .HasColumnType("TEXT");
            }
        }
    }
}

```
## Query Data

* [Documentation](https://docs.microsoft.com/en-us/ef/core/querying/)

|       Task        |                    Operation                    |
| ----------------- | ----------------------------------------------- |
| Load all data     | `ToListAsync`                                   |
| Load single row   | `Single`                                        |
| Filter            | `Where`                                         |
| Load related data | `Include`, `ThenInclude`, `Entry`, `Collection` |
| No-tracking query | `AsNoTracking`                                  |
| Raw SQL queries   | `FromSql`                                       |
| Sorting           | `OrderBy`, `OrderByDescending`                  |


## Saving Data

* [Documentation](https://docs.microsoft.com/en-us/ef/core/saving/)

|      Task       |     Operation      |
| --------------- | ------------------ |
| Add instance    | `Add`              |
| Delete instance | `Remove`           |
| Save            | `SaveChangesAsync` |

* Transactions:

```csharp
using (var transaction = context.Database.BeginTransaction())
{
    try
    {
        ...
        context.SaveChanges();
        ...
        context.SaveChanges();
        transaction.Commit();
    }
    catch (Exception)
    {
        // TODO: Handle failure
    }
}
```
## Manage DB Schema (.NET Core CLI (powershell))

* [MS-Docs: Managing Database Schemas](https://docs.microsoft.com/en-us/ef/core/managing-schemas/)


Installing the tools
dotnet ef can be installed as either a global or local tool. Most developers prefer installing dotnet ef as a global tool using the following command:

    
1. Installer les packages nécessaires

2. Configurer votre contexte de base de données

3. Assurez-vous d'avoir les outils bien intallés ou les mettre à jour
    ```powershell
    #installation
    dotnet tool install --global dotnet-ef
    
    #mise à jour
    dotnet tool update --global dotnet-ef

    #vérifier l'installation
    dotnet ef

                     _/\__
               ---==/    \\
         ___  ___   |.    \|\
        | __|| __|  |  )   \\\
        | _| | _|   \_/ |  //|\\
        |___||_|       /   \\\/\\

    Entity Framework Core .NET Command-line Tools 9.0.0

    Usage: dotnet ef [options] [command]
    Options:
    --version        Show version information
    -h|--help        Show help information
    -v|--verbose     Show verbose output.
    --no-color       Dont colorize output.
    --prefix-output  Prefix output with level.

    Commands:
    database    Commands to manage the database.
    dbcontext   Commands to manage DbContext types.
    migrations  Commands to manage migrations.

    Use "dotnet ef [command] --help" for more information about a command.


    ```

3. Ajouter une migration
    ```powershell
    dotnet ef migrations add InitialCreate
    ```
4. Appliquer la migration à la base de données
    ```powershell
    dotnet ef database update
    ```
5. Ajouter une migration :
    ```powershell
    dotnet ef migrations add <MigrationName>
    ```
6. Appliquer la migration :
    ```powershell
    dotnet ef database update
    ```
7. Retirer la dernière migration:
    ```powershell
    dotnet ef migrations remove
    ```
8. Lister toutes les migrations
    ```powershell
    dotnet ef migrations list
    ```
9. Lister toutes les migrations
    ```powershell
    dotnet ef dbcontext list
    ```    
10. Générer un script SQL basé à partir des migrations
    ```powershell
    #pour rédiger le script dans le terminal
    dotnet ef migrations script
    
    #Générer un script SQL basé sur les migrations et enregistrer la sortie dans un fichier
    dotnet ef migrations script > EF_Migrations_Script.sql
    ```