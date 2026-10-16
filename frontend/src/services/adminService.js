
const API_URL = "http://localhost:8080/admin";

async function adminRequest(path, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("You do not have admin permission.");
    }

    throw new Error(`Request failed (${response.status})`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export function getAllTasks() {
  return adminRequest("/tasks");
}

export function createAdminTask(task) {
  return adminRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateAdminTask(id, task) {
  return adminRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteAdminTask(id) {
  return adminRequest(`/tasks/${id}`, {
    method: "DELETE",
  });
}

export function getUsers() {
  return adminRequest("/users");
}

export function changeUserRole(id, role) {
  return adminRequest(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
