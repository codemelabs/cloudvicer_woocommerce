import { API_DOMAIN, API_URLS } from "./config.js";

// login
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_URLS.google_login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        showToast("Invalid email or password", "error", "Login Failed");
        return;
      }

      localStorage.setItem("member_token", result.authorization.token);
      localStorage.setItem("member_email", result.user.email);
      localStorage.setItem("member_name", result.user.name);
      localStorage.setItem("member_user", JSON.stringify(result.user));

      sessionStorage.clear();

      // showToast("Login successful!", "success", "Success");

      // setTimeout(() => {
      window.location.href = "./shop.html";
      // }, 1200);
    } catch (err) {
      console.error(err);
      showToast("Invalid email or password", "error", "Login Failed");
    }
  });

// google handle
window.handleGoogleLogin = function (response) {
  if (!response.credential) {
    // alert("No credential received from Google");
    showToast("No credential received from Google", "error", "Login Failed");

    return;
  }

  fetch(API_URLS.google_verify, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: response.credential }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.verified) {
        sessionStorage.setItem(
          "google_verified_user",
          JSON.stringify(data.user)
        );

        const container = document.querySelector(".g_id_signin");
        container.innerHTML = `
          <div class="text-center p-3 border rounded-lg bg-gray-100">
            <p class="font-semibold text-gray-800">Hello, ${data.user.name}</p>
            <p class="text-sm text-gray-600">${data.user.email}</p>
          </div>
        `;

        window.location.href = "register.html";
      } else {
        showToast("Google verification failed", "error", "Login Failed");

        // alert("Google verification failed");
      }
    })
    .catch((err) => {
      console.error(err);
      // alert("Backend error");
      showToast("Backend error", "error", "Login Failed");
    });
};
