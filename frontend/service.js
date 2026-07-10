const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:9090"
    : "https://notes-app-rbt5.onrender.com";

/**
 * Helper para obtener el token JWT almacenado de forma segura.
 * @returns {string|null} El token de autenticación.
 */

const getAuthToken = () => localStorage.getItem("token");

/**
 * @param {Response} response
 * @throws {Error}
 */

async function handleResponse(response) {
  if (response.ok) {
    if (response.status === 204) return null;
    return await response.json();
  }

  let errorMessage = "An unexpected error occurred on the server";
  let mistake;

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (err) {
    errorMessage = `Network or server error  ${response.statusText}`;
  }

  if (response.status === 401) {
    localStorage.removeItem("token");

    if (!window.location.pathname.endsWith("index.html")) {
      window.location.href = "index.html";
    }
  }
  throw new Error(errorMessage);
}

export const apiService = {
  /** *
   *@param {string} endpoint
   */

  async get(endpoint) {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Hostname:", window.location.hostname);
    console.log("BASE_URL:", BASE_URL);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    return handleResponse(response);
  },

  /**
   * @param {string} endpoint
   * @param {Object} body
   *
   */
  async post(endpoint, body) {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  /**
   * @param {string} endpoint
   * @param {Object} body
   *
   */

  async patch(endpoint, body) {
    const token = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  /**
   * @param {string} endpoint
   */

  async delete(endpoint) {
    const token = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "Delete",
      headers,
    });

    return handleResponse(response);
  },
};
