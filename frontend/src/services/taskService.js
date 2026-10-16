
const API_URL = "http://localhost:8080/tasks";

async function sendRequest(path = "", options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }

    if (response.status === 404) {
      throw new Error("Task not found or access denied.");
    }

    throw new Error("Request failed. Please check your information.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTasks() {
  return sendRequest();
}

export function createTask(task) {
  return sendRequest("", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, task) {
  return sendRequest(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteTask(id) {
  return sendRequest(`/${id}`, {
    method: "DELETE",
  });
}
