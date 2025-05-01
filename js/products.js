import { showCustomAlert } from "./alerts.js";

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("productsContainer");
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const categoryFilters = document.getElementById("categoryFilters");
  const brandsFilters = document.getElementById("brandsFilters");
  const notFound = document.getElementById("notFound");
  const loadingSpinner = document.getElementById("loadingSpinner");
  let products = [];
  let categories = new Set();
  let brands = new Set();
  let selectedCategories = new Set();
  let selectedbrands = new Set();
  let maxPrice = 2000;

  fetch("https://ecommerce.routemisr.com/api/v1/products")
    .then((response) => response.json())
    .then((data) => {
      products = data.data;
      products.forEach((product) => {
        if (product.category && product.category.name) {
          categories.add(product.category.name);
        }
        if (product.brand && product.brand.name) {
          brands.add(product.brand.name);
        }
      });
      // console.log(products);
      // console.log(categories);
      // console.log(brands);
      renderCategoryFilters();
      renderBrandsFilters();
      renderProducts();
    })
    .catch((err) => console.error("Error Fetching data ", err))
    .finally(() => {
      loadingSpinner.classList.add("d-none");
    });

  // renderCategoryFilters
  function renderCategoryFilters() {
    categories.forEach((category) => {
      const div = document.createElement("div");
      div.className = "mt-2  ";
      div.innerHTML = `
       <input class="form-check-input" type="checkbox" value="${category}" id="category-${category}">
      <label class="form-check-label" for="category-${category}">
        ${category}
      </label> `;
      categoryFilters.appendChild(div);
    });
    //checkbox input
    categoryFilters
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            selectedCategories.add(checkbox.value);
            // console.log(selectedCategories);
          } else {
            selectedCategories.delete(checkbox.value);
          }
          loadingSpinner.classList.add("d-none");
          renderProducts();
        });
      });
  }

  function renderBrandsFilters() {
    brands.forEach((brand) => {
      const div = document.createElement("div");
      div.className = "mt-2";

      div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${brand}" id="category-${brand}" />
      <label class="form-check-label" for="category-${brand}">
        ${brand}
      </label>`;

      brandsFilters.appendChild(div);
    });
    brandsFilters
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            selectedbrands.add(checkbox.value);
          } else {
            selectedbrands.delete(checkbox.value);
          }
          renderProducts();
        });
      });
  }

  async function renderProducts() {
    productsContainer.innerHTML = "";
    loadingSpinner.classList.remove("d-none");

    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm);
      const matchesPrice = product.price <= maxPrice;
      const matchesCategory =
        selectedCategories.size === 0 ||
        selectedCategories.has(product.category.name);
      const matchesBrands =
        selectedbrands.size === 0 || selectedbrands.has(product.brand.name);
      return matchesSearch && matchesPrice && matchesCategory && matchesBrands;
    });

    if (filteredProducts.length === 0) {
      notFound.classList.remove("d-none");
      notFound.classList.add("show");
    } else {
      notFound.classList.add("d-none");
      notFound.classList.remove("show");

      filteredProducts.forEach((product) => {
        const productCard = `
          <div class="card product-card">
            <div class="product-image-container">
              <img src="${
                product.imageCover
              }" class="card-img-top product-image" alt="${product.title}" />
              <div class="quick-actions">
                <button class="btn buy-now" data-id="${
                  product._id
                }">Add to Cart</button>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <div class="row justify-content-between">
                <div class="col-lg-8">
                  <div class="price-container">
                    <span class="original-price">$${(
                      product.price * 0.8
                    ).toFixed(1)}</span>
                    <span class="discounted-price">$${product.price}</span>
                  </div>
                  <div class="product-rating">
                    <span class="stars">${"★".repeat(
                      Math.round(product.ratingsAverage)
                    )}${"☆".repeat(
          5 - Math.round(product.ratingsAverage)
        )}</span>
                    <span class="rating-count">${product.ratingsAverage}</span>
                  </div>
                </div>
                <div class="col-lg-2">
                  <i class="fs-4 mb-2 bi bi-eye view-product" data-id="${
                    product._id
                  }" style="cursor:pointer;"></i>
                  <i class="fs-4 mb-2 bi bi-heart"></i>
                </div>
              </div>
            </div>
          </div>`;
        productsContainer.insertAdjacentHTML("beforeend", productCard);
      });
    }

    loadingSpinner.classList.add("d-none");
  }
  // Search input event
  searchInput.addEventListener("input", renderProducts);

  priceRange.addEventListener("input", (e) => {
    maxPrice = e.target.value;
    priceValue.textContent = `$0 - $${maxPrice}`;
    renderProducts();
  });
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("buy-now")) {
    e.preventDefault();
    e.stopPropagation();

    const button = e.target;
    const originalText = button.textContent;
    button.textContent = "Adding...";
    button.disabled = true;

    const productId = button.dataset.id;
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      showCustomAlert(
        "warning",
        "Warning!",
        "You must login first.",
        3000,
        "top-right"
      );
      button.textContent = originalText;
      button.disabled = false;
      return;
    }

    // ✅ 1. Update UI & show alert first
    showCustomAlert(
      "success",
      "Added!",
      "Product has been added to your cart.",
      3000,
      "top-right"
    );

    // ✅ 2. Restore button state quickly
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1500);

    // ✅ 3. Fetch product and update cart in background
    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${productId}`
      );
      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      const productData = data.data;

      const userId = currentUser.id;
      const product = {
        productId,
        name: productData.title,
        price: productData.price,
        quantity: 1,
        image: productData.images[0],
      };

      let updatedCart = [];
      try {
        const res = await fetch(`http://localhost:3000/users/${userId}`);
        if (!res.ok) throw new Error("Fetching user failed");

        const user = await res.json();
        updatedCart = user.cart || [];
      } catch (error) {
        console.error("Error fetching user:", error);
      }

      const existing = updatedCart.find((p) => p.productId === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        updatedCart.push(product);
      }

      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-product")) {
    const productId = e.target.dataset.id;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      showCustomAlert(
        "warning",
        "Warning!",
        "You must login first.",
        3000,
        "top-right"
      );
      return;
    }
    window.location.href = `/pages/productPage.html?id=${productId}`;
  }
});

anime({
  targets: "h2 span",
  translateY: [
    { value: "-2.75rem", easing: "easeOutExpo", duration: 600 },
    { value: 0, easing: "easeOutBounce", duration: 800, delay: 100 },
  ],
  rotate: {
    value: "-1turn",
    delay: 0,
  },
  delay: (el, i) => i * 50, // each letter starts a bit later
  easing: "easeInOutCirc",
  loop: true,
  loopDelay: 1000,
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.scrollToTop = scrollToTop; // Expose the function to the global scope
