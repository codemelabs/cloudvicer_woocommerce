import { API_DOMAIN, API_URLS } from "./config.js";

const mobileCategoryDropdown = document.querySelector(
  ".mobile-category-dropdown"
);

const mobileFilterToggle = document.getElementById("mobile-filter-toggle");
const mobileFilterClose = document.getElementById("mobile-filter-close");
const mobileFilterOverlay = document.getElementById("mobile-filter-overlay");
const mobileFilterSidebar = document.getElementById("mobile-filter-sidebar");
const mobileApplyFilters = document.getElementById("mobile-apply-filters");

function openMobileFilters() {
  mobileFilterOverlay.classList.add("active");
  mobileFilterSidebar.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileFilters() {
  mobileFilterOverlay.classList.remove("active");
  mobileFilterSidebar.classList.remove("active");
  document.body.style.overflow = "";
}

if (mobileFilterToggle) {
  mobileFilterToggle.addEventListener("click", openMobileFilters);
}

if (mobileFilterClose) {
  mobileFilterClose.addEventListener("click", closeMobileFilters);
}

if (mobileFilterOverlay) {
  mobileFilterOverlay.addEventListener("click", closeMobileFilters);
}

if (mobileApplyFilters) {
  mobileApplyFilters.addEventListener("click", closeMobileFilters);
}

// function addToCart() {
//   const cartCount = document.getElementById("cart-count");
//   if (cartCount) {
//     let count = parseInt(cartCount.textContent);
//     cartCount.textContent = count + 1;

//     cartCount.classList.add("animate-ping");
//     setTimeout(() => {
//       cartCount.classList.remove("animate-ping");
//     }, 500);
//   }
// }

// let currentSlide = 0;
// const slides = document.querySelectorAll("#slider > div");
// const dots = document.querySelectorAll(".dot");

// function showSlide(n) {
//   slides.forEach((slide, index) => {
//     slide.style.transform = `translateX(-${n * 100}%)`;
//   });

//   dots.forEach((dot, index) => {
//     dot.classList.toggle("opacity-100", index === n);
//     dot.classList.toggle("opacity-50", index !== n);
//   });

//   currentSlide = n;
// }

// if (slides.length > 0) {
//   dots.forEach((dot, index) => {
//     dot.addEventListener("click", () => showSlide(index));
//   });

//   setInterval(() => {
//     let nextSlide = (currentSlide + 1) % slides.length;
//     showSlide(nextSlide);
//   }, 5000);
// }

// head shadow
const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.classList.add("shadow-md");
  } else {
    header.classList.remove("shadow-md");
  }
});
// end

// search
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("mobile-search-input");
  const resultsContainer = document.getElementById("mobile-search-results");
  const overlay = document.getElementById("mobile-search-overlay");

  if (!input || !resultsContainer || !overlay) return;

  let debounceTimeout;

  function debounce(func, delay) {
    return function (...args) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function positionMobileResults() {
    const rect = input.getBoundingClientRect();
    resultsContainer.style.top = rect.bottom + 10 + "px";
    resultsContainer.style.left = "10px";
    resultsContainer.style.right = "10px";
  }

  const fetchMobileSuggestions = debounce(async () => {
    const query = input.value.trim();

    if (!query) {
      resultsContainer.classList.add("hidden");
      overlay.classList.add("hidden");
      resultsContainer.innerHTML = "";
      return;
    }

    positionMobileResults();
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
                    onerror="this.src='/img/placeholder-product.jpg'"
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

  input.addEventListener("input", fetchMobileSuggestions);

  overlay.addEventListener("click", () => {
    resultsContainer.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !resultsContainer.classList.contains("hidden")) {
      resultsContainer.classList.add("hidden");
      overlay.classList.add("hidden");
    }
  });
});


/// mobile cate
const categoryContainer = document.getElementById("mobileCategoryScroll");

function renderMobileCategories(categories) {
  categoryContainer.innerHTML = "";

  categoryContainer.innerHTML += `
    <a href="#"
      class="category-btn active flex-shrink-0 bg-codeme-red text-white px-4 py-2 rounded-full text-sm font-medium mr-2"
      data-id="all">
      All
    </a>
  `;

  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <a href="#"
        class="category-btn flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mr-2"
        data-id="${cat.id}">
        ${cat.name}
      </a>
    `;
  });
}

// mobile top buttons
fetch(API_URLS.featuredCategories)
  .then((res) => res.json())
  .then((data) => {
    if (data.status === "success") {
      renderMobileCategories(data.data);
    }
  })
  .catch((err) => console.error("Category API Error:", err));

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("category-btn")) {
    e.preventDefault();

    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("bg-codeme-red", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-700");
    });

    e.target.classList.remove("bg-gray-100", "text-gray-700");
    e.target.classList.add("bg-codeme-red", "text-white");

    const categoryId = e.target.dataset.id;
    const url = new URL(window.location.href);

    if (categoryId === "all") {
      url.search = ""; 
    } else {
      url.searchParams.set("category", categoryId);
      url.searchParams.delete("subcategory");
    }

    history.pushState({}, "", url.toString());
    window.currentPage = 1;
    window.applyFilters();

    const mobileList = document.getElementById("mobileCategoryList");

    mobileList.querySelectorAll("[data-category-id]").forEach((cat) => {
      cat.classList.remove("text-codeme-red");
      cat.classList.add("text-gray-700");

      const circle = cat.querySelector("div.w-7");
      if (circle) {
        circle.classList.remove("bg-codeme-red", "text-white");
        circle.classList.add("bg-gray-100", "text-gray-600");
      }
    });

    const resetBtn = mobileList.querySelector("[data-reset]");
    if (resetBtn) {
      resetBtn.classList.remove("text-codeme-red");
      resetBtn.classList.add("text-gray-700");
    }

    if (categoryId === "all") {
      if (resetBtn) {
        resetBtn.classList.remove("text-gray-700");
        resetBtn.classList.add("text-codeme-red");
      }
    } else {
      const activeMobileCat = mobileList.querySelector(
        `[data-category-id="${categoryId}"]`
      );

      if (activeMobileCat) {
        activeMobileCat.classList.remove("text-gray-700");
        activeMobileCat.classList.add("text-codeme-red");

        const circle = activeMobileCat.querySelector("div.w-7");
        if (circle) {
          circle.classList.remove("bg-gray-100", "text-gray-600");
          circle.classList.add("bg-codeme-red", "text-white");
        }
      }
    }
  }
});
