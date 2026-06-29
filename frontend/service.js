const BASE_URL = "http://localhost:9090";

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

  try {
    const errorData = await response.json();
    errorMessage = errorData.error || errorMessage;
  } catch (err) {
    errorMessage = `Error de red o servidor  ${response.statusText}`;
  }

  if (response.status === 401) {
    localStorage.removeItem("token");

    if (!window.location.pathname.endsWith("login.html")) {
      window.location.href = "login.html";
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
      "Content-Type": "aplication/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    return handleResponse;
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

    const header = {
      "Type-Content": "application/json",
    };

    if (token) {
      header["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "Delete",
      headers,
    });

    return handleResponse(response);
  },
};
