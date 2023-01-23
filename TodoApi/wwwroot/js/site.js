const uri = 'api/todoitems';
let todos = [];

$(document).ready(function () {
    $selectElement = $('#select2-chose-todo').select2({
        placeholder: 'Select todo to add to list',
        allowClear: true,
        width: 'style'
    });
});

function resetDropdownMenu() {
    $('#select2-chose-todo').val(null).trigger('change');
}

function getItems() {
    fetch(uri)
      .then(response => response.json())
      .then(data => _displayItems(data))
      .catch(error => console.error('Unable to get items.', error));
}

function getSelectedOptionsNames() {
    var selected = document.getElementById('select2-chose-todo').selectedOptions;
    var result = [];
    for (var i = 0; i < selected.length; i++) {
        result.push(selected[i].value);
    }
    return result;
}

function convertTodoNameToId(todoName) {
    const item = todos.find(item => item.name === todoName);
    return item.id;
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

function addItemsToList() {
    const addListnameTextbox = document.getElementById('add-listname');
    const listName = addListnameTextbox.value.trim();
    if (addListnameTextbox.value.length == 0) {
        alert("Nothing to add. Field is empty.");
        return false;
    }

    var selectedTodoNames = getSelectedOptionsNames();
    if (selectedTodoNames.length < 1) {
        alert("At least one Todo-Item must be selected.");
        return false;
    }
    for (var i = 0; i < selectedTodoNames.length; i++) {
        var id = convertTodoNameToId(selectedTodoNames[i]);
        updateItem({ "id": id, "listing": listName });
    }
    addListnameTextbox.value = '';
    resetDropdownMenu();
}

function putItem(item, itemId) {
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
}

function updateItem(opts) {
    if (opts == undefined) {
        var itemId = parseInt(document.getElementById('edit-id').value, 10);
        var item = todos.find(item => item.id === itemId);
        item.name = document.getElementById('edit-name').value.trim();
        putItem(item, itemId);
        closeInput();
    }
    else {
        var itemId = opts['id'];
        var item = todos.find(item => item.id === itemId);
        if (opts['starChanged']) {
            item.isStarred = !item.isStarred;
            putItem(item, itemId);
        }
        else if (opts['completenessChanged']) {
            item.isComplete = !item.isComplete;
            putItem(item, itemId);
        }
        else if (opts['listing']) {
            item.listing = opts['listing'];
            putItem(item, itemId);
        }
        else {
            throw new Error('Nothing to update.');
        }
    }
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

    document.getElementById('select2-chose-todo').innerHTML = '';
    data.forEach(item => {
        let isStarredButton = document.createElement('body');
        isStarredButton.setAttribute("class", "starButtonClass");
        isStarredButton.innerHTML = '<i id="faStar" class="fa fa-star"></i>';
        isStarredButton.addEventListener('click', (event) => {
            updateItem({ "id": item.id, "starChanged": true });
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
            updateItem({ "id": item.id, "completenessChanged": true });
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

        document.getElementById('select2-chose-todo').innerHTML += ('<option>' + item.name + "</option>");
    });

    todos = data;
}