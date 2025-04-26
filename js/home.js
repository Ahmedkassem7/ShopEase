const user = localStorage.getItem("user");
console.log("userHomre", user);
if (!user) {
  window.location.href = "/pages/login.html";
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/pages/login.html";
    }
  }
});
window.addEventListener("focus", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "/pages/login.html";
  }
});

const toggleBtn = document.getElementById("toggleBtn");
const navbarContent = document.getElementById("navbarContent");

toggleBtn.addEventListener("click", () => {
  navbarContent.classList.toggle("show");
});

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const counter = document.getElementById("slideCounter");
  const dotContainer = document.getElementById("carouselDots");
  let currentSlide = 0;

  // Generate dots
  slides.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(idx));
    dotContainer.appendChild(dot);
  });

  const updateCounter = () => {
    counter.textContent = `${(currentSlide + 1)
      .toString()
      .padStart(2, "0")}/${slides.length.toString().padStart(2, "0")}`;
  };

  const updateDots = () => {
    document.querySelectorAll(".dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentSlide);
    });
  };

  const goToSlide = (index) => {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === index);
    });
    currentSlide = index;
    updateCounter();
    updateDots();
  };

  setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, 2000);
});

async function fetchData() {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/products?brand=64089d9e24b25627a25315a5&limit=4"
  );

  const data = await response.json();
  // const products = data.products;
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
}
fetchData();
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("buy-now")) {
    e.preventDefault();
    e.stopPropagation();

    const productId = e.target.dataset.id;
    console.log("productId", productId);

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${productId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const productData = data.data;
      console.log("productData", productData);

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
      let updatedCart = [];
      try {
        const res = await fetch(`http://localhost:3000/users/${userId}`);
        if (!res.ok) {
          console.error("Fetching user failed");
          throw new Error("Fetching user failed");
        }

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

      try {
        await fetch(`http://localhost:3000/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: updatedCart }),
        });
      } catch (error) {
        console.error("Error updating cart:", error);
      }

      const toast = document.getElementById("toast");
      if (toast) {
        toast.classList.add("show");

        setTimeout(() => {
          toast.classList.remove("show");
        }, 4000);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      // alert("There was a problem adding the product. Please try again.");
    }
  }
});

async function fetchCategoris() {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories"
  );
  const data = await response.json();
  // const products = data.products;
  const categories = data.data;
  console.log("categories", categories);
  const scrollContainer = document.querySelector(".scroll-container");
  scrollContainer.innerHTML = "";
  // <i class="bi bi-phone category-icon"></i>
  categories.forEach((categorie) => {
    const scrollItem = `
   <div class="category-wrapper">
        <div class="category-card">
          <img src=${categorie.image} alt=${categorie.slug}>
          <p class="mt-3">${categorie.name}</p>
        </div>
      </div>
  `;
    scrollContainer.insertAdjacentHTML("beforeend", scrollItem);
  });
}
fetchCategoris();
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-product")) {
    const productId = e.target.dataset.id;
    window.location.href = `/pages/productPage.html?id=${productId}`;
  }
});

const targetDate = new Date();
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
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
const scrollContainer = document.getElementById("category-scroll");
function scrollLeftFunc() {
  scrollContainer.scrollBy({
    left: -300,
    behavior: "smooth",
  });
}

function scrollRightFunc() {
  scrollContainer.scrollBy({
    left: 300,
    behavior: "smooth",
  });
}
