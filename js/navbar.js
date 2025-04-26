const toggleBtn = document.getElementById("toggleBtn");
const navbarContent = document.getElementById("navbarContent");

toggleBtn.addEventListener("click", () => {
  navbarContent.classList.toggle("show");
});

function updateNavbar() {
  const user = localStorage.getItem("user");
  const Account = document.getElementById("Account");
  const logoutIcon = document.getElementById("logout");
  if (user) {
    if (Account) Account.style.display = "none";
    if (logoutIcon) logoutIcon.style.display = "block";
  } else {
    if (Account) Account.style.display = "block";
    if (logoutIcon) logoutIcon.style.display = "none";
  }
  console.log("aaa", user);
}

function handleLogout() {
  localStorage.removeItem("user");
  updateNavbar();
  window.location.href = "/pages/login.html"; // او حسب لينك اللوجين عندك
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  const logoutIcon = document.getElementById("logout");
  if (logoutIcon) {
    logoutIcon.addEventListener("click", handleLogout);
  }
});
