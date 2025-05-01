import { showCustomAlert } from "./alerts.js";
window.addEventListener("beforeunload", () => {
  console.log("Page is unloading...");
});
function checkUser() {
  const user = localStorage.getItem("user");
  // if (!user) {
  //   window.location.href = "/pages/login.html";
  // }
}

checkUser();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    checkUser();
  }
});
window.addEventListener("focus", checkUser);

// const toggleBtn = document.getElementById("toggleBtn");
// const navbarContent = document.getElementById("navbarContent");

// toggleBtn.addEventListener("click", () => {
//   navbarContent.classList.toggle("show");
// });

//step 1: get DOM
let nextDom = document.getElementById("next");
let prevDom = document.getElementById("prev");

let carouselDom = document.querySelector(".carousel");
let SliderDom = carouselDom.querySelector(".carousel .list");
let thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll(".item");
let timeDom = document.querySelector(".carousel .time");

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 5000;

nextDom.onclick = function () {
  showSlider("next");
};

prevDom.onclick = function () {
  showSlider("prev");
};
let runTimeOut;
let runNextAuto = setTimeout(() => {
  next.click();
}, timeAutoNext);
function showSlider(type) {
  let SliderItemsDom = SliderDom.querySelectorAll(".carousel .list .item");
  let thumbnailItemsDom = document.querySelectorAll(
    ".carousel .thumbnail .item"
  );

  if (type === "next") {
    SliderDom.appendChild(SliderItemsDom[0]);
    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    carouselDom.classList.add("next");
  } else {
    SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
    thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
    carouselDom.classList.add("prev");
  }
  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    carouselDom.classList.remove("next");
    carouselDom.classList.remove("prev");
  }, timeRunning);

  clearTimeout(runNextAuto);
  runNextAuto = setTimeout(() => {
    next.click();
  }, timeAutoNext);
}

async function fetchData() {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products?brand=64089d9e24b25627a25315a5&limit=4"
    );
    const data = await response.json();
    const products = data.data;
    console.log("products", products);

    const productContainer = document.querySelector(".product-container");
    productContainer.innerHTML = "";

    products.forEach((product) => {
      const productCard = `
        <div class="card product-card">
          <div class="product-image-container">
            <img src="${
              product.imageCover
            }" class="card-img-top product-image" alt="${product.title}" />
            <div class="quick-actions">
              <button type="button" class="btn buy-now" data-id="${
                product._id
              }">Add to Cart</button>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <div class="row justify-content-between">
              <div class="col-lg-8">
                <div class="price-container">
                  <span class="original-price">$${(product.price * 0.8).toFixed(
                    1
                  )}</span>
                  <span class="discounted-price">$${product.price}</span>
                </div>
                <div class="product-rating">
                  <span class="stars">${"★".repeat(
                    Math.round(product.ratingsAverage)
                  )}${"☆".repeat(5 - Math.round(product.ratingsAverage))}</span>
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
        </div>
      `;
      productContainer.insertAdjacentHTML("beforeend", productCard);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
fetchData();

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

async function fetchCategories() {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
    const data = await response.json();
    const categories = data.data;
    console.log("categories", categories);

    const categoriesScrollContainer =
      document.querySelector(".scroll-container");
    categoriesScrollContainer.innerHTML = "";

    categories.forEach((category) => {
      const scrollItem = `
        <div class="category-wrapper">
          <div class="category-card">
            <img src="${category.image}" alt="${category.slug}">
            <p class="mt-3">${category.name}</p>
          </div>
        </div>
      `;
      categoriesScrollContainer.insertAdjacentHTML("beforeend", scrollItem);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
fetchCategories();

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

function updateClock() {
  const now = new Date();
  const days = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0"
  );
}
updateClock();
setInterval(updateClock, 1000);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.scrollToTop = scrollToTop; // Expose the function to the global scope
const categoryScrollContainer = document.getElementById("category-scroll");

function scrollLeftFunc() {
  categoryScrollContainer.scrollBy({ left: -300, behavior: "smooth" });
}
window.scrollLeftFunc = scrollLeftFunc; // Expose the function to the global scope
function scrollRightFunc() {
  categoryScrollContainer.scrollBy({ left: 300, behavior: "smooth" });
}
window.scrollRightFunc = scrollRightFunc; // Expose the function to the global scope
