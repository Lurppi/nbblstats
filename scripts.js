document.addEventListener('DOMContentLoaded', () => {
    const leagueSelect = document.getElementById('league');
    const statsTypeSelect = document.getElementById('stats-type');
    const divisionSelect = document.getElementById('division');
    const positionSelect = document.getElementById('position');
    const yearOfBirthMin = document.getElementById('year-of-birth-min');
    const yearOfBirthMax = document.getElementById('year-of-birth-max');
    const gamesPlayedMin = document.getElementById('games-played-min');
    const gamesPlayedMax = document.getElementById('games-played-max');
    const minutesPlayedMin = document.getElementById('minutes-played-min');
    const minutesPlayedMax = document.getElementById('minutes-played-max');

    // Function to parse CSV data into an array of objects
    function parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(';');
        const rows = lines.slice(1).map(line => line.split(';'));
        return rows.map(row => {
            return headers.reduce((acc, header, i) => {
                acc[header] = row[i];
                return acc;
            }, {});
        });
    }

    // Function to create a sortable table from CSV data
    function createTable(data, tableId) {
        const table = document.createElement('table');
        table.id = tableId;
        
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        const headers = Object.keys(data[0]);
        const tr = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header;
            th.addEventListener('click', () => sortTable(table, header));
            tr.appendChild(th);
        });
        
        thead.appendChild(tr);
        table.appendChild(thead);
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.innerText = row[header];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        return table;
    }

    // Function to sort the table by column
    function sortTable(table, header) {
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const headerIndex = Array.from(table.querySelectorAll('th')).findIndex(th => th.innerText === header);
        
        rows.sort((rowA, rowB) => {
            const cellA = rowA.children[headerIndex].innerText;
            const cellB = rowB.children[headerIndex].innerText;
            
            return isNaN(cellA) ? cellA.localeCompare(cellB) : Number(cellA) - Number(cellB);
        });
        
        rows.forEach(row => table.querySelector('tbody').appendChild(row));
    }

    // Function to load and display CSV data
    function loadAndDisplayCSV(url, tableId) {
        fetch(url)
            .then(response => response.text())
            .then(text => {
                const data = parseCSV(text);
                const table = createTable(data, tableId);
                document.getElementById('tables-container').appendChild(table);
                applyFilters(); // Apply filters after table is loaded
            });
    }

    // Apply filters to the table data
    function applyFilters() {
        const tables = document.querySelectorAll('#tables-container table');
        tables.forEach(table => {
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            rows.forEach(row => {
                const data = {};
                row.querySelectorAll('td').forEach((cell, index) => {
                    data[table.querySelectorAll('th')[index].innerText] = cell.innerText;
                });

                const yearOfBirth = parseInt(data['Year of Birth']);
                const gamesPlayed = parseInt(data['Games Played']);
                const minutesPlayed = parseInt(data['Minutes Played']);
                const isVisible = (
                    (divisionSelect.value === 'both' || data['Division'] === divisionSelect.value) &&
                    (positionSelect.value === 'all' || data['Position'] === positionSelect.value) &&
                    (!yearOfBirthMin.value || yearOfBirth >= parseInt(yearOfBirthMin.value)) &&
                    (!yearOfBirthMax.value || yearOfBirth <= parseInt(yearOfBirthMax.value)) &&
                    (!gamesPlayedMin.value || gamesPlayed >= parseInt(gamesPlayedMin.value)) &&
                    (!gamesPlayedMax.value || gamesPlayed <= parseInt(gamesPlayedMax.value)) &&
                    (!minutesPlayedMin.value || minutesPlayed >= parseInt(minutesPlayedMin.value)) &&
                    (!minutesPlayedMax.value || minutesPlayed <= parseInt(minutesPlayedMax.value))
                );

                row.style.display = isVisible ? '' : 'none';
            });
        });
    }

    // Event listeners for filter changes
    document.querySelectorAll('#filters select, #filters input').forEach(el => {
        el.addEventListener('change', applyFilters);
    });

    // Load tables for Players page
    const csvFiles = {
        'totals': 'players_totals.csv',
        'averages': 'players_averages.csv',
        'shooting': 'players_shooting.csv',
        'advanced1': 'players_advanced1.csv',
        'advanced2': 'players_advanced2.csv',
        'four_factors': 'players_four_factors.csv'
    };

    const leagueSelectValue = leagueSelect.value;
    const statsTypeSelectValue = statsTypeSelect.value;
    const csvFile = csvFiles[statsTypeSelectValue];

    if (csvFile) {
        loadAndDisplayCSV(`https://raw.githubusercontent.com/Lurppi/nbblstats/main/${csvFile}`, 'players-table');
    }

    // Load tables for Home page (Top 3)
    const homePageTables = [
        'weekly_top3',
        'regular_season_top3'
    ];

    homePageTables.forEach(tableId => {
        loadAndDisplayCSV(`https://raw.githubusercontent.com/Lurppi/nbblstats/main/${tableId}.csv`, tableId);
    });
});
