let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});
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
window.addToCart = function (productId) {
  if (!window.isUserLoggedIn()) {
    window.showLoginPopup();
    return;
  }

  // console.log("Adding product to cart:", productId);
  // ... rest of cart logic
  const btn = event.target;
  if (btn) {
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.classList.add("bg-green-600", "border-green-600", "text-white");

    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.remove("bg-green-600", "border-green-600", "text-white");
    }, 1500);
  }
};

function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.innerText = cartCount;
    if (cartCount > 0) {
      countElement.classList.remove("hidden");
    }
  }
}

// head shadow
const headerSTR = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    headerSTR.classList.add("shadow-md");
  } else {
    headerSTR.classList.remove("shadow-md");
  }
});
// end

// ads slide
const slider = document.getElementById("slider");
const dotsSTS = document.querySelectorAll(".dot");
let index = 0;
const totalSlides = dotsSTS.length;

function updateSlider() {
  slider.style.transform = `translateX(-${index * 100}%)`;
  dotsSTS.forEach((dot) => dot.classList.remove("opacity-100"));
  dotsSTS[index].classList.add("opacity-100");
}

setInterval(() => {
  index = (index + 1) % totalSlides;
  updateSlider();
}, 4000);

updateSlider();
// end
