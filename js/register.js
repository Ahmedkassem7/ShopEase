const form = document.getElementById("register-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");
const toastElement = document.getElementById("toast");
const toastBody = document.getElementById("toast-body");

// Function to show toast
function showToast(message, bgColor = "bg-danger") {
  toastElement.className = `toast align-items-center text-white ${bgColor} border-0`;
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

function createErrorElement(input) {
  const error = document.createElement("small");
  error.className = "text-danger mt-1";
  error.style.display = "none";
  input.parentNode.appendChild(error);
  return error;
}

const usernameError = createErrorElement(usernameInput);
const emailError = createErrorElement(emailInput);
const passwordError = createErrorElement(passwordInput);
const confirmError = createErrorElement(confirmInput);

// Validation Functions
function validateUsername() {
  const value = usernameInput.value.trim();
  if (!value) {
    usernameError.textContent = "Username is required.";
    usernameError.style.display = "block";
    return false;
  } else if (value.length < 3) {
    usernameError.textContent = "Username must be at least 3 characters.";
    usernameError.style.display = "block";
    return false;
  } else if (/\d/.test(value)) {
    usernameError.textContent = "Username must not contain numbers.";
    usernameError.style.display = "block";
    return false;
  } else if (!/^[a-zA-Z_]+$/.test(value)) {
    usernameError.textContent =
      "Username can only contain letters and underscores.";
    usernameError.style.display = "block";
    return false;
  }
  usernameError.style.display = "none";
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[\w.-]+@gmail\.com$/i;
  if (!value) {
    emailError.textContent = "Email is required.";
    emailError.style.display = "block";
    return false;
  } else if (!emailRegex.test(value)) {
    emailError.textContent = "Email must be like 'asd12@gmail.com'.";
    emailError.style.display = "block";
    return false;
  }
  emailError.style.display = "none";
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!value) {
    passwordError.textContent = "Password is required.";
    passwordError.style.display = "block";
    return false;
  } else if (!strongPasswordRegex.test(value)) {
    passwordError.textContent =
      "Password must be 8+ chars, include uppercase, number, and special character (!@#$%^&*).";
    passwordError.style.display = "block";
    return false;
  }
  passwordError.style.display = "none";
  return true;
}

function validateConfirmPassword() {
  const passwordValue = passwordInput.value;
  const confirmValue = confirmInput.value;
  if (!confirmValue) {
    confirmError.textContent = "Confirm your password.";
    confirmError.style.display = "block";
    return false;
  } else if (confirmValue !== passwordValue) {
    confirmError.textContent = "Passwords do not match.";
    confirmError.style.display = "block";
    return false;
  }
  confirmError.style.display = "none";
  return true;
}

function addValidationListeners(input, validateFunc) {
  input.addEventListener("input", validateFunc);
}

addValidationListeners(usernameInput, validateUsername);
addValidationListeners(emailInput, validateEmail);
addValidationListeners(passwordInput, () => {
  validatePassword();
  validateConfirmPassword();
});
addValidationListeners(confirmInput, validateConfirmPassword);

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();

  if (
    !isUsernameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmValid
  ) {
    showToast("Please fix the errors in the form.");
    return;
  }

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) throw new Error("Failed to fetch users.");

    const users = await response.json();
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      emailError.textContent = "Email already exists.";
      emailError.style.display = "block";
      showToast("Email already exists. Try a different one.");
      return;
    }

    const newUser = { username, email, password };

    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      window.location.href = "/pages/login.html";

      showToast("Registered successfully! Redirecting...", "bg-success");
      // form.reset();
    } else {
      showToast("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error("Error:", err);
    showToast("Server error. Check if backend is running.");
  }
});
