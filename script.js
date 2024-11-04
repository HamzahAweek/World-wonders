const API_URL = 'https://www.world-wonders-api.org/v0/wonders';

async function loadWonders() {
    const wondersList = document.getElementById('wonders-list');
    const loadingIndicator = document.getElementById('loading-indicator');

    if (!wondersList) return; 

    try {
        const response = await fetch(API_URL);
        const wonders = await response.json();

        wondersList.innerHTML = `<ul>${wonders.map(wonder => 
            `<li><a href="wonder-details.html?name=${encodeURIComponent(wonder.name)}">${wonder.name}</a></li>`
        ).join('')}</ul>`;

        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error loading wonders:', error);
        wondersList.innerHTML = '<p>Error loading wonders.</p>';
    }
}

async function loadWonderDetails() {
    const wonderDetail = document.getElementById('wonder-detail');
    const wonderNameElement = document.getElementById('wonder-name');
    if (!wonderDetail) return;

    const params = new URLSearchParams(window.location.search);
    const wonderName = params.get('name');
    console.log('Wonder Name from URL:', wonderName);  

    if (!wonderName) {
        console.error('No wonder name found in URL.');
        wonderDetail.innerHTML = '<p>Wonder not found.</p>';
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const wonders = await response.json();
        const wonder = wonders.find(w => w.name === wonderName);
        
        if (!wonder) {
            throw new Error('Wonder not found');
        }

        wonderNameElement.innerText = wonder.name;

        wonderDetail.innerHTML = `
        <section class="wonder-details-header">
            <h1>Wonder Details</h1>
        </section>
        <section class="wonder-summary">
            <p>${wonder.summary}</p>
        </section>
        <section class="wonder-location">
            <strong>Location:</strong> <span>${wonder.location}</span>
        </section>
        <section class="wonder-build-year">
            <strong>Build Year:</strong> <span>${wonder.build_year}</span>
        </section>
        <section class="wonder-time-period">
            <strong>Time Period:</strong> <span>${wonder.time_period}</span>
        </section>
        <section class="wonder-images">
            ${wonder.links.images.map(img => `<img src="${img}" alt="${wonder.name}">`).join('')}
        </section>
        <section class="wonder-sources">
            <p>Learn more:
            <a href="${wonder.links.wiki}" target="_blank">Wikipedia</a>, 
            <a href="${wonder.links.britannica}" target="_blank">Britannica</a>,
            <a href="${wonder.links.google_maps}" target="_blank">Google Maps</a>,
            <a href="${wonder.links.trip_advisor}" target="_blank">TripAdvisor</a>
            </p>
        </section>`;
    
    } catch (error) {
        console.error('Error loading wonder details:', error);
        wonderDetail.innerHTML = '<p>Error loading wonder details.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        loadWonders();
    } else if (window.location.pathname.includes('wonder-details.html')) {
        loadWonderDetails();
    }
});