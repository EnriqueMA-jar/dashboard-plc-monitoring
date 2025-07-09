document.addEventListener("DOMContentLoaded", function () {
  let lastId = null;
  let chartInstance = null;

  async function pollAndUpdate() {
    try {
      const response = await fetch("http://127.0.0.1:8001/api/charges/", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const data = await response.json();

      const newId = data.length ? data[data.length - 1].id : null;

      if (newId !== lastId) {
        lastId = newId;
        updateAllComponents(data);
      }
    } catch (error) {
      console.error("Error en polling:", error);
    } finally {
      setTimeout(pollAndUpdate, 10000); // polling cada 10 segundos
    }
  }

  function updateAllComponents(data) {
    renderWeightChart(data);
    renderInputTable(data);
    renderOutputTable(data);
    renderRecentCharges(data);
  }

  function renderWeightChart(charges) {
  const labels = charges.map((c) => `Carga #${c.id}`);
  const weightStart = charges.map((c) => c.charge_weight_start);
  const weightFinish = charges.map((c) => c.charge_weight_finish);
  const canvas = document.getElementById("weight-comparisson");

  // 🛠️ Solución correcta: destruir gráfico existente antes de crear uno nuevo
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Peso Entrada (kg)",
          data: weightStart,
          backgroundColor: "blue",
        },
        {
          label: "Peso Salida (kg)",
          data: weightFinish,
          backgroundColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
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
          title: { display: true, text: "Kilogramos (kg)" },
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

  function renderInputTable(data) {
    const humidityCell = document.querySelector(".data-in-table tr:nth-child(2) td:nth-child(1) b");
    const tempCell = document.querySelector(".data-in-table tr:nth-child(2) td:nth-child(2) b");
    const humidityDiff = document.querySelector(".data-in-table tr:nth-child(3) td:nth-child(1) p");
    const tempDiff = document.querySelector(".data-in-table tr:nth-child(3) td:nth-child(2) p");

    if (!data.length) {
      humidityCell.textContent = "No hay datos disponibles";
      tempCell.textContent = "No hay datos disponibles";
      return;
    }

    const last = data[data.length - 1];
    const prev = data[data.length - 2] || last;

    const hum = last.charge_humidity_start || 0;
    const temp = last.charge_temperature_start || 0;

    humidityCell.textContent = `${hum.toFixed(3)} %`;
    tempCell.textContent = `${temp.toFixed(0)} °C`;

    const humDiff = hum - (parseFloat(prev.charge_humidity_start) || 0);
    const tempDiffVal = temp - (parseFloat(prev.charge_temperature_start) || 0);

    humidityDiff.textContent = `${humDiff >= 0 ? "+" : ""}${humDiff.toFixed(3)} % que la carga anterior`;
    tempDiff.textContent = `${tempDiffVal >= 0 ? "+" : ""}${tempDiffVal.toFixed(0)} °C que la carga anterior`;
  }

  function renderOutputTable(data) {
    const humidityCell = document.querySelector(".data-out-table tr:nth-child(2) td:nth-child(1) b");
    const tempCell = document.querySelector(".data-out-table tr:nth-child(2) td:nth-child(2) b");
    const humidityDiff = document.querySelector(".data-out-table tr:nth-child(3) td:nth-child(1) p");
    const tempDiff = document.querySelector(".data-out-table tr:nth-child(3) td:nth-child(2) p");

    if (!data.length) {
      humidityCell.textContent = "No hay datos disponibles";
      tempCell.textContent = "No hay datos disponibles";
      return;
    }

    const last = data[data.length - 1];
    const prev = data[data.length - 2] || last;

    const hum = last.charge_humidity_finish || 0;
    const temp = last.charge_temperature_finish || 0;

    humidityCell.textContent = `${hum.toFixed(3)} %`;
    tempCell.textContent = `${temp.toFixed(0)} °C`;

    const humDiff = hum - (parseFloat(prev.charge_humidity_finish) || 0);
    const tempDiffVal = temp - (parseFloat(prev.charge_temperature_finish) || 0);

    humidityDiff.textContent = `${humDiff >= 0 ? "+" : ""}${humDiff.toFixed(3)} % que la carga anterior`;
    tempDiff.textContent = `${tempDiffVal >= 0 ? "+" : ""}${tempDiffVal.toFixed(0)} °C que la carga anterior`;
  }

  function renderRecentCharges(data) {
    const list = document.getElementById("charges");
    list.innerHTML = "";

    if (!data.length) {
      list.innerHTML = "<b>No hay cargas registradas.</b>";
      return;
    }

    data.slice(-3).forEach((c) => {
      const startTime = new Date(c.charge_time_start).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const endTime = new Date(c.charge_time_finish).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const container = document.createElement("div");
      container.className = "container";

      const table = document.createElement("table");
      table.className = "table-charge";

      table.innerHTML = `
        <tr>
          <th class="charge">Carga #${c.id}:</th>
          <th class="time">Hora: ${startTime} - ${endTime}</th>
        </tr>
        <tr>
          <td><strong>Entrada</strong></td>
          <td><strong>Salida</strong></td>
        </tr>
        <tr>
          <td>${c.charge_temperature_start} ºC / ${c.charge_weight_start} kg / ${c.charge_humidity_start}%</td>
          <td>${c.charge_temperature_finish} ºC / ${c.charge_weight_finish} kg / ${c.charge_humidity_finish}%</td>
        </tr>
      `;

      container.appendChild(table);
      list.appendChild(container);
    });
  }

  // Iniciar polling
  pollAndUpdate();
});
