using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;
public class TodoItemContext : DbContext
{
    public TodoItemContext(DbContextOptions<TodoItemContext> options)
        : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;
}