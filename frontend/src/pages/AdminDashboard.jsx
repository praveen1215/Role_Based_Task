
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllTasks,
  createAdminTask,
  updateAdminTask,
  deleteAdminTask,
  getUsers,
  changeUserRole,
} from "../services/adminService";

const emptyTask = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  ownerId: "",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ ...emptyTask });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  
  const [searchTitle, setSearchTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");


  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [taskData, userData] = await Promise.all([
        getAllTasks(),
        getUsers(),
      ]);

      setTasks(taskData);
      setUsers(userData);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...emptyTask });
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function openEdit(task) {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || "",
      ownerId: String(task.ownerId),
    });

    setEditingId(task.id);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveTask(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const taskData = {
        ...form,
        ownerId: Number(form.ownerId),
      };

      if (editingId !== null) {
        await updateAdminTask(editingId, taskData);
        setMessage("Task updated successfully.");
      } else {
        await createAdminTask(taskData);
        setMessage("Task created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteAdminTask(id);
      setMessage("Task deleted.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateRole(user) {
    const newRole = user.role === "USER" ? "ADMIN" : "USER";

    if (!window.confirm(
      `Change ${user.name}'s role to ${newRole}?`
    )) return;

    try {
      setError("");
      await changeUserRole(user.id, newRole);
      setMessage("User role updated.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("name");
    navigate("/login", { replace: true });
  }
  
const filteredTasks = tasks.filter((task) => {
  const matchesTitle = task.title
    .toLowerCase()
    .includes(searchTitle.trim().toLowerCase());

  const matchesStatus =
    filterStatus === "ALL" || task.status === filterStatus;

  const matchesPriority =
    filterPriority === "ALL" || task.priority === filterPriority;

  return matchesTitle && matchesStatus && matchesPriority;
});

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Task Manager — Admin</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <h1>Admin Dashboard</h1>
      <p>Manage your team's tasks and users.</p>

      <div className="admin-tabs">
        <button onClick={() => setTab("tasks")}>
          Tasks ({tasks.length})
        </button>
        <button onClick={() => setTab("users")}>
          Users ({users.length})
        </button>
      </div>

      {error && <p className="task-error" role="alert">{error}</p>}
      {message && <p className="task-success">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : tab === "tasks" ? (
        <div className="dashboard-content">
          <div className="dashboard-title">
            <h2>All Tasks</h2>
            <button onClick={openCreate}>+ New Task</button>
          </div>
        
          <div className="admin-filters">

            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              aria-label="Search tasks by title"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter tasks by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter tasks by priority"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTitle("");
                setFilterStatus("ALL");
                setFilterPriority("ALL");
              }}
            >
              Clear
            </button>

          </div>

          <p className="filter-count">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>

          {showForm && (
            <form className="task-form" onSubmit={saveTask}>
              <h3>
                {editingId !== null ? "Edit Task" : "Create Task"}
              </h3>

              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={255}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={2000}
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

              <label>Assign to User</label>
              <select
                name="ownerId"
                value={form.ownerId}
                onChange={handleChange}
                required
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              <div className="task-actions">
                <button disabled={saving} type="submit">
                  {saving ? "Saving..." : "Save Task"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

         
        {filteredTasks.length === 0 ? (
          <p>No tasks match your search or filters.</p>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (

                <div className="task-card" key={task.id}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p><strong>Owner:</strong> {task.ownerName}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Due:</strong> {task.dueDate}</p>

                  <div className="task-actions">
                    <button onClick={() => openEdit(task)}>
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => removeTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-content">
          <h2>Manage Users</h2>

          <div className="task-list">
            {users.map((user) => (
              <div className="task-card" key={user.id}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>

                <button onClick={() => updateRole(user)}>
                  {user.role === "USER"
                    ? "Make Admin"
                    : "Make User"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
