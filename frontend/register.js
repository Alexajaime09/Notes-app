/**
 * @typedef {Object} RegisterResponse
 * @property {boolean} success
 * @property {string} [message]
 */

const API_URL = "http://localhost:9090";

/**

 * @param {Object} userData 
 * @param {string} userData.email
 * @param {string} userData.password 
 * @returns {Promise<RegisterResponse>}
 */

async function registerUserApi(userData) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "aplication/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    if (!response) {
      throw new Error(data.message || "Server error while registering user");
    }
    return { success: true, message: data.message };
  } catch (err) {
    console.error("API Error [resgisterUserApi]", err);
    throw err;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const submitButton = document.getElementById("btn-submit");
  const errorContainer = document.getElementById("error-message");

  if (!registerForm) return;

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();
    const confirmPassword = formData.get("confirmPassword");

    cleanErrors(errorContainer);

    if (!email || !password || !confirmPassword) {
      showError("All fields are required.", errorContainer);
      return;
    }

    if (password !== confirmPassword) {
      showError("the passwords are not the same", showError);
      return;
    }

    if (password.length < 6) {
      showError(
        "The password must contain almost 6 characteres",
        errorContainer,
      );
    }
    try {
      setLoadingState(true, submitButton);
      const response = await registerUserApi({ email, password });

      if (response.success) {
        window.location.href = "./login.html?registered=true";
      }
    } catch (err) {
      showError(error.message, errorContainer);
    } finally {
      setLoadingState(false, submitButton);
    }
  });
});

/**
 
 * @param {boolean} isLoading 
 * @param {HTMLButtonElement} button 
 */

function setLoadingState(isLoading, button) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.textContent = "Creating count...";
  } else {
    button.disabled = false;
    button.textContent = "Sign up";
  }
}

/**
 * @param {string} msg
 * @param {HTMLElement} container
 */

function showError(mesagge, container) {
  if (!container) return;
  container.textContent = mesagge;
  container.classList.remove("hidden");
}

/**
 * @param {HTMLElement} container
 */

function cleanErrors(container) {
  if (!container) return;
  container.textContent = "";
  container.classList.add("hidden");
}
