const uri = 'api/todoitems';
let todos = [];

function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
  const addNameTextbox = document.getElementById('add-name');

  if (addNameTextbox.value.length == 0) {
      alert("Nothing to add. Field is empty.");
      return false; 
  }

  const item = {
    isStarred: false,
    isComplete: false,
    name: addNameTextbox.value.trim()
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
  const item = todos.find(item => item.id === id);
  
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-id').value = item.id;
  document.getElementById('editForm').style.display = 'block';
}

function updateItem(id, starChanged = false, completenessChanged = false) {
  if (starChanged && completenessChanged)
      throw new Error('Either stars or completeness should be changed.');

  if (id == undefined){
      var itemId = parseInt(document.getElementById('edit-id').value, 10);
      var item = todos.find(item => item.id === itemId);
      item.name = document.getElementById('edit-name').value.trim();
  }
  else {
      var itemId = id;
      var item = todos.find(item => item.id === itemId);
      if (starChanged)
          item.isStarred = !item.isStarred;
      else if (completenessChanged)
          item.isComplete = !item.isComplete;
      else
          throw new Error('Nothing has changed. This function is called mistakenly.');
  }

  fetch(`${uri}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));

  closeInput();

  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
  const name = (itemCount === 1) ? 'to-do' : 'to-dos';

  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {
    let isStarredButton = document.createElement('body');
    isStarredButton.setAttribute("class", "starButtonClass");
    isStarredButton.innerHTML = '<i id="faStar" class="fa fa-star"></i>';
    isStarredButton.addEventListener('click', (event) => {
        updateItem(item.id, starChanged = true, completenessChanged = false);
    })
    if (item.isStarred) {
        isStarredButton.style.color = 'orange';
    }
    else {
        isStarredButton.style.color = 'white';
        isStarredButton.onmouseenter = function () {
            isStarredButton.style.color = 'orange';
        }
        isStarredButton.onmouseleave = function () {
            isStarredButton.style.color = 'white';
        }
    }

    let isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.disabled = false;
    isCompleteCheckbox.checked = item.isComplete;
    isCompleteCheckbox.addEventListener('change', (event) => {
        updateItem(item.id, starChanged = false, completenessChanged = true);
    })

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

    let tr = tBody.insertRow();
    
    let td1 = tr.insertCell(0);
    td1.appendChild(isStarredButton);

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