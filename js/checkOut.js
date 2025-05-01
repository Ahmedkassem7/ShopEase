import { showCustomAlert } from "./alerts.js";

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

    document
      .getElementById("placeOrder")
      .addEventListener("click", async (e) => {
        const placeOrderBtn = e.target;
        if (cart.length === 0) {
          showCustomAlert(
            "warning",
            "Warning!",
            "Your cart is empty!",
            3000,
            "top-right"
          );
          return;
        }

        placeOrderBtn.disabled = true;
        const originalText = placeOrderBtn.textContent;
        placeOrderBtn.textContent = "Loading...";

        const order = {
          id: Date.now(),
          items: cart,
          date: new Date().toLocaleString(),
          total: subtotal,
          status: "Pending",
        };

        const updatedOrders = userData.orders
          ? [...userData.orders, order]
          : [order];

        const updatedUser = {
          ...userData,
          orders: updatedOrders,
          cart: [],
        };

        try {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const updateResponse = await fetch(
            `http://localhost:3000/users/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          );

          if (updateResponse.ok) {
            window.location.href = "/pages/order-done.html";
          } else {
            showCustomAlert(
              "warning",
              "Warning!",
              "Failed to place order. Try again.",
              3000,
              "top-right"
            );
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = originalText;
          }
        } catch (error) {
          console.error("Error updating user:", error);
          showCustomAlert(
            "error",
            "Error!",
            "Something went wrong. Please try again.",
            3000,
            "top-right"
          );
          placeOrderBtn.disabled = false;
          placeOrderBtn.textContent = originalText;
        }
      });
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    showCustomAlert(
      "error",
      "Error!",
      "Failed to load cart. Please refresh the page.",
      3000,
      "top-right"
    );
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.scrollToTop = scrollToTop; // Expose globally if needed in HTML
