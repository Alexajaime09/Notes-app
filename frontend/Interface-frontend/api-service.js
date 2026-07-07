const BASE_URL = "http://localhost:9090";

const getAuthToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorizathion: `Bearer ${getAuthToken()} `,
});

export const apiServiceFront = {
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/notes/${queryString}`, {
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

  async updateNote(id, updateData) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(updateData),
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

  if (!response) {
    throw new Error(data.message || "something went wrong");
  }

  return data;
}
