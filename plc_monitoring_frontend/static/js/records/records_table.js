let dataTable;

const initDataTable = async () => {
  ataTable = $('#datatable_charges').DataTable({
  serverSide: true,
  processing: true,
  responsive: true,
  autoWidth: false,
  ajax: {
    url: 'http://127.0.0.1:8001/api/Charges/records/',
    type: 'GET',
    dataType: 'json',
    xhrFields: {
      withCredentials: true  // <-- ESTO ES CLAVE para que se envíe la cookie de sesión
    }
  },
  language: {
    url: "/static/js/datatables/es-ES.json"
  },
  columns: [
    { data : 'id'},
    { data: 'charge_presentation' },
    { data: 'charge_date' },
    { data: 'charge_time_start' },
    { data: 'charge_time_finish' },
    { data: 'charge_weight_start' },
    { data: 'charge_weight_finish' },
    { data: 'charge_humidity_start' },
    { data: 'charge_humidity_finish' },
    { data: 'charge_temperature_start' },
    { data: 'charge_temperature_finish' },
  ]
});
};

window.addEventListener("DOMContentLoaded", async () => {
  await initDataTable();
});
