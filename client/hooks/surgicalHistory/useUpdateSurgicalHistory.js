import { removeParam } from '../../utils/removeParam.js';

async function getSurgicalData(record_id) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/patient/fetch/${id}/surgical_history/${record_id}/`, {
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

export async function useUpdateSurgicalHistory(record_id) {
    const surgical_data = await getSurgicalData(record_id);
    const addFormSurg = document.getElementById('add-formsurgery');

    addFormSurg.classList.remove('hidden'); 
    
    document.getElementById("surgical-history-operation-procedure").value = surgical_data.operation_procedure;
    document.getElementById("surgical-history-indication").value = surgical_data.indication;
    document.getElementById("surgical-history-hospital").value = surgical_data.hospital;
    document.getElementById("surgical-history-operation-date").value = surgical_data.operation_date;

    const form = document.getElementById("surgical-history-form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const operation_procedure = document.getElementById("surgical-history-operation-procedure").value;
        const indication = document.getElementById("surgical-history-indication").value;
        const hospital = document.getElementById("surgical-history-hospital").value;
        const operation_date = document.getElementById("surgical-history-operation-date").value;

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
                operation_procedure,
                indication,
                hospital,
                operation_date,
            };

            const response = await fetch(`http://127.0.0.1:8000/api/patient/update/${id}/surgical_history/${record_id}/`, {
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
