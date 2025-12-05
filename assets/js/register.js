import { API_DOMAIN, API_URLS } from "./config.js";

const user = JSON.parse(sessionStorage.getItem("google_verified_user"));

if (!user) {
  alert("Unauthorized access");
  window.location.href = "login.html";
} else {
  document.getElementById("email").value = user.email;
  document.getElementById("name").value = user.name;
}

// register
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      email: user.email, 
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
      address: document.getElementById("address").value,
    };

    try {
      const res = await fetch(API_URLS.google_register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Registration failed");
        return;
      }

      localStorage.setItem("member_token", result.authorization.token);
      localStorage.setItem("member_email", result.user.email);
      localStorage.setItem("member_name", result.user.name);
      localStorage.setItem("member_user", JSON.stringify(result.user));

      sessionStorage.clear();

      window.location.href = "./shop.html";
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong. Try again.");
    }
  });


// t.p
const phoneInput = document.querySelector("#phone");
const iti = window.intlTelInput(phoneInput, {
  initialCountry: "auto",
  separateDialCode: true,
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});
