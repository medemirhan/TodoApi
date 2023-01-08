using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddDbContext<TodoItemContext>(opt =>
//    opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDbContext<TodoItemContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("TodoItemContext")));
builder.Services.AddDbContext<TodoListContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("TodoListContext")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
