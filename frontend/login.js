import { apiService } from "./service.js";

const loginUser = async (userData) => {
  try {
    let response = await apiService.post("/notes/login", userData);
    localStorage.setItem("token", response.token);
    return {
      success: true,
      ...response,
    };
  } catch (err) {
    console.error("API Erros [login User]", err);

    throw err;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const submitButton = document.getElementById("btn-submit");
  const errorContainer = document.getElementById("error-message");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);

    const email = formData.get("email")?.trim();
    const password = formData.get("password");

    cleanErrors(errorContainer);

    if (!email || !password) {
      showError("All fields are require", errorContainer);
    }

    try {
      setLoadingState(true, submitButton);

      let response = await loginUser({ email, password });

      if (response.success) {
        console.log(response);

        setTimeout(() => {
          window.location.href = "./interface-frontend/notes.html";
        }, 4000);
      }
    } catch (err) {
      showError(err.message, errorContainer);
    } finally {
      setLoadingState(false, submitButton);
    }
  });
});

function showError(message, container) {
  if (!container) return;
  container.textContent = message;
  container.classList.remove("hidden");
}

function setLoadingState(isLoading, button) {
  if (!button) return;
  if (isLoading) {
    ((button.disabled = true), (button.textContent = "Loading"));
  } else {
    button.disabled = false;
    button.textContent = "Sing in";
  }
}

function cleanErrors(container) {
  container.textContent = "";
  container.classList.add("hidden");
}
