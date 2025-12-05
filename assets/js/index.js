import { API_DOMAIN, API_URLS } from "./config.js";

fetch(API_URLS.featuredCategories)
  .then((res) => res.json())
  .then((data) => {
    if (data.status === "success") {
      const grid = document.getElementById("featuredCategoriesGrid");

      data.data.forEach((category) => {
        const a = document.createElement("a");
        a.href = `shop.html?category=${category.id}`;
        a.className = "group block";

        const div = document.createElement("div");
        div.className =
          "rounded-lg lg:rounded-full aspect-square flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow bg-cover bg-center";
        div.style.backgroundImage = `url('${API_DOMAIN}${category.img_path}')`;

        const h3 = document.createElement("h3");
        h3.className =
          "font-medium text-gray-900 text-center group-hover:text-codeme-red";
        h3.textContent = category.name;

        a.appendChild(div);
        a.appendChild(h3);
        grid.appendChild(a);
      });
    }
  })
  .catch((err) => console.error("Error fetching featured categories:", err));

// add to card index
window.isUserLoggedIn = function () {
  const email = localStorage.getItem("member_email");
  const name = localStorage.getItem("member_name");
  const token = localStorage.getItem("member_token");
  return !!(email && name && token);
};

window.showLoginPopup = function () {
  const popup = document.createElement("div");
  popup.className = "login-popup-overlay";
  popup.innerHTML = `
    <div class="login-popup">
      <div class="login-popup-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-codeme-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="login-popup-title">Login Required</h2>
      <p class="login-popup-text">Please log in to add items to your cart and enjoy a personalized shopping experience.</p>
      <div class="login-popup-buttons">
        <button class="login-popup-btn login-popup-btn-secondary" onclick="closeLoginPopup()">Cancel</button>
        <button class="login-popup-btn login-popup-btn-primary" onclick="redirectToLogin()">Login</button>
      </div>
    </div>
  `;

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      window.closeLoginPopup();
    }
  });

  document.body.appendChild(popup);
};

window.closeLoginPopup = function () {
  const popup = document.querySelector(".login-popup-overlay");
  if (popup) {
    popup.style.animation = "fadeIn 0.3s ease reverse";
    setTimeout(() => popup.remove(), 300);
  }
};

window.redirectToLogin = function () {
  window.location.href = "login.html";
};

// window.addToCart = function (productId) {
//   if (!window.isUserLoggedIn()) {
//     window.showLoginPopup();
//     return;
//   }

//   // console.log("Adding product to cart:", productId);
//   // ... rest of cart logic
//   const btn = event.target;
//   if (btn) {
//     const originalText = btn.innerText;
//     btn.innerText = "Added!";
//     btn.classList.add("bg-green-600", "border-green-600", "text-white");

//     setTimeout(() => {
//       btn.innerText = originalText;
//       btn.classList.remove("bg-green-600", "border-green-600", "text-white");
//     }, 1500);
//   }
// };

fetch(API_URLS.current_deals)
  .then((res) => res.json())
  .then((res) => {
    if (res.status !== "success") return;
    const products = res.data;
    const container = document.getElementById("currentDealsContainer");
    products.forEach((p) => {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-[15px] shadow-sm p-4 hover:shadow-md transition-shadow";
      const showMrp = p.mrp && p.mrp !== p.selling_price;
      const isOutOfStock = parseFloat(p.total_stock) <= 0;
      card.innerHTML = `
        <a href="product.html?id=${p.id}">
          <div class="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
            <img src="${API_DOMAIN}${p.imgpath}" alt="${
        p.name
      }" class="object-cover w-full h-full hover:scale-105 transition-transform" />
          </div>
          <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">${p.name}</h3>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-codeme-red font-bold">$${p.selling_price}</span>
            ${
              showMrp
                ? `<span class="text-gray-400 text-sm line-through">$${p.mrp}</span>`
                : ""
            }
          </div>
          ${
            isOutOfStock
              ? `<p class="text-red-500 font-semibold mb-2 text-[11px]">Out of Stock</p>`
              : ""
          }
        </a>
        <button 
          class="w-full border border-codeme-red font-medium py-2 rounded-[15px] bg-codeme-red text-white relative overflow-hidden ${
            isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
          }" 
          onclick="${isOutOfStock ? "" : `addToCart(${p.id})`}"
          ${isOutOfStock ? "disabled" : ""}>
          Add to cart
          <span class="shine"></span>
        </button>
      `;
      container.appendChild(card);
    });
    // See More Deals card
    const seeMoreCard = document.createElement("div");
    seeMoreCard.className =
      "bg-white rounded-[15px] shadow-sm p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group";
    seeMoreCard.innerHTML = `
      <a href="shop.html" class="flex flex-col items-center justify-center h-full min-h-[300px]">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-codeme-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-2 text-center">See More Deals</h3>
        <p class="text-gray-500 text-center text-sm px-4">Discover amazing offers and exclusive discounts</p>
        <div class="mt-4 px-6 py-2 border-2 border-codeme-red rounded-full text-codeme-red font-semibold group-hover:bg-codeme-red group-hover:text-white transition-all duration-300">
          View All
        </div>
      </a>
    `;
    container.appendChild(seeMoreCard);
  })
  .catch((err) => console.error("Error fetching current deals:", err));
