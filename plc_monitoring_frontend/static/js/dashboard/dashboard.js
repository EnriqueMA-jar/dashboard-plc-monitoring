document.addEventListener("DOMContentLoaded", function () {
  let lastId = null;

  async function pollAndUpdate() {
    try {
      const [weightsRes, latestRes, lastThreeRes] = await Promise.all([
        fetch("http://127.0.0.1:8001/api/Charges/weights/", { credentials: "include" }),
        fetch("http://127.0.0.1:8001/api/Charges/latest/", { credentials: "include" }),
        fetch("http://127.0.0.1:8001/api/Charges/last-three/", { credentials: "include" }) // <-- aquí
      ]);

      if (!weightsRes.ok || !latestRes.ok || !lastThreeRes.ok)
        throw new Error("Error en la respuesta del servidor");

      const weightsData = await weightsRes.json();
      const latest = await latestRes.json();
      const lastThree = await lastThreeRes.json();

      // Suponiendo que quieres seguir usando lastId para evitar renders innecesarios
      const newId = lastThree.length ? lastThree[0].id : null;

      if (newId !== lastId) {
        lastId = newId;
        updateAllComponents(weightsData, latest, lastThree);
      }
    } catch (error) {
      console.error("Error en polling:", error);
    } finally {
      setTimeout(pollAndUpdate, 600000);
    }
  }

  function updateAllComponents(weightsData, latest, lastThree) {
    renderWeightChart(weightsData);
    renderInputTable(lastThree);
    renderOutputTable(lastThree);
    renderRecentCharges(lastThree);
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

    const last = data[0];   // Última carga (más reciente)
    const prev = data[1] || last; // Anterior

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

    const last = data[0];
    const prev = data[1] || last;

    const hum = last.charge_humidity_finish || 0;
    const temp = last.charge_temperature_finish || 0;

    humidityCell.textContent = `${hum.toFixed(3)} %`;
    tempCell.textContent = `${temp.toFixed(0)} °C`;

    const humDiff = hum - (parseFloat(prev.charge_humidity_finish) || 0);
    const tempDiffVal = temp - (parseFloat(prev.charge_temperature_finish) || 0);

    humidityDiff.textContent = `${humDiff >= 0 ? "+" : ""}${humDiff.toFixed(3)} % que la carga anterior`;
    tempDiff.textContent = `${tempDiffVal >= 0 ? "+" : ""}${tempDiffVal.toFixed(0)} °C que la carga anterior`;
  }
  function renderWeightChart(data) {
  const canvas = document.getElementById("weight-comparisson");
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Última carga"],
      datasets: [
        {
          label: "Peso Entrada (kg)",
          data: [data.charge_weight_start],
          backgroundColor: "blue",
        },
        {
          label: "Peso Salida (kg)",
          data: [data.charge_weight_finish],
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
          text: "Peso de la última carga",
          font: {
            size: 18,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          },
        },
        datalabels: {
          color: "white",
          anchor: "end",
          align: "start",
          font: {
            weight: "bold",
            size: 12,
          },
          formatter: (value) => `${value} kg`,
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
            text: "Carga",
            font: {
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            },
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}


  function renderRecentCharges(data) {
    const list = document.getElementById("charges");
    list.innerHTML = "";

    if (!data.length) {
      list.innerHTML = "<b>No hay cargas registradas.</b>";
      return;
    }

    data.forEach((c) => {
      const startTime = c.charge_time_start;

      const endTime = c.charge_time_finish;

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

  pollAndUpdate();
});
