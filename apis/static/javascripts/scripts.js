

async function fetchTodos(){
    const response = await fetch('/api/todos/');
    const todos = await response.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach(todo => {
        const item = document.createElement('li');
        const delete_btn = document.createElement('button');
        item.textContent = `${todo.title} - ${todo.description}`;
        
        // Delete button functionality
        delete_btn.textContent = 'Remove';
        delete_btn.id = 'delete';
        delete_btn.onclick = async function() {
            await deleteTodo(todo.id); //Calls delete function
            fetchTodos(); // Refresh list after deletion
        };
        item.appendChild(delete_btn);
        list.appendChild(item);
    });
}

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
        messageDiv.innerHTML = `<div class="alert alert-${data.status}">${data.message}</div>`;
    }

    if (response.ok){
        fetchTodos();
    } 
}

document.getElementById('todoForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent page reload on form submission

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const response = await fetch('/api/todos/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
        alert('Todo added!');
        fetchTodos();
    } else {
        alert('Failed to add Todo');
    }
});


fetchTodos();