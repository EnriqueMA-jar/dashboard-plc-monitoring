document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  if (!form) {
    console.error("⚠️ No se encontró el formulario con ID 'register-form'");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!email || !username || !password || !confirmPassword) {
      alert("⚠️ Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      alert("⚠️ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, username, password })
      });

      if (response.ok) {
        const data = await response.json();
        alert("✅ Usuario registrado correctamente");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert("❌ Error: " + (errorData?.error || "No se pudo registrar"));
      }

    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("❌ No se pudo conectar con el servidor");
    }
  });
});
