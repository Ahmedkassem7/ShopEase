const toggleBtn = document.getElementById("toggleBtn");
const navbarContent = document.getElementById("navbarContent");

toggleBtn.addEventListener("click", () => {
  navbarContent.classList.toggle("show");
});

function updateNavbar() {
  const userString = localStorage.getItem("user");
  const Account = document.getElementById("Account");
  const logoutIcon = document.getElementById("logout");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (userString) {
    const user = JSON.parse(userString);

    if (dropdownMenu && user) {
      dropdownMenu.innerHTML = `<i class="bi bi-person"></i> ${user.username}`;
    }
    if (Account) Account.style.display = "none";
    if (logoutIcon) logoutIcon.style.display = "block";
  } else {
    if (dropdownMenu) {
      dropdownMenu.innerHTML = `<i class="bi bi-person"></i> Guest`;
    }
    if (Account) Account.style.display = "block";
    if (logoutIcon) logoutIcon.style.display = "none";
  }
}

function handleLogout() {
  localStorage.removeItem("user");
  updateNavbar();
  window.location.href = "/pages/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  const logoutIcon = document.getElementById("logout");
  if (logoutIcon) {
    logoutIcon.addEventListener("click", handleLogout);
  }
});
