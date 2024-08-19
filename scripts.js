document.addEventListener('DOMContentLoaded', function() {
    const tableIds = [
        'points-week', 'rebounds-week', 'assists-week', 'steals-week', 'blocks-week', 'per-week',
        'points-regular', 'rebounds-regular', 'assists-regular', 'steals-regular', 'blocks-regular', 'per-regular'
    ];

    const tables = {
        weekly: [
            'https://github.com/Lurppi/nbblstats/points-week.csv',
            'https://github.com/Lurppi/nbblstats/rebounds-week.csv',
            'https://github.com/Lurppi/nbblstats/assists-week.csv',
            'https://github.com/Lurppi/nbblstats/steals-week.csv',
            'https://github.com/Lurppi/nbblstats/blocks-week.csv',
            'https://github.com/Lurppi/nbblstats/per-week.csv'
        ],
        regular: [
            'https://github.com/Lurppi/nbblstats/points-regular.csv',
            'https://github.com/Lurppi/nbblstats/rebounds-regular.csv',
            'https://github.com/Lurppi/nbblstats/assists-regular.csv',
            'https://github.com/Lurppi/nbblstats/steals-regular.csv',
            'https://github.com/Lurppi/nbblstats/blocks-regular.csv',
            'https://github.com/Lurppi/nbblstats/per-regular.csv'
        ]
    };

    function loadTables() {
        tableIds.forEach((id, index) => {
            const tableElement = document.getElementById(id);
            const type = id.includes('week') ? 'weekly' : 'regular';
            const file = tables[type][tableIds.indexOf(id) % 6];
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    tableElement.innerHTML = csvToHtmlTable(data, id);
                    if (type === 'weekly' && tableElement.id === 'points-week') {
                        addTop3Sorting(tableElement, data);
                    }
                })
                .catch(error => console.error('Error loading CSV file:', error));
        });
    }

    function csvToHtmlTable(csv, id) {
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

    function addTop3Sorting(tableElement, data) {
        const rows = data.split('\n').slice(1);
        const sortedRows = rows.sort((a, b) => {
            const aVal = parseFloat(a.split(';')[1]);
            const bVal = parseFloat(b.split(';')[1]);
            return bVal - aVal;
        });
        const top3Rows = sortedRows.slice(0, 3);
        const newTableData = [data.split('\n')[0]].concat(top3Rows).join('\n');
        tableElement.innerHTML = csvToHtmlTable(newTableData, tableElement.id);
    }

    function loadPlayerTable() {
        const url = getPlayerTableUrl();
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById('player-table-container').innerHTML = csvToHtmlTable(data);
                addSortFunctionality();
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }

    function getPlayerTableUrl() {
        const league = document.getElementById('league-filter').value.toLowerCase();
        const statsType = document.getElementById('stats-type-filter').value.toLowerCase();
        return `https://github.com/Lurppi/nbblstats/${league}_${statsType}.csv`;
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

    function applyAllFilters() {
        loadPlayerTable();
        applyFilters();
    }

    const filters = {
        division: document.getElementById('division-filter'),
        position: document.getElementById('position-filter'),
        yearOfBirth: document.getElementById('year-of-birth-filter'),
        gamesPlayed: document.getElementById('games-played-filter'),
        minutesPlayed: document.getElementById('minutes-played-filter')
    };

    Object.values(filters).forEach(filter => filter.addEventListener('change', applyFilters));

    loadTables();
    loadPlayerTable();
});
