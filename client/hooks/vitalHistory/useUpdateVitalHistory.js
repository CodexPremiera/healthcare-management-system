import { removeParam } from '../../utils/removeParam.js';

async function getVitalData(record_id) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/patient/fetch/${id}/vital_history/${record_id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch patient data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return null;
    }
}

export async function useUpdateVitalHistory(record_id) {
    const vital_data = await getVitalData(record_id);
    const addFormVital = document.getElementById('add-formvital');

    addFormVital.classList.remove('hidden'); 
    
    document.getElementById("vital-history-temperature").value = vital_data.temperature;
    document.getElementById("vital-history-blood-pressure").value = vital_data.blood_pressure;
    document.getElementById("vital-history-pulse-rate").value = vital_data.pulse_rate;
    document.getElementById("vital-history-blood-glucose").value = vital_data.blood_glucose;

    const form = document.getElementById("vital-history-form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const temperature = document.getElementById("vital-history-temperature").value;
        const blood_pressure = document.getElementById("vital-history-blood-pressure").value;
        const pulse_rate = document.getElementById("vital-history-pulse-rate").value;
        const blood_glucose = document.getElementById("vital-history-blood-glucose").value;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const editId = urlParams.get('edit_id');  // Check for edit_id

        if (!editId) {
            return;
        }

        removeParam();

        try {
            const token = localStorage.getItem('token');
            const requestData = {
                temperature,
                blood_pressure,
                pulse_rate,
                blood_glucose,
            };

            const response = await fetch(`http://127.0.0.1:8000/api/patient/update/${id}/vital_history/${record_id}/`, {
                method: "PUT",
                headers: {
                    'Authorization': `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                sessionStorage.setItem('toastMessage', 'Record Successfully Updated');
                sessionStorage.setItem('toastType', 'success');
            } else {
                sessionStorage.setItem('toastMessage', 'Failed to Update Record');
                sessionStorage.setItem('toastType', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            sessionStorage.setItem('toastMessage', 'Error occurred while processing the request');
            sessionStorage.setItem('toastType', 'error');
        }

    });
}
