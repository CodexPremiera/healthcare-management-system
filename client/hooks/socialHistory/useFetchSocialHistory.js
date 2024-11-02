async function fetchSocialHistory(page = 1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/patient/fetch/${id}/social_history/?page=${page}`, {
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

function formatSocialData(item) {
    const date_added = new Date(item.date_added).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });

    return { ...item, date_added};
}

// Pagination rendering function
function renderSocialPagination(totalPages, currentPage) {
    const social_history_navigation = document.getElementById('social-history-navigation');
    social_history_navigation.innerHTML = '';

    social_history_navigation.insertAdjacentHTML('beforeend', `
        <li style="display: inline;">
            <a href="#" class="social-pagination-link" data-page="${currentPage > 1 ? currentPage - 1 : 1}"
               style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                      height: 32px; color: gray; background: white; border: 1px solid #D1D5DB; 
                      border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem; 
                      transition: background-color 0.2s; text-decoration: none;">
                <span style="display: none;">Previous</span>
                <svg style="width: 0.625rem; height: 0.625rem;" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
            </a>                       
        </li>
    `);

    for (let i = 1; i <= totalPages; i++) {
        social_history_navigation.insertAdjacentHTML('beforeend', `
            <li style="display: inline;">
                <a href="#" class="social-pagination-link" data-page="${i}" 
                   style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                          height: 32px; color: ${i === currentPage ? '#2563EB' : 'gray'}; 
                          background: ${i === currentPage ? '#DBEAFE' : 'white'};
                          border: 1px solid #D1D5DB; text-decoration: none;">
                    ${i}
                </a>
            </li>
        `);
    }

    social_history_navigation.insertAdjacentHTML('beforeend', `
        <li style="display: inline;">
            <a href="#" class="social-pagination-link" data-page="${currentPage < totalPages ? currentPage + 1 : totalPages}"
               style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                      height: 32px; color: gray; background: white; border: 1px solid #D1D5DB; 
                      border-top-right-radius: 0.375rem; border-bottom-right-radius: 0.375rem; 
                      transition: background-color 0.2s; text-decoration: none;">
                <span style="display: none;">Next</span>
                <svg style="width: 0.625rem; height: 0.625rem;" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
            </a>                       
        </li>
    `);

    document.querySelectorAll('.social-pagination-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault(); 
            const newPage = link.dataset.page; 

            const social_history = await fetchSocialHistory(newPage);
            if (social_history) {
                updateSocialHistoryTable(social_history);
                renderSocialPagination(social_history.total_pages, social_history.current_page);
            }
        });
    });
}

function updateSocialHistoryTable(socialHistory) {
    const social_history_body = document.getElementById('social-history-body');
    social_history_body.innerHTML = ''; 

    socialHistory.results.forEach(item => {
        const formatted_item = formatSocialData(item);
        const row = `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${formatted_item.date_added}
            </th>
            <td class="px-6 py-4">${formatted_item.nicotine_consumption}</td>
            <td class="px-6 py-4">${formatted_item.alcohol_consumption}</td>
            <td class="px-6 py-4">${formatted_item.drugs_taken}</td>
            <td class="px-6 py-4">${formatted_item.diet}</td>
            <td class="px-6 py-4">${formatted_item.physical_activity}</td>
            <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
            </td>
            </tr>
        `;
        social_history_body.insertAdjacentHTML('beforeend', row);
    });
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', async function () {
    const social_history = await fetchSocialHistory();
    if (social_history) {
        updateSocialHistoryTable(social_history);
        renderSocialPagination(social_history.total_pages, social_history.current_page);
    } else {
        console.error("Error fetching social history");
    }
});
