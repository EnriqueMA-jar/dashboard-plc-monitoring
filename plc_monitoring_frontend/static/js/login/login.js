document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) {
    console.error("⚠️ No se encontró el formulario con ID 'login-form'");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Por favor ingresa usuario y contraseña");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Sesión iniciada:", data);
        window.location.href = "/dashboard/";
      } else if (response.status === 403) {
        alert("⚠️ Usuario o contraseña incorrectos");
      } else {
        const errorData = await response.json();
        alert("❌ Error: " + (errorData?.detail || errorData?.error || "Desconocido"));
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("❌ No se pudo conectar con el servidor");
    }
  });
});
