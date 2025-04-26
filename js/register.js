const form = document.getElementById("register-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");

function createErrorElement(input) {
  const error = document.createElement("small");
  error.className = "text-danger  mt-1";
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
  }
  usernameError.style.display = "none";
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  if (!value) {
    emailError.textContent = "Email is required.";
    emailError.style.display = "block";
    return false;
  } else if (!emailRegex.test(value)) {
    emailError.textContent = "Invalid email format.";
    emailError.style.display = "block";
    return false;
  }
  emailError.style.display = "none";
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!value) {
    passwordError.textContent = "Password is required.";
    passwordError.style.display = "block";
    return false;
  } else if (!strongPasswordRegex.test(value)) {
    passwordError.textContent =
      "Password must be at least 6 characters, include a number and an uppercase letter.";
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
  // input.addEventListener("change", validateFunc);
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
    return;
  }

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      emailError.textContent = "Email already exists.";
      emailError.style.display = "block";
      return;
    }

    const newUser = { username, email, password };

    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      location.href = "/pages/login.html";
      alert("Registered successfully!");
      form.reset();
    } else {
      alert("Something went wrong. Try again.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Is JSON Server running?");
  }
});
