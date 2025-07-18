let dataTable = null;

document.addEventListener("DOMContentLoaded", () => {
  const periodSelect = document.getElementById("period-select");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const btnSearch = document.getElementById("btn-search");

  // Habilitar/deshabilitar fechas si es personalizado
  periodSelect.addEventListener("change", () => {
    const isCustom = periodSelect.value === "5"; // valor 5 = Personalizado
    startDateInput.disabled = !isCustom;
    endDateInput.disabled = !isCustom;
  });

  btnSearch.addEventListener("click", async () => {
    const periodValue = periodSelect.value;
    let params = {};

    switch (periodValue) {
      case "1":
        params.range = "today";
        break;
      case "2":
        params.range = "yesterday";
        break;
      case "3":
        params.range = "last_7_days";
        break;
      case "4":
        params.range = "last_30_days";
        break;
      case "5":
        
        const start = startDateInput.value;
        const end = endDateInput.value;

        if (!start || !end) {
          alert("Selecciona ambas fechas para un periodo personalizado.");
          return;
        }

        params.range = "custom";
        params.start_date = start;
        params.end_date = end;
        break;
      default:
        alert("Selecciona un periodo válido.");
        return;
    }

    try {
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
});

function renderFilteredTable(data) {
  if ($.fn.DataTable.isDataTable("#datatable_charges")) {
    dataTable.clear().rows.add(data).draw();
  } else {
    dataTable = $('#datatable_charges').DataTable({
      data: data,
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
  const tempIn = avg(data.map(d => d.charge_temperature_start));
  const tempOut = avg(data.map(d => d.charge_temperature_finish));
  const humIn = avg(data.map(d => d.charge_humidity_start));
  const humOut = avg(data.map(d => d.charge_humidity_finish));

  renderDoughnutChart('weightChart', ['Entrada', 'Salida'], [weightIn, weightOut]);
  renderDoughnutChart('temperatureChart', ['Entrada', 'Salida'], [tempIn, tempOut]);
  renderDoughnutChart('humidityChart', ['Entrada', 'Salida'], [humIn, humOut]);
}
function renderDoughnutChart(canvasId, labels, data) {
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
        backgroundColor: ['#36A2EB', '#FF6384'],
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
        align: 'top',
        color: '#000',
        font: {
          weight: 'bold'
        },
        formatter: function(value) {
          return value.toFixed(2);
        }
      },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.toFixed(2)}`;
            }
          }
        }
      }
      
    },
    plugins: [ChartDataLabels]

    
  });
}
