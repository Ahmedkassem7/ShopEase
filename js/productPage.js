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
