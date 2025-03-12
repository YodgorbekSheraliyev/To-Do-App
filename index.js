const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "todos.json");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const loadTodos = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, "[]"); // Fayl bo'lmasa, yaratib bo'sh array yozish
        }
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return data ? JSON.parse(data) : []; // Agar bo'sh bo'lsa, bo'sh array qaytarish
    } catch (error) {
        console.error("Error reading todos.json:", error);
        return [];
    }
};


const saveTodos = (todos) => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]");  // Agar fayl yo'q bo'lsa, yaratamiz
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};


app.get("/todos", (req, res) => {
    res.json(loadTodos());
});

app.post("/todos", (req, res) => {
    if (!req.body.text || req.body.text.trim() === "") {
        return res.status(400).json({ error: "Text is required" });
    }
    const todos = loadTodos();
    const newTodo = { id: Date.now(), text: req.body.text, done: false };
    todos.push(newTodo);
    saveTodos(todos);
    res.json(newTodo);
});


app.put("/todos/:id", (req, res) => {
    const todos = loadTodos();
    const todo = todos.find(t => t.id == req.params.id);
    if (todo) {
        todo.done = req.body.done;
        saveTodos(todos);
        res.json(todo);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

app.delete("/todos/:id", (req, res) => {
    let todos = loadTodos();
    todos = todos.filter(t => t.id != req.params.id);
    saveTodos(todos);
    res.json({ success: true });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
