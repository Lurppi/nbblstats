// script.js

const csvBaseUrl = 'https://lurppi.github.io/nbblstats/';

let currentFile = 'Regular Season Totals.csv'; // Default file

async function loadCSV(file) {
    const response = await fetch(csvBaseUrl + file);
    const text = await response.text();
    return text.split('\n').map(row => row.split(';'));
}

async function updateHomePage() {
    const top3Files = [
        'points-week.csv', 'rebounds-week.csv', 'assists-week.csv',
        'steals-week.csv', 'blocks-week.csv', 'per-week.csv',
        'points-regular.csv', 'rebounds-regular.csv', 'assists-regular.csv',
        'steals-regular.csv', 'blocks-regular.csv', 'per-regular.csv'
    ];

    const container = document.getElementById('top3-container');
    container.innerHTML = ''; // Clear existing content

    for (let i = 0; i < top3Files.length; i++) {
        const data = await loadCSV(top3Files[i]);
        const table = createTable(data.slice(1, 4)); // Show only top 3 rows
        container.appendChild(table);
        if ((i + 1) % 3 === 0) container.appendChild(document.createElement('br')); // New line after every 3 tables
    }
}

function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    return table;
}

async function updatePlayersPage() {
    const data = await loadCSV(currentFile);
    const tableContainer = document.getElementById('player-table-container');
    tableContainer.innerHTML = '';
    const table = createTable(data.slice(1)); // Skip header
    tableContainer.appendChild(table);
    populateFilters(data);
}

function populateFilters(data) {
    populateFilter('division', data, 'DIV');
    populateFilter('team', data, 'TEAM');
    populateFilter('position', data, 'POS');
    populateFilter('year-of-birth', data, 'BORN');
}

function populateFilter(filterId, data, columnName) {
    const select = document.getElementById(filterId);
    const options = new Set(data.slice(1).map(row => row[data[0].indexOf(columnName)]));
    select.innerHTML = '<option value="All">All</option>';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function updateTable() {
    // Logic to filter and update table based on filters
}

// Initial load for home and players page
if (document.getElementById('top3-container')) updateHomePage();
if (document.getElementById('player-table-container')) updatePlayersPage();
