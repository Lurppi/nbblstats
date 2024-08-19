document.addEventListener('DOMContentLoaded', function() {
    // URLs zu den CSV-Dateien
    const csvUrls = {
        regular: {
            totals: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_totals.csv',
            averages: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_averages.csv',
            shooting: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_shooting.csv',
            advanced1: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_advanced1.csv',
            advanced2: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_advanced2.csv',
            four_factors: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_four_factors.csv'
        },
        playoffs: {
            totals: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_totals.csv',
            averages: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_averages.csv',
            shooting: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_shooting.csv',
            advanced1: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_advanced1.csv',
            advanced2: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_advanced2.csv',
            four_factors: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_four_factors.csv'
        }
    };

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
        const league = document.getElementById('league-filter').value;
        const statsType = document.getElementById('stats-type-filter').value;
        return csvUrls[league][statsType];
    }

    function csvToHtmlTable(csv) {
        const rows = csv.split('\n').map(row => row.split(';'));
        let html = '<table><thead><tr>';
        rows[0].forEach(header => html += `<th>${header}</th>`);
        html += '</tr></thead><tbody>';
        rows.slice(1).forEach(row => {
            html += '<tr>';
            row.forEach(cell => html += `<td>${cell}</td>`);
            html += '</tr>';
        });
        html += '</tbody></table>';
        return html;
    }

    function applyFilters() {
        const filters = {
            division: document.getElementById('division-filter').value,
            position: document.getElementById('position-filter').value,
            yearOfBirth: document.getElementById('year-of-birth-filter').value,
            gamesPlayed: document.getElementById('games-played-filter').value,
            minutesPlayed: document.getElementById('minutes-played-filter').value
        };
        const rows = document.querySelectorAll('#player-table-container table tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const matches = {
                division: filters.division === 'both' || cells[3].innerText.includes(filters.division),
                position: filters.position === 'all' || cells[4].innerText.includes(filters.position),
                yearOfBirth: filters.yearOfBirth === '' || cells[5].innerText.includes(filters.yearOfBirth),
                gamesPlayed: filters.gamesPlayed === '' || parseInt(cells[6].innerText, 10) >= parseInt(filters.gamesPlayed, 10),
                minutesPlayed: filters.minutesPlayed === '' || parseInt(cells[7].innerText, 10) >= parseInt(filters.minutesPlayed, 10)
            };
            row.style.display = Object.values(matches).every(match => match) ? '' : 'none';
        });
    }

    function addSortFunctionality() {
        const headers = document.querySelectorAll('#player-table-container table th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => sortTable(index));
        });
    }

    function sortTable(columnIndex) {
        const table = document.querySelector('#player-table-container table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const isAscending = table.querySelectorAll('thead th')[columnIndex].classList.toggle('asc');
        rows.sort((a, b) => {
            const aText = a.children[columnIndex].innerText.trim();
            const bText = b.children[columnIndex].innerText.trim();
            const aValue = isNaN(aText) ? aText : parseFloat(aText);
            const bValue = isNaN(bText) ? bText : parseFloat(bText);
            return isAscending ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
        });
        rows.forEach(row => table.querySelector('tbody').appendChild(row));
    }

    // Event Listener für Filteränderungen
    document.querySelectorAll('select, input').forEach(filter => filter.addEventListener('change', loadPlayerTable));

    // Initialer Ladevorgang
    loadPlayerTable();
});
