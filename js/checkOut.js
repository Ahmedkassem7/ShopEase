document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser) {
    alert("You must login first.");
    window.location.href = "./register.html";
    return;
  }

  const userId = currentUser.id;

  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    const userData = await response.json();

    const cart = userData.cart || [];

    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
      2
    )}`;
    document.getElementById("cart-total").textContent = `$${subtotal.toFixed(
      2
    )}`;
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
  }
});
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
