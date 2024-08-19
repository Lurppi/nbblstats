document.addEventListener('DOMContentLoaded', function() {
    // URLs zu den CSV-Dateien
    const tables = {
        weekly: [
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/points-week.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/rebounds-week.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/assists-week.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/steals-week.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/blocks-week.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-week.csv'
        ],
        regular: [
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/points-regular.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/rebounds-regular.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/assists-regular.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/steals-regular.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/blocks-regular.csv',
            'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-regular.csv'
        ]
    };

    function loadHomeTables() {
        const tableIds = [
            'points-week', 'rebounds-week', 'assists-week', 'steals-week', 'blocks-week', 'per-week',
            'points-regular', 'rebounds-regular', 'assists-regular', 'steals-regular', 'blocks-regular', 'per-regular'
        ];
        tableIds.forEach((id, index) => {
            const tableElement = document.getElementById(id);
            const type = id.includes('week') ? 'weekly' : 'regular';
            const file = tables[type][tableIds.indexOf(id) % 6];
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    tableElement.innerHTML = csvToHtmlTable(data);
                })
                .catch(error => console.error('Error loading CSV file:', error));
        });
    }

    function csvToHtmlTable(csv) {
        const rows = csv.split('\n').map(row => row.split(';'));
        const headers = rows[0];
        const body = rows.slice(1);
        let tableHtml = '<table>';

        tableHtml += '<thead><tr>';
        headers.forEach(header => tableHtml += `<th>${header}</th>`);
        tableHtml += '</tr></thead>';

        tableHtml += '<tbody>';
        body.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => tableHtml += `<td>${cell}</td>`);
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';

        return tableHtml;
    }

    function loadPlayerTable() {
        const url = getPlayerTableUrl();
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('player-table-container').innerHTML = csvToHtmlTable(data);
                addSortFunctionality();
                applyFilters(); // Filters should be applied after table is loaded
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }

    function getPlayerTableUrl() {
        const league = document.getElementById('league-filter').value.toLowerCase();
        const statsType = document.getElementById('stats-type-filter').value.toLowerCase();
        return `https://raw.githubusercontent.com/Lurppi/nbblstats/main/${league}_${statsType}.csv`;
    }

    function addSortFunctionality() {
        const tables = document.querySelectorAll('#player-table-container table');
        tables.forEach(table => {
            const headers = table.querySelectorAll('th');
            headers.forEach((header, index) => {
                header.addEventListener('click', () => {
                    sortTable(table, index);
                });
            });
        });
    }

    function sortTable(table, columnIndex) {
        const rowsArray = Array.from(table.querySelectorAll('tbody tr'));
        const isNumericColumn = !isNaN(rowsArray[0].children[columnIndex].textContent.trim());

        rowsArray.sort((a, b) => {
            const aText = a.children[columnIndex].textContent.trim();
            const bText = b.children[columnIndex].textContent.trim();

            if (isNumericColumn) {
                return parseFloat(aText) - parseFloat(bText);
            } else {
                return aText.localeCompare(bText);
            }
        });

        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        rowsArray.forEach(row => tbody.appendChild(row));
    }

    function applyFilters() {
        const table = document.querySelector('#player-table-container table');
        if (!table) return;
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.children;
            const matchesFilters =
                (filters.division.value === 'both' || cells[0].textContent.includes(filters.division.value)) &&
                (filters.position.value === 'all' || cells[1].textContent.includes(filters.position.value)) &&
                (filters.yearOfBirth.value === '' || cells[2].textContent === filters.yearOfBirth.value) &&
                (filters.gamesPlayed.value === '' || parseInt(cells[3].textContent) >= parseInt(filters.gamesPlayed.value)) &&
                (filters.minutesPlayed.value === '' || parseInt(cells[4].textContent) >= parseInt(filters.minutesPlayed.value));

            row.style.display = matchesFilters ? '' : 'none';
        });
    }

    const filters = {
        division: document.getElementById('division-filter'),
        position: document.getElementById('position-filter'),
        yearOfBirth: document.getElementById('year-of-birth-filter'),
        gamesPlayed: document.getElementById('games-played-filter'),
        minutesPlayed: document.getElementById('minutes-played-filter')
    };

    Object.values(filters).forEach(filter => filter.addEventListener('change', applyFilters));

    loadHomeTables();
    loadPlayerTable();
});
