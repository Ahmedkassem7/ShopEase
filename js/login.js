const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toastElement = document.getElementById("toast");
const toastBody = document.getElementById("toast-body");

// Function to show toast with a message
function showToast(message, bgColor = "bg-danger") {
  toastElement.className = `toast align-items-center text-white ${bgColor} border-0`;
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Basic validations
  if (!email || !password) {
    showToast("Please enter both email and password.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email address.");
    return;
  }

  // Validate password length
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/users?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const users = await response.json();

    if (users.length > 0) {
      const { id, username, email } = users[0];
      localStorage.setItem("user", JSON.stringify({ id, username, email }));
      showToast("Login successful! Redirecting...", "bg-success");

      setTimeout(() => {
        window.location.href = "/pages/index.html";
      }, 1500); // Give user a second to see the toast
    } else {
      showToast("Invalid email or password.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    showToast("Login failed. Please try again.");
  }
});
