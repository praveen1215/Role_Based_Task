
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskservice";

const emptyForm = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
};

function UserDashboard() {
  const navigate = useNavigate();

  const name = sessionStorage.getItem("name") || "User";

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function openCreateForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function openEditForm(task) {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || "",
    });

    setEditingId(task.id);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId !== null) {
        await updateTask(editingId, form);
        setMessage("Task updated successfully.");
      } else {
        await createTask(form);
        setMessage("Task created successfully.");
      }

      closeForm();
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteTask(id);

      setMessage("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("name");

    navigate("/login", { replace: true });
  }

  const totalTasks = tasks.length;
  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const completed = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Task Manager</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <h1>Welcome, {name}</h1>
      <p>Manage your daily tasks here.</p>

      <div className="task-stats">
        <div className="stat-card">
          <h2>{totalTasks}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h2>{inProgress}</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-card">
          <h2>{completed}</h2>
          <p>Completed</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-title">
          <h2>My Tasks</h2>
          <button onClick={openCreateForm}>+ New Task</button>
        </div>

        {error && <p className="task-error" role="alert">{error}</p>}
        {message && <p className="task-success">{message}</p>}

        {showForm && (
          <form className="task-form" onSubmit={handleSubmit}>
            <h3>{editingId !== null ? "Edit Task" : "Create Task"}</h3>

            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={255}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={2000}
              rows={3}
            />

            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <label>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
            />

            <div className="task-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId !== null ? "Update Task" : "Create Task"}
              </button>

              <button type="button" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Click New Task to create your first task.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <p><strong>Status:</strong> {task.status.replaceAll("_", " ")}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Due:</strong> {task.dueDate}</p>

                <div className="task-actions">
                  <button onClick={() => openEditForm(task)}>
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
