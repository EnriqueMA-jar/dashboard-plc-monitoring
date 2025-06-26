document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = new FormData(e.target);
      const data = {
        username: form.get("username"),
        password: form.get("password"),
      };

      const response = await fetch("http://127.0.0.1:8001/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // si usas CSRF
        },
        credentials: "include", // importante para que Django maneje la sesión 
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        alert(result.detail || "Credenciales incorrectas");
      }
    });
  } else {
    console.error("⚠️ No se encontró el formulario con ID 'login-form'");
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
});
