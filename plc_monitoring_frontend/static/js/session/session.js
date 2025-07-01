document.addEventListener("DOMContentLoaded", () => {
  // Validar sesión en todas las páginas excepto login
  if (window.location.pathname !== "/") {
    fetch("http://127.0.0.1:8001/api/session/", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Sesión no válida");
        return res.json();
      })
      .then(data => {
        console.log("Sesión activa como:", data.user);
      })
      .catch(() => {
        console.warn("No hay sesión activa. Redirigiendo...");
        window.location.href = "/";
      });
  }

  // Botón de logout (con id fijo en el sidebar)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: "Tu sesión actual se cerrará",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        backdrop: true,
        allowOutsideClick: false
      });

      if (result.isConfirmed) {
        fetch("http://127.0.0.1:8001/api/logout/", {
          method: "POST",
          credentials: "include"
        }).then(() => {
            window.location.href = "/";
        });
      }
    });
  }
});
