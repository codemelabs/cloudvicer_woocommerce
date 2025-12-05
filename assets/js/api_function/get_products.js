// const API_URL = "http://localhost:8087/api/product/geo";
import { API_DOMAIN, API_URLS } from "../config.js";
const productGrid = document.getElementById("productGrid");
const paginationEl = document.getElementById("pagination");

window.currentPage = 1;

function loadProducts(filters = {}, page = 1) {
  filters.page = page;
  const params = new URLSearchParams(filters).toString();
  console.log(params, "vanthuddaan");

  fetch(`${API_URLS.load_products}?${params}`)
    .then((res) => res.json())
    .then((res) => {
      renderProducts(res.data);
      renderPagination(res);
    });
}

function renderProducts(products) {
  productGrid.innerHTML = "";

  if (!products.length) {
    productGrid.innerHTML = `<p class="text-gray-500">No products found</p>`;
    return;
  }

  products.forEach((product) => {
    let mrpHTML = "";
    if (Number(product.mrp) !== Number(product.selling_price)) {
      mrpHTML = `<span class="text-gray-400 text-sm line-through">Rs ${product.mrp}</span>`;
    }

    productGrid.innerHTML += `
      <div class="bg-white rounded-[15px] p-0 md:p-4 hover:shadow-md transition-shadow md:border-0">
        <a href="product.html?id=${product.id}">
          <div class="aspect-square bg-gray-200 rounded-md mb-4 overflow-hidden">
            <img src="${API_DOMAIN}${product.imgpath}" class="object-cover w-full h-full hover:scale-105 transition-transform">
          </div>

          <h3 class="font-medium text-gray-900 mb-1">${product.name}</h3>

          <div class="flex items-center gap-2 mb-1">
            <span class="text-codeme-red font-bold">Rs ${product.selling_price}</span>
            ${mrpHTML}
          </div>

         
        </a>

        <button
          class="w-full mt-3 border border-codeme-red font-medium py-2 rounded-[15px] bg-codeme-red text-white"
          onclick="addToCart(${product.id})">
          Add to cart
        </button>
      </div>
    `;
  });
}

function renderPagination(res) {
  paginationEl.innerHTML = "";

  const container = document.createElement("div");
  container.className =
    "flex items-center justify-center space-x-1 sm:space-x-2";
  paginationEl.appendChild(container);

  if (res.current_page > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <span class="sr-only">Previous</span>
    `;
    prevBtn.className = `
      flex items-center justify-center
      w-10 h-10
      border border-gray-300 rounded-full
      hover:bg-gray-50 hover:border-gray-400
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-codeme-red/50
      ${res.current_page === 1 ? "opacity-50 cursor-not-allowed" : ""}
    `;

    prevBtn.addEventListener("click", () => {
      if (res.current_page > 1) {
        changePage(res.current_page - 1);
      }
    });

    container.appendChild(prevBtn);
  }

  const createPageButton = (pageNum, isCurrent = false, isEllipsis = false) => {
    const btn = document.createElement("button");

    if (isEllipsis) {
      btn.textContent = "...";
      btn.className = `
        w-10 h-10
        flex items-center justify-center
        text-gray-500
        cursor-default
      `;
      btn.disabled = true;
    } else {
      btn.textContent = pageNum;
      btn.className = `
        w-10 h-10
        border rounded-full
        transition-all duration-200
        flex items-center justify-center
        font-medium
        ${
          isCurrent
            ? "bg-codeme-red text-white border-codeme-red shadow-sm"
            : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-codeme-red/50
      `;

      btn.addEventListener("click", () => {
        changePage(pageNum);
      });
    }

    return btn;
  };

  const maxVisiblePages = 5;
  let startPage, endPage;

  if (res.last_page <= maxVisiblePages) {
    startPage = 1;
    endPage = res.last_page;
  } else {
    const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
    const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

    if (res.current_page <= maxPagesBeforeCurrent) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (res.current_page + maxPagesAfterCurrent >= res.last_page) {
      startPage = res.last_page - maxVisiblePages + 1;
      endPage = res.last_page;
    } else {
      startPage = res.current_page - maxPagesBeforeCurrent;
      endPage = res.current_page + maxPagesAfterCurrent;
    }
  }

  if (startPage > 1) {
    container.appendChild(createPageButton(1));
    if (startPage > 2) {
      container.appendChild(createPageButton(null, false, true));
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    container.appendChild(createPageButton(i, i === res.current_page));
  }

  if (endPage < res.last_page) {
    if (endPage < res.last_page - 1) {
      container.appendChild(createPageButton(null, false, true));
    }
    container.appendChild(createPageButton(res.last_page));
  }

  if (res.current_page < res.last_page) {
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
      <span class="sr-only">Next</span>
    `;
    nextBtn.className = `
      flex items-center justify-center
      w-10 h-10
      border border-gray-300 rounded-full
      hover:bg-gray-50 hover:border-gray-400
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-codeme-red/50
      ${
        res.current_page === res.last_page
          ? "opacity-50 cursor-not-allowed"
          : ""
      }
    `;

    nextBtn.addEventListener("click", () => {
      if (res.current_page < res.last_page) {
        changePage(res.current_page + 1);
      }
    });

    container.appendChild(nextBtn);
  }

  const pageInfo = document.createElement("div");
  pageInfo.className = "mt-4 text-center text-sm text-gray-600";
  pageInfo.textContent = `Page ${res.current_page} of ${res.last_page}`;
  paginationEl.appendChild(pageInfo);
}

function changePage(page) {
  currentPage = page;
  applyFilters();
}

window.applyFilters = function applyFilters() {
  //   window.currentPage = 1;

  const params = {};
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("category")) {
    params.category = urlParams.get("category");
  }

  if (urlParams.get("subcategory")) {
    params.subcategory = urlParams.get("subcategory");
  }

  const isMobile = window.innerWidth < 1024;

  const minPrice = isMobile
    ? document.getElementById("mobile-minPrice")?.value
    : document.getElementById("minPrice")?.value;

  const maxPrice = isMobile
    ? document.getElementById("mobile-maxPrice")?.value
    : document.getElementById("maxPrice")?.value;

  if (minPrice) params.min_price = minPrice;
  if (maxPrice) params.max_price = maxPrice;

  const inStock = isMobile
    ? document.getElementById("mobile-in-stock")?.checked
    : document.getElementById("in-stock")?.checked;

  const outStock = isMobile
    ? document.getElementById("mobile-out-of-stock")?.checked
    : false;

  if (inStock) params.in_stock = 1;
  if (outStock) params.out_of_stock = 1;

  const sort = document.getElementById("sortSelect")?.value;
  if (sort) params.sort_by = sort;

  //   console.log("✅ FILTER PARAMS:", params);

  loadProducts(params, window.currentPage);
};

document
  .getElementById("minPrice")
  ?.addEventListener("input", window.applyFilters);
document
  .getElementById("maxPrice")
  ?.addEventListener("input", window.applyFilters);
document
  .getElementById("in-stock")
  ?.addEventListener("change", window.applyFilters);
document
  .getElementById("sortSelect")
  ?.addEventListener("change", window.applyFilters);

document
  .getElementById("mobile-apply-filters")
  ?.addEventListener("click", () => {
    document.getElementById("mobile-filter-sidebar").classList.remove("open");

    document.getElementById("mobile-filter-overlay").classList.remove("active");

    window.applyFilters();
  });

// loadProducts({}, 1);

window.addEventListener("load", () => {
  const params = {};
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("category")) {
    params.category = urlParams.get("category");
  }

  if (urlParams.get("subcategory")) {
    params.subcategory = urlParams.get("subcategory");
  }
  loadProducts(params, 1);
});
