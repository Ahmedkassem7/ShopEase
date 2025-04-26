document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser) {
    alert("You must login first.");

    window.location.href = "/pages/register.html";
    return;
  }

  const userId = currentUser.id;

  const response = await fetch(`http://localhost:3000/users/${userId}`);
  const userData = await response.json();

  const cart = userData.cart || [];

  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;

    const row = `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-link text-danger p-0 me-3 remove-from-cart" data-id="${item.productId}">×</button>
            <img src="${item.image}" alt="${item.name}" class="me-3 rounded" style="width: 50px; height: 50px; object-fit: cover;">
            <span class="fw-medium">${item.name}</span>
          </div>
        </td>
        <td class="fw-medium">$${item.price}</td>
        <td>
          <input type="number" class="form-control form-control-sm quantity-input" data-id="${item.productId}" style="width: 80px;" value="${item.quantity}" min="1">
        </td>
        <td class="fw-medium subtotal" data-id="${item.productId}">$${subtotal}</td>
      </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", async (e) => {
      const productId = e.target.dataset.id;
      const newQty = parseInt(e.target.value);

      const updatedCart = cart.map((item) => {
        if (item.productId === productId) {
          item.quantity = newQty;
        }
        return item;
      });

      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });

      // تحديث subtotal في الواجهة
      const updated = updatedCart.find((p) => p.productId === productId);
      document.querySelector(
        `.subtotal[data-id="${productId}"]`
      ).textContent = `$${updated.price * updated.quantity}`;
    });
  });

  // remove from cart
  document.querySelectorAll(".remove-from-cart").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      const updatedCart = cart.filter((item) => item.productId !== productId);
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
      btn.closest("tr").remove();
    });
  });

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("cart-total").textContent = `$${subtotal.toFixed(2)}`;
});
