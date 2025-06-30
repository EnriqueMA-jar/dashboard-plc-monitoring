document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Validar sesión en todas las páginas excepto login
  if (window.location.pathname !== "/login/") {
    fetch("http://127.0.0.1:8001/api/session/", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Sesión no válida");
        return res.json();
      })
      .then(data => {
        console.log("✅ Sesión activa como:", data.user);
      })
      .catch(() => {
        console.warn("⛔ No hay sesión activa. Redirigiendo...");
        window.location.href = "/";
      });
  }

  // 🔓 Botón de logout (con id fijo en el sidebar)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("http://127.0.0.1:8001/api/logout/", {
        method: "POST",
        credentials: "include"
      }).then(() => {
        console.log("🚪 Sesión cerrada");
        window.location.href = "/";
      });
    });
  }
});
