async function getProductById() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
      console.error("Product ID not found in URL parameters.");
      return;
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const product = data.data;

    // Update content
    document.getElementById("title").textContent = product.title;
    document.getElementById("price").textContent = `$${product.price}`;
    document.getElementById("ratingsAverage").textContent =
      product.ratingsAverage;
    document.getElementById(
      "ratingsQuantity"
    ).textContent = `Based on ${product.ratingsQuantity} reviews`;
    document.getElementById("description").textContent = product.description;

    document.getElementById("img1").src = product.imageCover;
    document.getElementById("img2").src = product.images[0];
    document.getElementById("img3").src = product.images[1];
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

getProductById();

document.addEventListener("click", async (e) => {
  const toast = document.getElementById("toast");

  if (e.target.classList.contains("buy-now")) {
    const productId = e.target.dataset.id;
    // console.log("productId", productId);
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const productData = data.data;
    // console.log("productData", productData);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      alert("You must login first.");
      return;
    }
    const userId = currentUser.id;
    const product = {
      productId,
      name: productData.title,
      price: productData.price,
      quantity: 1,
      image: productData.images[0],
    };

    const res = await fetch(`http://localhost:3000/users/${userId}`);
    const user = await res.json();
    const updatedCart = user.cart || [];
    const existing = updatedCart.find((p) => p.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push(product);
    }
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 1000);
    setTimeout(async () => {
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      });
    });
  }
});
