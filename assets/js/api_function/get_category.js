import { API_DOMAIN, API_URLS } from "../config.js";

document.addEventListener("click", function (e) {
  const categoryBtn = e.target.closest("[data-category-id]");
  const subBtn = e.target.closest("[data-sub-id]");
  const resetBtn = e.target.closest("[data-reset='true']");
  const toggleBtn = e.target.closest("[data-toggle]");

  if (resetBtn) {
    e.preventDefault();
    history.pushState({}, "", "shop.html");
    window.currentPage = 1;
    window.applyFilters();
  }

  if (categoryBtn) {
    e.preventDefault();

    const catId = categoryBtn.dataset.categoryId;
    const url = new URL(window.location.href);

    url.searchParams.set("category", catId);
    url.searchParams.delete("subcategory");

    history.pushState({}, "", url.toString());
    window.currentPage = 1;

    window.applyFilters();

    // SYNC TOP MOBILE BUTTONS
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("bg-codeme-red", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-700");
    });

    const activeTopBtn = document.querySelector(
      `.category-btn[data-id="${catId}"]`
    );

    if (activeTopBtn) {
      activeTopBtn.classList.remove("bg-gray-100", "text-gray-700");
      activeTopBtn.classList.add("bg-codeme-red", "text-white");
    }
  }

  if (subBtn) {
    e.preventDefault();

    const subId = subBtn.dataset.subId;
    const url = new URL(window.location.href);

    url.searchParams.set("subcategory", subId);

    history.pushState({}, "", url.toString());
    window.currentPage = 1;

    window.applyFilters();
  }

  //
  if (toggleBtn) {
    const id = toggleBtn.dataset.toggle;
    const view = toggleBtn.dataset.view;
    const subEl = document.getElementById(`${view}-sub-${id}`);

    if (expandedCategories.has(id)) {
      expandedCategories.delete(id);
      smoothToggle(subEl);
    } else {
      expandedCategories.add(id);
      smoothToggle(subEl);
    }

    renderCategories();
  }
});

let allCategories = [];
let isExpanded = false;
const LIMIT = 8;
let expandedCategories = new Set();

function smoothToggle(el) {
  if (el.style.maxHeight && el.style.maxHeight !== "0px") {
    el.style.maxHeight = el.scrollHeight + "px";
    requestAnimationFrame(() => {
      el.style.maxHeight = "0px";
    });
  } else {
    el.style.maxHeight = el.scrollHeight + "px";
  }
}

fetch(API_URLS.get_category)
  .then((res) => res.json())
  .then((res) => {
    if (res.status !== "success") return;
    allCategories = res.data;
    renderCategories();
  });

function renderCategories() {
  const desktopList = document.getElementById("desktopCategoryList");
  const mobileList = document.getElementById("mobileCategoryList");

  desktopList.innerHTML = "";
  mobileList.innerHTML = "";

  const params = new URLSearchParams(window.location.search);
  const activeCategory = params.get("category");
  const activeSub = params.get("subcategory");

  if (activeSub) {
    const parentCategory = allCategories.find((cat) =>
      cat.subcategories.some((sub) => sub.id == activeSub)
    );
    if (parentCategory) {
      expandedCategories.add(parentCategory.id);
    }
  }

  const allItem = `
    <li class="mb-1 pb-1 border-b border-gray-100">
      <a href="#"
         data-reset="true"
         class="group flex items-center font-medium ${
           !activeCategory && !activeSub ? "text-codeme-red" : "text-gray-700"
         } hover:text-codeme-red transition-colors duration-200">
        <div class="flex items-center justify-center w-7 h-7 mr-3 bg-gray-100 rounded-full group-hover:bg-codeme-red/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <span class="flex-1">All Products</span>
        ${
          !activeCategory && !activeSub
            ? `<div class="h-6 w-1 bg-codeme-red rounded-full mr-2"></div>`
            : ""
        }
      </a>
    </li>`;

  desktopList.insertAdjacentHTML("beforeend", allItem);
  mobileList.insertAdjacentHTML("beforeend", allItem);

  const visibleCategories = isExpanded
    ? allCategories
    : allCategories.slice(0, LIMIT);

  visibleCategories.forEach((category, index) => {
    const hasSubs = category.subcategories.length > 0;
    const isActiveCat = activeCategory == category.id;
    const isExpandedCat = expandedCategories.has(category.id);
    const subCount = category.subcategories.length;

    const desktopHTML = `
      <li class="mb-3 ${hasSubs ? "pb-1" : "pb-1"} ${
      index < visibleCategories.length - 1 ? "border-b border-gray-100" : ""
    }">
        <div class="flex justify-between items-center">
          <a href="#"
             data-category-id="${category.id}"
             class="group flex items-center flex-1 font-medium ${
               isActiveCat ? "text-codeme-red" : "text-gray-700"
             } hover:text-codeme-red transition-colors duration-200">
            <div class="flex items-center justify-center w-7 h-7 mr-3 ${
              isActiveCat
                ? "bg-codeme-red text-white"
                : "bg-gray-100 text-gray-600"
            } rounded-full group-hover:bg-codeme-red group-hover:text-white transition-colors">
              <span class="text-sm font-semibold">${index + 1}</span>
            </div>
            <div class="flex-1 flex items-center justify-between">
              <span>${category.name}</span>
              ${
                subCount > 0
                  ? `<span class="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">${subCount}</span>`
                  : ""
              }
            </div>
          </a>

          ${
            hasSubs
              ? `<button type="button" 
                  data-toggle="${category.id}" 
                  data-view="desktop"
                  class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-codeme-red hover:bg-codeme-red/5 rounded-full transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       class="w-4 h-4 transition-transform duration-300 ${
                         isExpandedCat ? "rotate-180" : ""
                       }" 
                       viewBox="0 0 20 20" 
                       fill="currentColor">
                    <path fill-rule="evenodd" 
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                          clip-rule="evenodd" />
                  </svg>
                </button>`
              : ""
          }
        </div>

        ${
          isActiveCat && hasSubs
            ? '<div class="ml-10 h-px w-16 bg-codeme-red/30 my-2"></div>'
            : ""
        }

        ${
          hasSubs
            ? `
          <ul id="desktop-sub-${category.id}" 
              class="sub-animate ml-10 mt-1 space-y-2.5 ${
                isExpandedCat ? "pb-1" : ""
              }"
              style="max-height: ${
                isExpandedCat ? "none" : "0px"
              }; overflow: hidden; transition: max-height 0.3s ease;">
            ${category.subcategories
              .map((sub, subIndex) => {
                const isActiveSub = activeSub == sub.id;
                return `
                <li class="relative">
                  <a href="#"
                     data-sub-id="${sub.id}"
                     class="group/sub flex items-center text-sm ${
                       isActiveSub
                         ? "text-codeme-red font-medium"
                         : "text-gray-600"
                     } hover:text-codeme-red transition-colors duration-200">
                    <div class="w-6 flex items-center justify-center mr-2">
                      ${
                        isActiveSub
                          ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                               <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                             </svg>`
                          : `<div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/sub:bg-codeme-red/50"></div>`
                      }
                    </div>
                    <span>${sub.name}</span>
                    ${
                      isActiveSub
                        ? '<div class="ml-auto h-5 w-0.5 bg-codeme-red rounded-full"></div>'
                        : ""
                    }
                  </a>
                </li>`;
              })
              .join("")}
          </ul>`
            : ""
        }
      </li>`;

    desktopList.insertAdjacentHTML("beforeend", desktopHTML);
    mobileList.insertAdjacentHTML(
      "beforeend",
      desktopHTML.replaceAll("desktop", "mobile")
    );
  });

  if (allCategories.length > LIMIT) {
    const btnText = isExpanded
      ? "Show Less"
      : `Show More (${allCategories.length - LIMIT})`;
    const moreBtnHTML = `
      <li class="mt-4 pt-3 border-t border-gray-100">
        <button id="toggleMoreBtn"
          class="group flex items-center justify-center w-full text-codeme-red text-sm font-semibold hover:text-codeme-red/80 transition-colors">
          <span>${btnText}</span>
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="w-4 h-4 ml-1.5 transition-transform duration-300 ${
                 isExpanded ? "rotate-180" : ""
               }" 
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fill-rule="evenodd" 
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                  clip-rule="evenodd" />
          </svg>
        </button>
      </li>`;
    desktopList.insertAdjacentHTML("beforeend", moreBtnHTML);
    mobileList.insertAdjacentHTML("beforeend", moreBtnHTML);
  }
}

document.addEventListener("click", function (e) {
  const cat = e.target.closest("a[data-category-id]");
  if (cat) {
    e.preventDefault();

    const id = cat.dataset.categoryId;
    const params = new URLSearchParams(window.location.search);
    const currentSub = params.get("subcategory");

    if (currentSub) {
      const parentOfCurrentSub = allCategories.find((cat) =>
        cat.subcategories.some((sub) => sub.id == currentSub)
      );
      if (parentOfCurrentSub && parentOfCurrentSub.id != id) {
        expandedCategories.delete(parentOfCurrentSub.id);
      }
    }

    history.pushState({}, "", `?category=${id}`);

    renderCategories();
    // loadProductsByCategory(id);
  }

  const sub = e.target.closest("a[data-sub-id]");
  if (sub) {
    e.preventDefault();

    const id = sub.dataset.subId;
    history.pushState({}, "", `?subcategory=${id}`);

    renderCategories();
    // loadProductsBySubcategory(id);
  }

  const reset = e.target.closest("a[data-reset]");
  if (reset) {
    e.preventDefault();

    history.pushState({}, "", `shop.html`);
    expandedCategories.clear();

    renderCategories();
    // loadAllProducts();
  }

  const toggle =
    e.target.closest("button[data-toggle]") ||
    e.target.closest("svg")?.parentElement;
  if (toggle && toggle.dataset.toggle) {
    const id = toggle.dataset.toggle;
    const view = toggle.dataset.view;
    const el = document.getElementById(`${view}-sub-${id}`);

    if (el) {
      if (expandedCategories.has(parseInt(id))) {
        expandedCategories.delete(parseInt(id));
      } else {
        expandedCategories.add(parseInt(id));
      }

      smoothToggle(el);
      renderCategories();
    }
  }

  if (e.target.id === "toggleMoreBtn" || e.target.closest("#toggleMoreBtn")) {
    isExpanded = !isExpanded;
    renderCategories();
  }
});

// function loadProductsByCategory(categoryId) {
//   // console.log("Load products by CATEGORY:", categoryId);
// }

// function loadProductsBySubcategory(subId) {
//   // console.log("Load products by SUBCATEGORY:", subId);
// }

// function loadAllProducts() {
//   // console.log("Load ALL products");
// }
