document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname == "/") {
    fetch("http://127.0.0.1:8001/api/session/", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Sesión no válida");
        return res.json();
      })
      .then(data => {
        console.log("Sesión activa como:", data.user);
        window.location.href = "/dashboard/";
      })
      .catch(() => {
        console.warn("No hay sesión activa.");
      });
  }

  const form = document.getElementById("login-form");
  if (!form) {
    console.error("No se encontró el formulario con ID 'login-form'");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("remember-me").checked;

    if (!username || !password) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor ingresa usuario y contraseña',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      return;
    }

    // Mostrar loading mientras espera respuesta del servidor
    Swal.fire({
      toast: true,
      position: 'top-end',
      title: 'Iniciando sesión...',
      icon: 'info',
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    try {
      const response = await fetch("http://127.0.0.1:8001/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, remember: rememberMe })
      });

      const data = await response.json();
      Swal.close();

      if (response.ok) {
        console.log("Sesión iniciada:", data);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Bienvenido',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        }).then(() => {
          window.location.href = "/dashboard/";
        });

      } else if (response.status === 403) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Verifica tu usuario y contraseña',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Error inesperado',
          text: data?.detail || data?.error || "Error desconocido",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error de red:", error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }
  });
});
