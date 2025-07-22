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
      case "1":
        start = end = new Date();
        params.range = "today";
        break;
      case "2":
        start = end = new Date();
        start.setDate(start.getDate() - 1);
        params.range = "yesterday";
        break;
      case "3":
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 6);
        params.range = "last_7_days";
        break;
      case "4":
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 29);
        params.range = "last_30_days";
        break;
      case "5":
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

      window.chargeData = data;

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  });

  // Exportar Excel (sin cambios)
  document.querySelector(".generate:nth-child(2)").addEventListener("click", () => {
    dataTable.button('.buttons-excel').trigger();
  });

  // Exportar PDFs (datos + gráficos) con fecha en nombre
  document.querySelector('.generate').addEventListener('click', () => {
    const data = window.chargeData || [];

    // Preparar PDF con tabla de datos
    const pdfData = [
      [
        'Carga', 'Fecha', 'Inicio', 'Fin', 'Peso Entrada (Kg)', 'Peso Salida (Kg)',
        'Humedad Entrada (%)', 'Humedad Salida (%)',
        'Temperatura Entrada (°C)', 'Temperatura Salida (°C)'
      ],
      ...data.map((row, index) => [
        index + 1,
        row.charge_date,
        row.charge_time_start,
        row.charge_time_finish,
        row.charge_weight_start,
        row.charge_weight_finish,
        row.charge_humidity_start,
        row.charge_humidity_finish,
        row.charge_temperature_start,
        row.charge_temperature_finish
      ])
    ];

    const pdfDefinitionTable = {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: 'Informe de Cargas', fontSize: 16, bold: true, alignment: 'center', border: [true, true, false, true] },
                {
                  stack: [
                    'Comercializadora Al Grano S. de R.L.',
                    'Km 74 Carretera libre Armería-Manzanillo, Nuevo Cuyutlán,',
                    'Manzanillo, Col. C.P. 28880'
                  ],
                  fontSize: 10,
                  alignment: 'right',
                  border: [false, true, true, true]
                }
              ]
            ]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: Array(10).fill('*'),
            body: pdfData
          },
          layout: {
            fillColor: (rowIndex) => rowIndex === 0 ? '#eeeeee' : null,
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => 'black',
            vLineColor: () => 'black'
          }
        }
      ]
    };

    // Preparar PDF con gráficos
    const humidityCanvas = document.getElementById('humidityChart');
    const temperatureCanvas = document.getElementById('temperatureChart');
    const weightCanvas = document.getElementById('weightChart');

    const humidityImage = humidityCanvas.toDataURL('image/png');
    const temperatureImage = temperatureCanvas.toDataURL('image/png');
    const weightImage = weightCanvas.toDataURL('image/png');

    const selectedRange = document.getElementById("selected-range").textContent;

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: 'Análisis de los datos - Promedio de los resultados obtenidos en la búsqueda', style: 'header' },
        { text: `Periodo reportado: ${selectedRange}`, margin: [0, 0, 0, 20] },
        {
          columns: [
            { image: humidityImage, width: 240 },
            { image: temperatureImage, width: 240 },
            { image: weightImage, width: 240 }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    // Fecha para nombre de archivo
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();

    const nombrePdfDatos = `Reporte Cargas Datos ${dia}-${mes}-${anio}.pdf`;
    const nombrePdfGraficos = `Reporte Cargas Graficos ${dia}-${mes}-${anio}.pdf`;

    // Descargar ambos PDFs
    pdfMake.createPdf(pdfDefinitionTable).download(nombrePdfDatos);
    pdfMake.createPdf(docDefinition).download(nombrePdfGraficos);
  });
});

function renderFilteredTable(data) {
  if ($.fn.DataTable.isDataTable("#datatable_charges")) {
    dataTable.clear().rows.add(data).draw();
  } else {
    dataTable = $('#datatable_charges').DataTable({
      data: data,
      dom: 'frtip',
      buttons: [
        {
          visible: false,
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
        { data: null, render: (data, type, row, meta) => meta.row + 1 },
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
