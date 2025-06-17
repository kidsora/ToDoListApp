import React, { useState, useEffect } from "react";
import './App.css';

// TaskForm handles adding and editing tasks
function TaskForm({ onSave, editingTask, onCancel }) {
  const [name, setName] = useState(editingTask?.name || "");
  const [description, setDescription] = useState(editingTask?.description || "");

  useEffect(() => {
    setName(editingTask?.name || "");
    setDescription(editingTask?.description || "");
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert("Please fill in both fields.");
      return;
    }
    onSave({
      id: editingTask?.id || Date.now(),
      name,
      description,
      completed: editingTask?.completed || false,
    });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        className="form-input"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="form-input"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <button type="submit" className="form-button">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// TaskItem represents a single task
function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <h3>{task.name}</h3>
        <p>{task.description}</p>
      </div>
      <div className="task-actions">
        <button onClick={() => onToggle(task.id)}>✔</button>
        <button onClick={() => onEdit(task)}>✏</button>
        <button
          onClick={() =>
            window.confirm("Are you sure you want to delete this task?") &&
            onDelete(task.id)
          }
        >
          ✖
        </button>
      </div>
    </div>
  );
}

// TaskList displays a list of tasks
function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const saveTask = (task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, task]);
    }
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const toggleTask = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <TaskForm
        onSave={saveTask}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
      />
      <TaskList
        tasks={tasks}
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onToggle={toggleTask}
      />
    </div>
  );
}
