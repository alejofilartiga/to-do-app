const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = [];


// Fetch todos from the server
async function fetchTodos() {
    try {
        const response = await fetch('https://to-do-api-pi.vercel.app/todo');
        const data = await response.json();
        todos = data;
        renderTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Render todos
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span>${todo.title}</span>
            <button onclick="deleteTodo('${todo._id}')">Delete</button>
        `;
        li.addEventListener('click', () => toggleTodo(todo._id));
        todoList.appendChild(li);
    });
}

// Add new todo
async function addTodo(e) {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (title) {
        try {
            const response = await fetch('https://to-do-api-pi.vercel.app/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });
            const data = await response.json();
            todos.push(data.newTask);
            renderTodos();
            todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }
}

// Delete todo
async function deleteTodo(id) {
    try {
        await fetch(`https://to-do-api-pi.vercel.app/todo/${id}`, {
            method: 'DELETE',
        });
        todos = todos.filter(todo => todo._id !== id);
        renderTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    try {
        const todo = todos.find(t => t._id === id);
        const response = await fetch(`https://to-do-api-pi.vercel.app/todo/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !todo.completed }),
        });
        const data = await response.json();
        todos = todos.map(t => t._id === id ? data.task : t);
        renderTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

// Event listeners
todoForm.addEventListener('submit', addTodo);

// Initial fetch
fetchTodos();