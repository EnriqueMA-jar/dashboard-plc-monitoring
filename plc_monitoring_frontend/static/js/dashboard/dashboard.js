document.addEventListener("DOMContentLoaded", () => {
  fetch("http://127.0.0.1:8001/api/session_status/", {
    method: "GET",
    credentials: "include"
  }).then(res => {
    if (res.status === 401) {
      window.location.href = "/";  // te regresa al login si no hay sesión
    }
  }).catch(err => {
    console.error("Error al validar la sesión", err);
    window.location.href = "/";
  });
});



// Cerrar sesion

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.getElementById("logout-btn").addEventListener("click", async function () {
  const confirmLogout = confirm("¿Seguro que quieres cerrar sesión?");
  if (!confirmLogout) return;

  const response = await fetch("http://127.0.0.1:8001/api/logout/", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": getCookie("csrftoken")  // 👈 CSRF obligatorio para métodos POST
    }
  });

  if (response.ok) {
    window.location.href = "/";
  } else {
    alert("Error al cerrar sesión.");
  }
});