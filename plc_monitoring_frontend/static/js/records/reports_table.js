let dataTable = null;

document.addEventListener("DOMContentLoaded", () => {
  const periodSelect = document.getElementById("period-select");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const btnSearch = document.getElementById("btn-search");
  const label = document.getElementById("selected-range");

  function formatDateForLabel(fecha) {
    const d = new Date(fecha);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  periodSelect.addEventListener("change", () => {
    const isCustom = periodSelect.value === "5";
    startDateInput.disabled = !isCustom;
    endDateInput.disabled = !isCustom;
  });

  btnSearch.addEventListener("click", async () => {
    const periodValue = periodSelect.value;
    let params = {};
    let start = null;
    let end = null;

    switch (periodValue) {
      case "1": // Hoy
        start = end = new Date();
        params.range = "today";
        break;
      case "2": // Ayer
        start = end = new Date();
        start.setDate(start.getDate() - 1);
        params.range = "yesterday";
        break;
      case "3": // Últimos 7 días
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 6);
        params.range = "last_7_days";
        break;
      case "4": // Últimos 30 días
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 29);
        params.range = "last_30_days";
        break;
      case "5": // Personalizado
        if (!startDateInput.value || !endDateInput.value) {
          alert("Selecciona ambas fechas para un periodo personalizado.");
          return;
        }
        start = new Date(startDateInput.value);
        end = new Date(endDateInput.value);
        params.range = "custom";
        params.start_date = startDateInput.value;
        params.end_date = endDateInput.value;
        break;
      default:
        alert("Selecciona un periodo válido.");
        return;
    }

    if (start && end) {
      label.textContent = `Del ${formatDateForLabel(start)} al ${formatDateForLabel(end)}`;
    } else {
      label.textContent = "";
    }

    try {
      if (periodValue !== "5") {
        params.start_date = start.toISOString().split('T')[0];
        params.end_date = end.toISOString().split('T')[0];
      }

      const query = new URLSearchParams(params).toString();
      const response = await fetch(`http://127.0.0.1:8001/api/Charges/filtered/?${query}`, {
        credentials: "include"
      });

      const data = await response.json();

      renderFilteredTable(data);
      renderCharts(data);

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  });


  document.querySelector(".generate:nth-child(1)").addEventListener("click", () => {
    dataTable.button('.buttons-pdf').trigger();
  });

  document.querySelector(".generate:nth-child(2)").addEventListener("click", () => {
    dataTable.button('.buttons-excel').trigger();
  });

  document.querySelector('.generate').addEventListener('click', () => {
    const humidityCanvas = document.getElementById('humidityChart');
    const temperatureCanvas = document.getElementById('temperatureChart');
    const weightCanvas = document.getElementById('weightChart');

    // Convertimos cada canvas a imagen base64
    const humidityImage = humidityCanvas.toDataURL('image/png');
    const temperatureImage = temperatureCanvas.toDataURL('image/png');
    const weightImage = weightCanvas.toDataURL('image/png');

    const selectedRange = document.getElementById("selected-range").textContent;

    // Estructura del PDF
    const docDefinition = {
      content: [
        { text: 'Análisis de los datos - Promedio de los resultados obtenidos en la búsqueda', style: 'header' },
        { text: `Periodo reportado: ${selectedRange}`, margin: [0, 0, 0, 20] },

        { text: 'Humedad (%)', style: 'subheader' },
        { image: humidityImage, width: 400, margin: [0, 0, 0, 20] },

        { text: 'Temperatura (ºC)', style: 'subheader' },
        { image: temperatureImage, width: 400, margin: [0, 0, 0, 20] },

        { text: 'Peso (Kg)', style: 'subheader' },
        { image: weightImage, width: 400, margin: [0, 0, 0, 20] }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('Reporte Cargas Graficos.pdf');
  });
});

function renderFilteredTable(data) {
  if ($.fn.DataTable.isDataTable("#datatable_charges")) {
    dataTable.clear().rows.add(data).draw();
  } else {
    dataTable = $('#datatable_charges').DataTable({
      data: data,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'Exportar a Excel',
          title: 'Reporte Cargas',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          }
        },
        {
          extend: 'pdfHtml5',
          text: 'Exportar a PDF',
          orientation: 'landscape',
          pageSize: 'A4',
          title: 'Reporte Cargas',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          }
        },
        {
          extend: 'print',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          },
          text: 'Imprimir'
        }
      ],
      searching: false,
      lengthChange: false,
      pageLength: 5,
      responsive: true,
      columns: [
        { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Número de carga
        { data: 'charge_date' },
        { data: 'charge_time_start' },
        { data: 'charge_time_finish' },
        { data: 'charge_weight_start' },
        { data: 'charge_weight_finish' },
        { data: 'charge_humidity_start' },
        { data: 'charge_humidity_finish' },
        { data: 'charge_temperature_start' },
        { data: 'charge_temperature_finish' }
      ]
    });
  }
}

function renderCharts(data) {
  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const weightIn = avg(data.map(d => d.charge_weight_start));
  const weightOut = avg(data.map(d => d.charge_weight_finish));
  const hcolors = ['#4994f6ff', '#a0c9ffff'];
  const wcolors = ['#c89cdcff', '#98f0e3ff'];
  const tcolors = ['#ffd88fff', '#ff8f6aff'];
  const tempIn = avg(data.map(d => d.charge_temperature_start));
  const tempOut = avg(data.map(d => d.charge_temperature_finish));
  const humIn = avg(data.map(d => d.charge_humidity_start));
  const humOut = avg(data.map(d => d.charge_humidity_finish));

  renderDoughnutChart('weightChart', ['Entrada', 'Salida'], [weightIn, weightOut], wcolors);
  renderDoughnutChart('temperatureChart', ['Entrada', 'Salida'], [tempIn, tempOut], tcolors);
  renderDoughnutChart('humidityChart', ['Entrada', 'Salida'], [humIn, humOut], hcolors);
}
function renderDoughnutChart(canvasId, labels, data, colors) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Elimina el gráfico anterior si existe
  if (Chart.getChart(canvasId)) {
    Chart.getChart(canvasId).destroy();
  }

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'start',
          color: '#000',
          font: {
            size: 17,
            weight: 'bold'
          },
          formatter: function (value) {
            return value.toFixed(2);
          }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.toFixed(2)}`;
            }
          }
        }
      }

    },
    plugins: [ChartDataLabels]


  });
}
