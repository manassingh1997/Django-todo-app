

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
        item.textContent = `${todo.title} - ${todo.description}`;
        
        // Delete button functionality
        delete_btn.textContent = 'Remove';
        delete_btn.id = 'delete';
        delete_btn.onclick = async function() {
            await deleteTodo(todo.id); //Calls delete function
            fetchTodos(); // Refresh list after deletion
        };
        edit_btn.textContent = 'Edit';
        edit_btn.id = 'edit';
        edit_btn.onclick = async function(){
            await editTodo(todo.id); // Call the edit function
            fetchTodos(); //Refresh list after update/edit
        }

        li_span.classList.add("text-content")

        item.appendChild(li_span)
        item.appendChild(button_div)
        button_div.appendChild(edit_btn)
        button_div.appendChild(delete_btn);
        list.appendChild(item);
    });
}

async function editTodo(id) {
    const newTitle = prompt("Enter new title:");
    const newDescription = prompt("Enter new description:");

    if (newTitle && newDescription) {
        const response = await fetch(`/api/todos/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ title: newTitle, description: newDescription }),
        });

        if (response.ok) {
            alert('Todo updated!');
            fetchTodos();
        } else {
            alert('Failed to update Todo');
        }
    }
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

