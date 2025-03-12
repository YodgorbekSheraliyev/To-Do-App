document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
});

async function loadTodos() {
    const response = await fetch("/todos");
    const todos = await response.json();
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        li.classList.toggle("completed", todo.done);

        li.addEventListener("click", () => toggleTodo(todo.id, !todo.done));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();
    if (text === "") return;

    const response = await fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    if (response.ok) {
        input.value = "";
        loadTodos();
    }
}

async function toggleTodo(id, done) {
    await fetch(`/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done })
    });
    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`/todos/${id}`, { method: "DELETE" });
    loadTodos();
}
