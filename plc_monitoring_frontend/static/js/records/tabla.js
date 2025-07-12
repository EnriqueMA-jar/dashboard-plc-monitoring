const listCharges=async()=>{
    try{
        const response = await fetch("http://127.0.0.1:8001/api/Charges/list/", { credentials: 'include' });
        const charges = await response.json();
        
        let content = ``;
        charges.forEach((charges, index)=> {
            content +=`
            <tr>
                <td>${index + 1}</td>
                <td>${charges.charge_date}</td>
                <td>${charges.charge_time_start}</td>
                <td>${charges.charge_time_finish}</td>
                <td>${charges.charge_weight_start}</td>
                <td>${charges.charge_weight_finish}</td>
                <td>${charges.charge_humidity_start}</td>
                <td>${charges.charge_humidity_finish}</td>
                <td>${charges.charge_temperature_start}</td>
                <td>${charges.charge_temperature_finish}</td>
            </tr>
            `;
        });
        tableBody_charges.innerHTML = content;
    }catch(error){
        alert("Error al cargar los datos: " + error);
    }
}

window.addEventListener("load", async () => {
    await listCharges();
});