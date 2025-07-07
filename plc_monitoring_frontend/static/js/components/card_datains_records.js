document.addEventListener("DOMContentLoaded", function () {
    const humidityValueCell = document.querySelector(".data-in-table tr:nth-child(2) td:nth-child(1) b");
    const temperatureValueCell = document.querySelector(".data-in-table tr:nth-child(2) td:nth-child(2) b");

    const humidityDifferenceCell = document.querySelector(".data-in-table tr:nth-child(3) td:nth-child(1) p");
    const temperatureDifferenceCell = document.querySelector(".data-in-table tr:nth-child(3) td:nth-child(2) p");

  
  
    fetch("http://127.0.0.1:8001/api/charges/", { credentials: "include" })
    .then((response) => {
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      return response.json();
    })
    .then((data) => {
      // renderWeightChart(data); // Usamos todos los datos sin limitar
        if (data.length === 0) {
            humidityValueCell.textContent = "No hay datos disponibles";
            temperatureValueCell.textContent = "No hay datos disponibles";
          return;
        }


        const latestCharge = data[data.length - 1];
        const previousCharge = data[data.length - 2] || latestCharge; // Si no hay un segundo registro, usamos el último

        const humidityStart = latestCharge.charge_humidity_start || 0;
        
        const temperatureStart = latestCharge.charge_temperature_start || 0;

        humidityValueCell.textContent = `${humidityStart.toFixed(3)} %`;
        temperatureValueCell.textContent = `${temperatureStart.toFixed(0)} °C`;


        if (previousCharge){
            const previousHumidity = parseFloat(previousCharge.charge_humidity_start) || 0;
            const previousTemperature = parseFloat(previousCharge.charge_temperature_start) || 0;

            const humidityDifference = humidityStart - previousHumidity;
            const temperatureDifference = temperatureStart - previousTemperature;

            humidityDifferenceCell.textContent = `${humidityDifference >=0 ? "+" : ""}${humidityDifference.toFixed(3)} % que la carga anterior`;

            temperatureDifferenceCell.textContent = `${temperatureDifference >=0 ? "+" : ""}${temperatureDifference.toFixed(0)} °C que la carga anterior`;
        } else {
            humidityDifferenceCell.textContent = "No hay datos anteriores";
            temperatureDifferenceCell.textContent = "No hay datos anteriores";
        }
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
});