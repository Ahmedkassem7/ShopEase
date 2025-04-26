const toggleBtn = document.getElementById("toggleBtn");
const navbarContent = document.getElementById("navbarContent");

toggleBtn.addEventListener("click", () => {
  navbarContent.classList.toggle("show");
});
