document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://127.0.0.1:8001/api/login/", {
    method: "POST",
    credentials: "include", // Esto permite guardar cookies
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  console.log("✅ Respuesta del API:", data);

  if (response.ok) {
    alert("Inicio de sesión correcto");
     window.location.href = "/dashboard/";
  } else {
    alert("Error: " + data.error);
  }
});