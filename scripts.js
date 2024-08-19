document.addEventListener('DOMContentLoaded', function() {
    const leagueSelect = document.getElementById('league');
    const statsTypeSelect = document.getElementById('stats-type');
    const divisionSelect = document.getElementById('division');
    const positionSelect = document.getElementById('position');
    const yearOfBirthInput = document.getElementById('year-of-birth');
    const gamesPlayedInput = document.getElementById('games-played');
    const minutesPlayedInput = document.getElementById('minutes-played');
    const tablesContainer = document.getElementById('tables-container');

    const csvFiles = {
        regular: {
            totals: 'Regular_Totals.csv',
            averages: 'Regular_Averages.csv',
            shooting: 'Regular_Shooting.csv',
            advanced1: 'Regular_Advanced1.csv',
            advanced2: 'Regular_Advanced2.csv',
            four_factors: 'Regular_Four_Factors.csv'
        },
        playoffs: {
            totals: 'Playoffs_Totals.csv',
            averages: 'Playoffs_Averages.csv',
            shooting: 'Playoffs_Shooting.csv',
            advanced1: 'Playoffs_Advanced1.csv',
            advanced2: 'Playoffs_Advanced2.csv',
            four_factors: 'Playoffs_Four_Factors.csv'
        }
    };

    function loadCSV(url) {
        return fetch(url)
            .then(response => response.text())
            .then(text => text.split('\n').map(line => line.split(';')));
    }

    function renderTable(headers, data) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }

    function updateTables() {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const file = csvFiles[league][statsType];

        if (file) {
            loadCSV(file).then(lines => {
                const headers = lines[0];
                const data = lines.slice(1);
                
                // Clear existing tables
                tablesContainer.innerHTML = '';

                // Filter data based on the filter values
                const filteredData = data.filter(row => {
                    return (
                        (divisionSelect.value === 'both' || row[2] === divisionSelect.value) &&
                        (positionSelect.value === 'all' || row[3] === positionSelect.value) &&
                        (!yearOfBirthInput.value || row[4] === yearOfBirthInput.value) &&
                        (!gamesPlayedInput.value || row[5] >= gamesPlayedInput.value) &&
                        (!minutesPlayedInput.value || row[6] >= minutesPlayedInput.value)
                    );
                });

                // Render the table
                const table = renderTable(headers, filteredData);
                tablesContainer.appendChild(table);
            });
        }
    }

    // Event listeners for filters
    leagueSelect.addEventListener('change', updateTables);
    statsTypeSelect.addEventListener('change', updateTables);
    divisionSelect.addEventListener('change', updateTables);
    positionSelect.addEventListener('change', updateTables);
    yearOfBirthInput.addEventListener('input', updateTables);
    gamesPlayedInput.addEventListener('input', updateTables);
    minutesPlayedInput.addEventListener('input', updateTables);

    // Initialize tables on page load
    updateTables();
});
