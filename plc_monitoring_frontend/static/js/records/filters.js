  function clearFilters(e) {
    e.preventDefault();
    document.querySelectorAll('.filters select, .filters input').forEach(el => {
      el.value = '';
    });
    renderCharges(charges);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#charge-table tbody");
    let charges = [];

    fetch("http://127.0.0.1:8001/api/charges/", { credentials: "include" })
      .then(response => response.json())
      .then(data => {
        charges = data;
        renderCharges(charges);
      })
      .catch(error => {
        tableBody.innerHTML = `<tr><td colspan="9">Error: ${error.message}</td></tr>`;
      });

    function renderCharges(data) {
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
  });
