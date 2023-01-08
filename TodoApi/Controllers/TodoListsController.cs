using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoListsController : ControllerBase
{
    private readonly TodoListContext _context;

    public TodoListsController(TodoListContext context)
    {
        _context = context;
    }

    // GET: api/TodoLists
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoList>>> GetTodoLists()
    {
        if (_context.TodoLists == null)
        {
            return NotFound();
        }
        return await _context.TodoLists.ToListAsync();
    }

    // GET: api/TodoLists/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoList>> GetTodoList(long id)
    {
        if (_context.TodoLists == null)
        {
            return NotFound();
        }
        var todoList = await _context.TodoLists.FindAsync(id);

        if (todoList == null)
        {
            return NotFound();
        }

        return todoList;
    }

    // PUT: api/TodoLists/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodoList(long id, TodoList todoList)
    {
        if (id != todoList.Id)
        {
            return BadRequest();
        }

        var todoListFetched = await _context.TodoLists.FindAsync(id);
        if (todoListFetched == null)
        {
            return NotFound();
        }

        todoListFetched.Name = todoList.Name;
        todoListFetched.TodoIds = todoList.TodoIds;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException) when (!TodoListExists(id))
        {
            return NotFound();
        }

        return NoContent();
    }

    // POST: api/TodoLists
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<TodoList>> PostTodoList(TodoList todoList)
    {
        _context.TodoLists.Add(todoList);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTodoList),
            new { id = todoList.Id },
            todoList);
    }

    // DELETE: api/TodoLists/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoList(long id)
    {
        var todoList = await _context.TodoLists.FindAsync(id);
        if (todoList == null)
        {
            return NotFound();
        }

        _context.TodoLists.Remove(todoList);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TodoListExists(long id)
    {
        return _context.TodoLists.Any(e => e.Id == id);
    }
}
