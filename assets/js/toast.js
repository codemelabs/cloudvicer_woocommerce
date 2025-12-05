function showToast(message, type = "success", title = "Notification") {
  const iconType = {
    success: "",
    error: "⚠️",
    warning: "⚠️",
    info: "",
  };

  const bgColor = {
    success: "toast-success",
    error: "toast-error",
    warning: "toast-warning",
    info: "toast-info",
  };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <div class="login-popup">
      <div class="login-popup-icon ${bgColor[type]}">
        <span style="font-size:22px;">${iconType[type]}</span>
      </div>
      <h2 class="login-popup-title">${title}</h2>
      <p class="login-popup-text">${message}</p>
      <div class="login-popup-buttons">
        <button class="login-popup-btn login-popup-btn-primary w-full">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  toast.querySelector("button").onclick = () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  };

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
