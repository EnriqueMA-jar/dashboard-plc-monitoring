document.getElementById("date-range-filter").addEventListener("change", async function () {
  const range = this.value;
  try {
    const response = await fetch(`/api/Charges/filtered/?range=${range}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }else{
         // Mostrar los datos en tabla
        renderFilteredTable(data);
        // Calcular y mostrar los promedios
        renderChartsWithAverages(data);
    }
  } catch (error) {
    console.error("Error al cargar los datos filtrados:", error);
  }
});
function renderFilteredTable(data) {
  if ($.fn.DataTable.isDataTable("#datatable_charges")) {
    $('#datatable_charges').DataTable().clear().rows.add(data).draw();
  } else {
    $('#datatable_charges').DataTable({
      data: data,
      searching: false,
      lengthChange: false,
      pageLength: 6,
      columns: [
        { data: 'charge_date' },
        { data: 'charge_time_start' },
        { data: 'charge_time_finish' },
        { data: 'charge_weight_start' },
        { data: 'charge_weight_finish' },
        { data: 'charge_temperature_start' },
        { data: 'charge_temperature_finish' },
        { data: 'charge_humidity_start' },
        { data: 'charge_humidity_finish' },
      ]
    });
  }
}
