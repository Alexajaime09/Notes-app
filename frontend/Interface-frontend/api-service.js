const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:9090"
    : "https://notes-app-rbt5.onrender.com";

const getAuthToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()} `,
});

export const apiServiceFront = {
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/notes?${queryString}`, {
      method: "GET",
      headers: headers(),
    });
    return handleResponse(response);
  },

  async createNote(noteData) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(noteData),
    });
    return handleResponse(response);
  },

  async updateNote(id, updatedData) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(updatedData),
    });
    return handleResponse(response);
  },

  async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return handleResponse(response);
  },
};

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "something went wrong");
  }

  return data;
}
