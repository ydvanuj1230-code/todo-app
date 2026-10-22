import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [theme, setTheme] = useState("dark");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ADD TASK
  const addTask = (e) => {
    e.preventDefault();

    const text = input.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      category,
      dueDate,
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    setInput("");
    setPriority("medium");
    setCategory("Personal");
    setDueDate("");
  };

  // COMPLETE TASK
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // DELETE TASK
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // PIN TASK
  const togglePin = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, pinned: !task.pinned }
          : task
      )
    );
  };

  // EDIT
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    const text = editText.trim();

    if (!text) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, text }
          : task
      )
    );

    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // CLEAR COMPLETED
  const clearCompleted = () => {
    setTasks((prev) =>
      prev.filter((task) => !task.completed)
    );
  };

  // FILTER + SEARCH
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const searchMatch = task.text
          .toLowerCase()
          .includes(search.toLowerCase());

        const filterMatch =
          filter === "all" ||
          (filter === "active" && !task.completed) ||
          (filter === "completed" && task.completed);

        return searchMatch && filterMatch;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return b.pinned - a.pinned;
        }

        return b.id - a.id;
      });
  }, [tasks, search, filter]);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const activeCount = tasks.length - completedCount;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount / tasks.length) * 100
        );

  return (
    <div className="app">
      <div className="container">

        {/* HEADER */}
        <header className="header">
          <div>
            <p className="eyebrow">MY PRODUCTIVITY</p>

            <h1>
              Todo<span>App</span>
            </h1>

            <p className="subtitle">
              Organize your day. Get things done.
            </p>
          </div>

          <button
            className="theme-btn"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        {/* STATS */}
        <section className="stats">

          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>

          <div className="stat-card">
            <span>Progress</span>
            <strong>{progress}%</strong>
          </div>

        </section>

        {/* PROGRESS */}
        <section className="progress-card">

          <div className="progress-info">
            <span>Today's Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

        </section>

        {/* ADD TASK */}
        <form
          className="add-form"
          onSubmit={addTask}
        >

          <input
            type="text"
            placeholder="What do you need to do?"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option>Personal</option>
            <option>Study</option>
            <option>Work</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />

          <button type="submit">
            + Add Task
          </button>

        </form>

        {/* SEARCH */}
        <div className="search-box">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

        </div>

        {/* TOOLBAR */}
        <div className="toolbar">

          <div className="filters">

            <button
              className={
                filter === "all" ? "active" : ""
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "active" ? "active" : ""
              }
              onClick={() => setFilter("active")}
            >
              Active
            </button>

            <button
              className={
                filter === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("completed")
              }
            >
              Completed
            </button>

          </div>

          {completedCount > 0 && (
            <button
              className="clear-btn"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>
          )}

        </div>

        {/* TASK LIST */}
        <section className="task-list">

          {filteredTasks.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h2>
                {tasks.length === 0
                  ? "No tasks yet"
                  : "No tasks found"}
              </h2>

              <p>
                {tasks.length === 0
                  ? "Add your first task and start being productive."
                  : "Try changing your search or filter."}
              </p>

            </div>

          ) : (

            filteredTasks.map((task) => (

              <div
                className={`task ${
                  task.completed ? "completed" : ""
                }`}
                key={task.id}
              >

                {/* CHECKBOX */}
                <button
                  className="checkbox"
                  onClick={() =>
                    toggleTask(task.id)
                  }
                >
                  {task.completed ? "✓" : ""}
                </button>

                {/* TASK CONTENT */}
                {editingId === task.id ? (

                  <input
                    className="edit-input"
                    value={editText}
                    autoFocus
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    onKeyDown={(e) => {

                      if (e.key === "Enter") {
                        saveEdit(task.id);
                      }

                      if (e.key === "Escape") {
                        cancelEdit();
                      }

                    }}
                  />

                ) : (

                  <div className="task-content">

                    <div className="task-title">

                      <span className="task-text">
                        {task.text}
                      </span>

                      {task.pinned && (
                        <span className="pin">
                          📌
                        </span>
                      )}

                    </div>

                    <div className="task-meta">

                      <span
                        className={`priority ${task.priority}`}
                      >
                        {task.priority}
                      </span>

                      <span className="category">
                        {task.category}
                      </span>

                      {task.dueDate && (
                        <span className="due">
                          📅 {task.dueDate}
                        </span>
                      )}

                    </div>

                  </div>

                )}

                {/* ACTIONS */}
                <div className="task-actions">

                  {editingId === task.id ? (

                    <>
                      <button
                        className="save"
                        onClick={() =>
                          saveEdit(task.id)
                        }
                      >
                        ✓
                      </button>

                      <button
                        className="cancel"
                        onClick={cancelEdit}
                      >
                        ×
                      </button>
                    </>

                  ) : (

                    <>

                      <button
                        className="pin-btn"
                        onClick={() =>
                          togglePin(task.id)
                        }
                      >
                        {task.pinned
                          ? "📌"
                          : "📍"}
                      </button>

                      <button
                        className="edit"
                        onClick={() =>
                          startEditing(task)
                        }
                      >
                        ✎
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                      >
                        🗑
                      </button>

                    </>

                  )}

                </div>

              </div>

            ))

          )}

        </section>

        {/* FOOTER */}
        <footer>

          <span>
            {activeCount} task
            {activeCount !== 1 ? "s" : ""}
            {" "}remaining
          </span>

          <span>
            Made with React ⚛️
          </span>

        </footer>

      </div>
    </div>
  );
}

export default App;