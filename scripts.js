// script.js

const csvBaseUrl = 'https://github.com/Lurppi/nbblstats/raw/main/';

let currentFile = 'Regular Season Totals.csv'; // Default file

async function loadCSV(file) {
    const response = await fetch(csvBaseUrl + file);
    const text = await response.text();
    return text.split('\n').map(row => row.split(';'));
}

async function updateHomePage() {
    const weeklyFiles = [
        'points-week.csv', 'rebounds-week.csv', 'assists-week.csv',
        'steals-week.csv', 'blocks-week.csv', 'per-week.csv'
    ];
    const regularFiles = [
        'points-regular.csv', 'rebounds-regular.csv', 'assists-regular.csv',
        'steals-regular.csv', 'blocks-regular.csv', 'per-regular.csv'
    ];

    const weeklyContainer = document.getElementById('weekly-tables');
    const regularContainer = document.getElementById('regular-season-tables');
    weeklyContainer.innerHTML = '';
    regularContainer.innerHTML = '';

    for (let file of [...weeklyFiles, ...regularFiles]) {
        const data = await loadCSV(file);
        const top3Data = data.slice(1, 4); // Show only top 3 rows
        const table = createTable(top3Data);
        if (weeklyFiles.includes(file)) {
            weeklyContainer.appendChild(table);
        } else {
            regularContainer.appendChild(table);
        }
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
if (document.getElementById('weekly-tables')) updateHomePage();
if (document.getElementById('player-table-container')) updatePlayersPage();
