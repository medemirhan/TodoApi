const uriTodo = 'api/todoitems';
const uriList = 'api/todolists';
let todos = [];

function getTodoItems() {
  fetch(uriTodo)
    .then(response => response.json())
    .then(data => _displayTodoItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addTodoItem() {
  const addNameTextbox = document.getElementById('add-name');

  if (addNameTextbox.value.length == 0) {
      alert("Nothing to add. Field is empty.");
      return false; 
  }

  const item = {
    isHighPriority: false,
    isComplete: false,
    name: addNameTextbox.value.trim()
  };

  fetch(uriTodo, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getTodoItems();
      addNameTextbox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteTodoItem(id) {
  fetch(`${uriTodo}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getTodoItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayTodoEditForm(id) {
  const item = todos.find(item => item.id === id);
  
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-id').value = item.id;
  document.getElementById('editForm').style.display = 'block';
}

function updateTodoItem(id, priorityChanged = false, completenessChanged = false) {
  if (priorityChanged && completenessChanged)
      throw new Error('Either priority or completeness should be changed.');

  if (id == undefined){
      var itemId = parseInt(document.getElementById('edit-id').value, 10);
      var item = todos.find(item => item.id === itemId);
      item.name = document.getElementById('edit-name').value.trim();
  }
  else {
      var itemId = id;
      var item = todos.find(item => item.id === itemId);
      if (priorityChanged)
          item.isHighPriority = !item.isHighPriority;
      else if (completenessChanged)
          item.isComplete = !item.isComplete;
      else
          throw new Error('Nothing has changed. This function is called mistakenly.');
  }

  fetch(`${uriTodo}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(() => getTodoItems())
  .catch(error => console.error('Unable to update item.', error));

  closeTodoInput();

  return false;
}

function closeTodoInput() {
  var it = document.getElementById('editForm');
  it.style.display = 'none';
  document.getElementById('editForm').style.display = 'none';
}

function _displayTodoCount(itemCount) {
  const name = (itemCount === 1) ? 'to-do' : 'to-dos';

  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayTodoItems(data) {
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';

  _displayTodoCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {
    let isHighPriorityCheckbox = document.createElement('body');
    isHighPriorityCheckbox.setAttribute("class", "starButtonClass");
    isHighPriorityCheckbox.innerHTML = '<i id="faStar" class="fa fa-star"></i>';
    isHighPriorityCheckbox.addEventListener('click', (event) => {
        updateTodoItem(item.id, priorityChanged = true, completenessChanged = false);
    })
    if (item.isHighPriority){
        isHighPriorityCheckbox.style.color = 'orange';
    }
    else {
        isHighPriorityCheckbox.style.color = 'white';
        isHighPriorityCheckbox.onmouseenter = function () {
            isHighPriorityCheckbox.style.color = 'orange';
        }
        isHighPriorityCheckbox.onmouseleave = function () {
            isHighPriorityCheckbox.style.color = 'white';
        }
    }

    let isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.disabled = false;
    isCompleteCheckbox.checked = item.isComplete;
    isCompleteCheckbox.addEventListener('change', (event) => {
        updateTodoItem(item.id, priorityChanged = false, completenessChanged = true);
    })

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayTodoEditForm(${item.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteTodoItem(${item.id})`);

    let tr = tBody.insertRow();
    
    let td1 = tr.insertCell(0);
    td1.appendChild(isHighPriorityCheckbox);

    let td2 = tr.insertCell(1);
    td2.appendChild(isCompleteCheckbox);

    let td3 = tr.insertCell(2);
    let textNode = document.createTextNode(item.name);
    td3.appendChild(textNode);

    let td4 = tr.insertCell(3);
    td4.appendChild(editButton);

    let td5 = tr.insertCell(4);
    td5.appendChild(deleteButton);
  });

  todos = data;
}

function onStarClicked() {
  var div = document.getElementById('starBtn');
  var starred = false;
  if(div.style.color == 'white')
      starred = true;

  if(starred)
      div.style.color = 'orange';
}