function scrollToContactForm() {
  const formElement = document.getElementById("contactForm");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth" });
  }
}

const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

  form.reset();
});
console.log("Contact form script loaded successfully.");
