    document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:8001/api/charges/", { credentials: "include" })
    .then((response) => {
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      return response.json();
    })
    .then((data) => {
      const list = document.getElementById("charges");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<b>No hay cargas registradas.</b>";
        return;
      }

      data.slice(-8).forEach((charge) => {
        const startTime = new Date(charge.charge_time_start).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const endTime = new Date(charge.charge_time_finish).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Crear contenedor
        const container = document.createElement("div");
        container.className = "container";

        // Crear tabla
        const table = document.createElement("table");
        table.className = "table-charge";

        // Fila 1 - encabezado dinámico
        const header = document.createElement("tr");
        header.innerHTML = `
          <th class="charge">Carga #${charge.id}:</th>
          <th class="time">Hora: ${startTime} - ${endTime}</th>
        `;
        table.appendChild(header);

        // Fila 2 - títulos
        const titles = document.createElement("tr");
        titles.innerHTML = `
          <td><strong>Entrada</strong></td>
          <td><strong>Salida</strong></td>
        `;
        table.appendChild(titles);

        // Fila 3 - datos
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${charge.charge_temperature_start} ºC / ${charge.charge_weight_start} kg / ${charge.charge_humidity_start}%</td>
          <td>${charge.charge_temperature_finish} ºC / ${charge.charge_weight_finish} kg / ${charge.charge_humidity_finish}%</td>
        `;
        table.appendChild(row);

        container.appendChild(table);
        list.appendChild(container);
      });
    })
    .catch((error) => {
      document.getElementById("charges").innerHTML =
        `<p>Error: ${error.message}</p>`;
      console.error("Error al obtener los datos:", error);
    });
});