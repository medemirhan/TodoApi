using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;
public class TodoListContext : DbContext
{
    public TodoListContext(DbContextOptions<TodoListContext> options)
        : base(options)
    {
    }

    public DbSet<TodoList> TodoLists { get; set; } = null!;
}