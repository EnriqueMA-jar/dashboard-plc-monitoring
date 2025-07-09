let charges = [];
let lastChargeId = null;

function clearFilters(e) {
  e.preventDefault();
  document.querySelectorAll('.filters select, .filters input').forEach(el => {
    el.value = '';
  });
  renderCharges(charges);
}

function renderCharges(data) {
  const tableBody = document.querySelector("#charge-table tbody");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='9'>No hay cargas registradas.</td></tr>";
    return;
  }

  data.forEach(charge => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(charge.charge_time_start).toLocaleDateString("es-MX")}</td>
      <td>${new Date(charge.charge_time_start).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</td>
      <td>${new Date(charge.charge_time_finish).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</td>
      <td>${charge.charge_weight_start}</td>
      <td>${charge.charge_weight_finish}</td>
      <td>${charge.charge_temperature_start}</td>
      <td>${charge.charge_temperature_finish}</td>
      <td>${charge.charge_humidity_start}</td>
      <td>${charge.charge_humidity_finish}</td>
    `;
    tableBody.appendChild(row);
  });
}

async function pollAndUpdate() {
  try {
    const response = await fetch("http://127.0.0.1:8001/api/charges/", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();

    // Solo renderiza si hay cambios (nuevo ID)
    const newLastId = data.length > 0 ? data[data.length - 1].id : null;
    if (newLastId !== lastChargeId) {
      lastChargeId = newLastId;
      charges = data;
      applyFilters(); // mantiene filtros activos
    }

  } catch (error) {
    const tableBody = document.querySelector("#charge-table tbody");
    tableBody.innerHTML = `<tr><td colspan="9">Error: ${error.message}</td></tr>`;
    console.error("Error en polling:", error);
  } finally {
    setTimeout(pollAndUpdate, 10000); // polling cada 10 segundos
  }
}

document.addEventListener("DOMContentLoaded", function () {
  pollAndUpdate(); // inicia el polling al cargar

  document.getElementById("search-input").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const filtered = charges.filter(charge =>
      JSON.stringify(charge).toLowerCase().includes(keyword)
    );
    renderCharges(filtered);
  });

  document.querySelectorAll(".filter-item select").forEach(select => {
    select.addEventListener("change", applyFilters);
  });

  document.querySelector("#clear-filters")?.addEventListener("click", clearFilters);
});

function applyFilters() {
  let sorted = [...charges];

  const filters = {
    date: document.getElementById("order-date").value,
    weightIn: document.getElementById("weight-in").value,
    weightOut: document.getElementById("weight-out").value,
    tempIn: document.getElementById("temp-in").value,
    tempOut: document.getElementById("temp-out").value,
    humIn: document.getElementById("hum-in").value,
    humOut: document.getElementById("hum-out").value,
  };

  if (filters.date) {
    sorted.sort((a, b) => filters.date === "asc"
      ? new Date(a.charge_time_start) - new Date(b.charge_time_start)
      : new Date(b.charge_time_start) - new Date(a.charge_time_start));
  }
  if (filters.weightIn) {
    sorted.sort((a, b) => filters.weightIn === "asc"
      ? a.charge_weight_start - b.charge_weight_start
      : b.charge_weight_start - a.charge_weight_start);
  }
  if (filters.weightOut) {
    sorted.sort((a, b) => filters.weightOut === "asc"
      ? a.charge_weight_finish - b.charge_weight_finish
      : b.charge_weight_finish - a.charge_weight_finish);
  }
  if (filters.tempIn) {
    sorted.sort((a, b) => filters.tempIn === "asc"
      ? a.charge_temperature_start - b.charge_temperature_start
      : b.charge_temperature_start - a.charge_temperature_start);
  }
  if (filters.tempOut) {
    sorted.sort((a, b) => filters.tempOut === "asc"
      ? a.charge_temperature_finish - b.charge_temperature_finish
      : b.charge_temperature_finish - a.charge_temperature_finish);
  }
  if (filters.humIn) {
    sorted.sort((a, b) => filters.humIn === "asc"
      ? a.charge_humidity_start - b.charge_humidity_start
      : b.charge_humidity_start - a.charge_humidity_start);
  }
  if (filters.humOut) {
    sorted.sort((a, b) => filters.humOut === "asc"
      ? a.charge_humidity_finish - b.charge_humidity_finish
      : b.charge_humidity_finish - a.charge_humidity_finish);
  }

  renderCharges(sorted);
}