import { API_DOMAIN, API_URLS } from "../config.js";

function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id") || 1;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function parsePrice(priceString) {
  return parseFloat(priceString) || 0;
}

function calculateDiscount(mrp, sellingPrice) {
  if (mrp > sellingPrice) {
    const discount = ((mrp - sellingPrice) / mrp) * 100;
    return Math.round(discount);
  }
  return 0;
}

async function loadProductData() {
  const productId = getProductId();
  try {
    const response = await fetch(
      `${API_URLS.set_product}${productId}`
    );
    if (!response.ok) throw new Error("Failed to fetch product data");

    const product = await response.json();
    updateProductDisplay(product);
  } catch (error) {
    console.error("Error loading product:", error);
    showErrorState();
  }
}

function updateProductDisplay(product) {
  const sellingPrice = parsePrice(product.selling_price);
  const mrp = parsePrice(product.mrp);
  const totalStock = parseFloat(product.total_stock) || 0;

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-title").textContent = product.name;
  document.getElementById("product-code").textContent = product.product_code;

  const categoryLink = document.getElementById("category-link");
  const productCategory = document.getElementById("product-category");
  if (product.category) {
    categoryLink.textContent = product.category;
    productCategory.textContent = product.category;
  }

  // Update image
  const productImage = document.getElementById("product-image");
  if (product.image) {
    productImage.src = API_DOMAIN+product.image;
    productImage.alt = product.name;
  }

  // Update prices
  document.getElementById("selling-price").textContent =
    formatCurrency(sellingPrice);

  // Update MRP and discount badge if there's a discount
  const mrpElement = document.getElementById("mrp-price");
  const discountBadge = document.getElementById("discount-badge");

  if (mrp > sellingPrice) {
    mrpElement.textContent = formatCurrency(mrp);
    mrpElement.classList.remove("hidden");

    const discountPercent = calculateDiscount(mrp, sellingPrice);
    const discountAmount = mrp - sellingPrice;
    discountBadge.textContent = `SAVE ${formatCurrency(
      discountAmount
    )} (${discountPercent}%)`;
    discountBadge.classList.remove("hidden");
  } else {
    mrpElement.classList.add("hidden");
    discountBadge.classList.add("hidden");
  }

  const stockElement = document.getElementById("total-stock");
  const unitSymbolElement = document.getElementById("unit-symbol");
  stockElement.textContent = totalStock.toFixed(2);

  if (product.unit_symbol) {
    unitSymbolElement.textContent = product.unit_symbol;
  } else if (product.unit_name) {
    unitSymbolElement.textContent = product.unit_name.toLowerCase();
  }

  const productUnitElement = document.getElementById("product-unit");
  if (product.unit_name && product.unit_symbol) {
    productUnitElement.textContent = `${product.unit_name} (${product.unit_symbol})`;
  } else if (product.unit_name) {
    productUnitElement.textContent = product.unit_name;
  } else if (product.unit_symbol) {
    productUnitElement.textContent = product.unit_symbol;
  }

  // Update description based on product
  const descriptionElement = document.getElementById("product-description");
  if (
    product.category === "Rice" ||
    product.name.toLowerCase().includes("rice")
  ) {
    descriptionElement.textContent =
      "Long-grain aromatic basmati rice, perfect for biryani and pilaf. Aged for 2 years to ensure the perfect texture and aroma. Sourced directly from the foothills of the Himalayas.";
  } else if (
    product.category === "Bakery" ||
    product.name.toLowerCase().includes("croissant") ||
    product.name.toLowerCase().includes("bagel")
  ) {
    descriptionElement.textContent =
      "Freshly baked with premium ingredients. Perfectly crisp on the outside and soft on the inside. Made daily to ensure maximum freshness and flavor.";
  } else {
    descriptionElement.textContent =
      "Premium quality product with carefully selected ingredients. Perfect for everyday use and special occasions.";
  }
}

function showErrorState() {
  document.getElementById("product-title").textContent = "Product Not Found";
  document.getElementById("selling-price").textContent = formatCurrency(0);
  document.getElementById("product-description").textContent =
    "Unable to load product information. Please try again later.";
  document.getElementById("add-to-cart-btn").disabled = true;
  document
    .getElementById("add-to-cart-btn")
    .classList.add("opacity-50", "cursor-not-allowed");
}

document.addEventListener("DOMContentLoaded", function () {
  loadProductData();

  // Quantity increment/decrement
  document
    .querySelector(".quantity-plus")
    .addEventListener("click", function () {
      const input = document.getElementById("quantity-input");
      input.value = parseInt(input.value) + 1;
    });

  document
    .querySelector(".quantity-minus")
    .addEventListener("click", function () {
      const input = document.getElementById("quantity-input");
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
      }
    });

  // Quantity input validation
  document
    .getElementById("quantity-input")
    .addEventListener("change", function () {
      if (this.value < 1) {
        this.value = 1;
      }
    });
});

// // Add to cart function
// function addToCart() {
//   const productId = getProductId();
//   const quantity = parseInt(document.getElementById("quantity-input").value);

//   // In a real implementation, you would call your cart API here
//   alert(`Added ${quantity} item(s) to cart!`);

//   // Example cart implementation
//   const cartItem = {
//     id: productId,
//     name: document.getElementById("product-title").textContent,
//     price: document.getElementById("selling-price").textContent,
//     quantity: quantity,
//   };

//   console.log("Added to cart:", cartItem);
//   // You would typically save this to localStorage or send to a backend
// }
