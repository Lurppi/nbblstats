document.addEventListener('DOMContentLoaded', () => {
    const leagueSelect = document.getElementById('league');
    const statsTypeSelect = document.getElementById('stats-type');
    const divisionSelect = document.getElementById('division');
    const positionSelect = document.getElementById('position');
    const yearOfBirthInput = document.getElementById('year-of-birth');
    const gamesPlayedInput = document.getElementById('games-played');
    const minutesPlayedInput = document.getElementById('minutes-played');
    const tablesContainer = document.getElementById('tables-container');

    // Function to load CSV file and display data
    function loadCSV(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(data => callback(data))
            .catch(error => console.error('Error loading CSV:', error));
    }

    // Function to parse CSV data and generate HTML table
    function parseCSV(data) {
        const rows = data.split('\n').filter(row => row);
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        if (rows.length > 0) {
            const headers = rows[0].split(';');
            const trHead = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                th.addEventListener('click', () => sortTable(table, headers.indexOf(header)));
                trHead.appendChild(th);
            });
            thead.appendChild(trHead);

            rows.slice(1).forEach(row => {
                const tr = document.createElement('tr');
                row.split(';').forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
        }
        return table;
    }

    // Function to sort table by column
    function sortTable(table, colIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAscending = table.getAttribute('data-sort-order') === 'asc';
        table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');

        rows.sort((a, b) => {
            const aText = a.children[colIndex].textContent.trim();
            const bText = b.children[colIndex].textContent.trim();
            return isAscending
                ? aText.localeCompare(bText, undefined, { numeric: true })
                : bText.localeCompare(aText, undefined, { numeric: true });
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    // Event listener for filters
    function applyFilters() {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const division = divisionSelect.value;
        const position = positionSelect.value;
        const yearOfBirth = yearOfBirthInput.value;
        const gamesPlayed = gamesPlayedInput.value;
        const minutesPlayed = minutesPlayedInput.value;

        const csvFile = `${statsType}_${league}_${division}_${position}.csv`;
        loadCSV(csvFile, data => {
            tablesContainer.innerHTML = '';  // Clear previous tables
            const table = parseCSV(data);
            tablesContainer.appendChild(table);
        });
    }

    // Event listeners for filter changes
    leagueSelect.addEventListener('change', applyFilters);
    statsTypeSelect.addEventListener('change', applyFilters);
    divisionSelect.addEventListener('change', applyFilters);
    positionSelect.addEventListener('change', applyFilters);
    yearOfBirthInput.addEventListener('input', applyFilters);
    gamesPlayedInput.addEventListener('input', applyFilters);
    minutesPlayedInput.addEventListener('input', applyFilters);

    // Initial load
    applyFilters();
});
