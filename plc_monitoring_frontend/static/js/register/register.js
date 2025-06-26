document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = new FormData(e.target);
      const data = {
        email: form.get("email"),
        username: form.get("username"),
        password: form.get("password"),
      };

      const response = await fetch("http://127.0.0.1:8001/api/register/", {
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
        alert("Usuario registrado exitosamente");
        window.location.href = "/"; // Redirige a la página de inicio o login
      } else {
        alert(result.detail || "Error al registrar usuario");
      }
    });
  } else {
    console.error("⚠️ No se encontró el formulario con ID 'register-form'");
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
});
