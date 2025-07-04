document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8001/api/charges/", { credentials: "include" })
    .then((response) => {
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      return response.json();
    })
    .then((data) => {
      renderWeightChart(data); // Usamos todos los datos sin limitar
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
});

function renderWeightChart(charges) {
  const labels = charges.map((charge) => `Carga #${charge.id}`);
  const weightStart = charges.map((charge) => charge.charge_weight_start);
  const weightFinish = charges.map((charge) => charge.charge_weight_finish);

  const ctx = document.getElementById("weight-comparisson").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Peso Entrada (kg)",
          data: weightStart,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "blue",
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Peso Salida (kg)",
          data: weightFinish,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "red",
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Peso registrado en todas las cargas",
          font: {
            size: 18,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Kilogramos (kg)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Cargas registradas",
            font: {
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            },
          },
        },
      },
    },
  });
}

