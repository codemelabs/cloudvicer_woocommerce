import { API_DOMAIN, API_URLS } from "./config.js";

fetch(API_URLS.categoriesWithSubcategories)
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "success") {
      const categories = data.data;
      const categoryList = document.getElementById("categoryList");

      const allLi = document.createElement("li");
      const allA = document.createElement("a");
      allA.href = "shop.html";
      allA.textContent = "All";
      allA.className =
        "head-catogery hover:text-codeme-red transition flex items-center gap-1";
      allLi.appendChild(allA);
      categoryList.appendChild(allLi);

      const visibleCategories = categories.slice(0, 10);

      visibleCategories.forEach((category) => {
        const li = document.createElement("li");
        li.className = "relative";

        const a = document.createElement("a");
        a.href = `shop.html?category=${category.id}`;
        a.className =
          "head-catogery hover:text-codeme-red transition flex items-center gap-1";

        const textSpan = document.createElement("span");
        textSpan.textContent = category.name;
        a.appendChild(textSpan);

        if (category.subcategories && category.subcategories.length > 0) {
          const arrow = document.createElement("svg");
          arrow.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          `;
          a.appendChild(arrow.firstElementChild);
        }

        li.appendChild(a);

        if (category.subcategories && category.subcategories.length > 0) {
          const subUl = document.createElement("ul");
          subUl.className =
            "fixed opacity-0 invisible bg-codeme-red border border-codeme-red  z-50 min-w-[200px] transition-opacity duration-300";
          subUl.style.marginTop = "10px";

          category.subcategories.forEach((sub) => {
            const subLi = document.createElement("li");
            const subA = document.createElement("a");
            subA.href = `shop.html?subcategory=${sub.id}`;
            subA.textContent = sub.name;
            subA.className =
              "block px-4 py-2 text-white hover:bg-red transition text-[12px]";

            subLi.appendChild(subA);
            subUl.appendChild(subLi);
          });

          let hideTimeout;

          li.addEventListener("mouseenter", () => {
            clearTimeout(hideTimeout);
            subUl.classList.remove("invisible", "opacity-0");
            subUl.classList.add("opacity-100");
            const arrow = a.querySelector("svg");
            if (arrow) arrow.style.transform = "rotate(180deg)";
          });

          li.addEventListener("mouseleave", () => {
            hideTimeout = setTimeout(() => {
              subUl.classList.add("opacity-0");
              subUl.classList.add("invisible");
              const arrow = a.querySelector("svg");
              if (arrow) arrow.style.transform = "rotate(0deg)";
            }, 200);
          });

          li.appendChild(subUl);
        }

        categoryList.appendChild(li);
      });

      if (categories.length > 10) {
        const remainingCount = categories.length - 10;
        const li = document.createElement("li");
        li.textContent = `+${remainingCount}`;
        li.className = "red-tx";
        categoryList.appendChild(li);
      }
    }
  })
  .catch((err) => console.error("Error fetching categories:", err));

// cat nav hide
const header = document.getElementById("site-header");
let lastScrollY = window.scrollY;
const threshold = 20;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY - lastScrollY > threshold && currentScrollY > 50) {
    header.style.maxHeight = "70px";
  } else if (lastScrollY - currentScrollY > threshold || currentScrollY <= 50) {
    header.style.maxHeight = "150px";
  }

  lastScrollY = currentScrollY;
});

// login managemant
const authArea = document.getElementById("auth-area");
const token = localStorage.getItem("member_token");
const name = localStorage.getItem("member_name");

function logout() {
  localStorage.clear();
  location.reload();
}

if (token && name) {
  authArea.innerHTML = `
    <div class="relative">
      <button id="userBtn" class="flex flex-col items-center text-gray-700 hover:text-codeme-red transition">
        <div class="w-7 h-7 rounded-full bg-codeme-red flex items-center justify-center text-white font-bold">
          ${name.charAt(0).toUpperCase()}
        </div>
        <span class="text-[11px] mt-1 hidden sm:block">${name}</span>
      </button>

      <div id="userMenu" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-50">
        <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg">
          Logout
        </button>
      </div>
    </div>
  `;

  const userBtn = document.getElementById("userBtn");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  userBtn.addEventListener("click", () => {
    userMenu.classList.toggle("hidden");
  });

  logoutBtn.addEventListener("click", logout);
} else {
  authArea.innerHTML = `
    <a href="login.html" class="flex flex-col items-center text-gray-600 hover:text-codeme-red transition">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"/>
      </svg>
       <button id="userBtn" class="hidden"></button>
      <span class="text-[11px] mt-1 hidden sm:block">Log in</span>
    </a>
  `;
}
userBtn.addEventListener("click", () => {
  userMenu.classList.toggle("hidden");
  userMenu.classList.toggle("show");
});

//  search file
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("product-search-input");
  const resultsContainer = document.getElementById("search-results");
  const overlay = document.getElementById("search-overlay");

  if (!input || !resultsContainer) return;

  let debounceTimeout;

  function debounce(func, delay) {
    return function (...args) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const fetchSuggestions = debounce(async () => {
    const query = input.value.trim();

    if (!query) {
      resultsContainer.classList.add("hidden");
      overlay.classList.add("hidden");
      resultsContainer.innerHTML = "";
      return;
    }

    positionSearchResults();
    overlay.classList.remove("hidden");

    try {
      const response = await fetch(
        `${API_URLS.serach_products}${encodeURIComponent(query)}`
      );
      const products = await response.json();

      if (!products.length) {
        resultsContainer.innerHTML = `
          <div class="p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 font-medium">No products found</p>
            <p class="text-gray-400 text-sm mt-1">Try different keywords</p>
          </div>`;
      } else {
        resultsContainer.innerHTML = products
          .map((product) => {
            const price =
              product.selling_price > 0
                ? `Rs. ${parseFloat(product.selling_price).toFixed(2)}`
                : "Price N/A";

            const hasDiscount =
              parseFloat(product.selling_price) < parseFloat(product.mrp);
            const mrp = parseFloat(product.mrp).toFixed(2);
            

            const imgSrc = product.imgpath
              ? `${API_DOMAIN}${product.imgpath}`
              : "assets/img/placeholders/no-imge.svg";
            return `
              <a href="/product.html?id=${product.id}" 
                 class="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                
                <!-- Product Image -->
                <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src="${imgSrc}" 
                    alt="${product.name}"
                    class="w-full h-full object-cover"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%239CA3AF\"%3E%3Cpath stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\" /%3E%3C/svg%3E'"
                  />
                </div>
                
                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <!-- Product Name -->
                  <h3 class="text-gray-900 text-base font-normal mb-1 line-clamp-2">
                    ${product.name}
                  </h3>
                  
                  <!-- Price Section -->
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-red-600 font-medium">${price}</span>
                    
                    ${
                      hasDiscount
                        ? `
                      <span class="text-gray-400 text-sm line-through">Rs. ${mrp}</span>
                      <span class="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded font-medium">
                        Save Rs. ${(
                          parseFloat(product.mrp) -
                          parseFloat(product.selling_price)
                        ).toFixed(2)}
                      </span>
                    `
                        : ""
                    }
                  </div>
                  
                  <!-- Stock & Unit Info -->
                  <div class="flex items-center gap-3 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      ${product.total_stock} ${product.unit_name}
                    </span>
                    
                    <span class="inline-flex items-center ${
                      parseFloat(product.total_stock) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${
                          parseFloat(product.total_stock) > 0
                            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
                            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
                        }
                      </svg>
                      ${
                        parseFloat(product.total_stock) > 0
                          ? "In Stock"
                          : "Out of Stock"
                      }
                    </span>
                  </div>
                </div>
                
                <!-- View Arrow -->
                <div class="flex-shrink-0 text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            `;
          })
          .join("");
      }

      resultsContainer.classList.remove("hidden");
    } catch (err) {
      console.error("Search error:", err);
      resultsContainer.innerHTML = `
        <div class="p-6 text-center">
          <svg class="w-12 h-12 mx-auto text-red-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p class="text-red-500 font-medium">Connection Error</p>
          <p class="text-gray-500 text-sm mt-1">Please check your connection</p>
        </div>`;
      resultsContainer.classList.remove("hidden");
    }
  }, 300);

  input.addEventListener("input", fetchSuggestions);

  overlay.addEventListener("click", () => {
    resultsContainer.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add("hidden");
      overlay.classList.add("hidden");
    }
  });

  function positionSearchResults() {
    const rect = input.getBoundingClientRect();
    resultsContainer.style.width = rect.width + "px";
    resultsContainer.style.left = rect.left + "px";
    resultsContainer.style.top = rect.bottom + 8 + "px";
  }

  window.addEventListener("resize", positionSearchResults);
  window.addEventListener("scroll", positionSearchResults);
  input.addEventListener("focus", positionSearchResults);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !resultsContainer.classList.contains("hidden")) {
      resultsContainer.classList.add("hidden");
      overlay.classList.add("hidden");
    }
  });
});