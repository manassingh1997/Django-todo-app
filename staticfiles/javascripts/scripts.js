function openEditModal(todo) {
    document.getElementById("editTitle").value = todo.title;
    document.getElementById("editDescription").value = todo.description;
    document.getElementById("editDate").value = todo.due_date;

    // Store the current todo ID for the save operation
    document.getElementById("editModal").dataset.todoId = todo.id;

    // Display the modal
    document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Format as dd-mm-yyyy
}

async function fetchTodos(){
    const response = await fetch('/api/todos/');
    const todos = await response.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach(todo => {
        const item = document.createElement('li');
        const delete_btn = document.createElement('button');
        const edit_btn = document.createElement('button');
        const button_div = document.createElement('div');
        const li_span = document.createElement('span');


        item.innerHTML = `<p><strong>Title</strong> - ${todo.title} <br><strong>Due Date</strong> - ${formatDate(todo.due_date) || 'No due date'} <br><strong>Description - </strong>${todo.description}</p>`;

        // Delete button functionality
        delete_btn.textContent = 'Remove';
        delete_btn.id = 'delete';
        delete_btn.onclick = async function() {
            await deleteTodo(todo.id);
            fetchTodos();
        };

        // Edit button opens modal with current todo details
        edit_btn.textContent = 'Edit';
        edit_btn.id = 'edit';
        edit_btn.onclick = function() {
            openEditModal(todo);
        }

        li_span.classList.add("text-content");

        item.appendChild(li_span);
        item.appendChild(button_div);
        button_div.appendChild(edit_btn);
        button_div.appendChild(delete_btn);
        list.appendChild(item);
    });
}

document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent form submission

    const id = document.getElementById("editModal").dataset.todoId;
    const newTitle = document.getElementById("editTitle").value;
    const newDescription = document.getElementById("editDescription").value;
    const newDueDate = document.getElementById("editDate").value;

    // Send the updated data to the server
    const response = await fetch(`/api/todos/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({ title: newTitle, description: newDescription, due_date: newDueDate || null })

    });

    console.log(id,"--",newTitle,"--",newDescription,"--",newDueDate,"--")

    if (response.ok) {
        alert('Todo updated!');
        closeModal();
        fetchTodos(); // Refresh list after update
    } else {
        alert('Failed to update Todo');
    }
});


// Function to delete a Todo by ID
async function deleteTodo(id){
    const response = await fetch (`/api/todos/${id}/`,{
        method: 'DELETE',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    });

    const data = await response.json();

    const messageDiv = document.querySelector('.messages');

    if (messageDiv){
        // Show the message with appropriate styling based on the response status
        messageDiv.innerHTML = `<div class="alert alert-${data.status}">${data.message}</div>`;
        messageDiv.style.display = 'block';

        // Hide the message after 5 seconds
        setTimeout(()=>{
            
            messageDiv.style.display='none'; // Clears the message content
        },2000);
    }

    if (response.ok){
        fetchTodos(); // Refresh the todo list
    } 
}

document.getElementById('todoForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent page reload on form submission

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due_date').value;

    const response = await fetch('/api/todos/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({ title, description, due_date: dueDate }),


    });
    if (response.ok) {
        alert('Todo added!');
        fetchTodos();
    } else {
        alert('Failed to add Todo');
    }
});





fetchTodos();

