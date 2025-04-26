const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/users?email=${email}&password=${password}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const users = await response.json();
    // console.log("Users:", users); // Log for debugging

    if (users.length > 0) {
      const { id, username, email } = users[0];
      localStorage.setItem("user", JSON.stringify({ id, username, email }));
      alert("User found! Redirecting...");

      window.location.href = "/pages/index.html";
    } else {
      alert("Invalid email or password.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please try again.");
  }
});
