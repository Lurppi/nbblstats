document.addEventListener('DOMContentLoaded', () => {
    function loadTable(containerId, files) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';  // Clear previous content

        files.forEach(fileInfo => {
            const table = document.createElement('table');
            const title = document.createElement('caption');
            title.textContent = fileInfo.title;
            table.appendChild(title);

            fetch(fileInfo.file)
                .then(response => response.text())
                .then(text => {
                    const data = Papa.parse(text, { header: true }).data;
                    if (data.length === 0) return;

                    const headers = Object.keys(data[0]);
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        th.classList.add('sortable');
                        th.addEventListener('click', () => sortTable(table, headerRow.children.length));
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);

                    const tbody = document.createElement('tbody');
                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        headers.forEach(header => {
                            const td = document.createElement('td');
                            td.textContent = row[header] || 'N/A';
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);

                    container.appendChild(table);
                });
        });
    }

    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rowsArray = Array.from(tbody.querySelectorAll('tr'));
        const isAscending = !table.querySelector(`thead th:nth-child(${columnIndex + 1})`).classList.contains('asc');
        rowsArray.sort((a, b) => {
            const aText = a.children[columnIndex].textContent;
            const bText = b.children[columnIndex].textContent;
            const aVal = isNaN(aText) ? aText.toLowerCase() : parseFloat(aText);
            const bVal = isNaN(bText) ? bText.toLowerCase() : parseFloat(bText);
            return isAscending ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
        });
        tbody.innerHTML = '';
        rowsArray.forEach(row => tbody.appendChild(row));
        table.querySelectorAll('th').forEach(th => th.classList.remove('asc', 'desc'));
        table.querySelector(`thead th:nth-child(${columnIndex + 1})`).classList.add(isAscending ? 'asc' : 'desc');
    }

    function loadPlayersTable() {
        const league = document.getElementById('league').value;
        const statsType = document.getElementById('stats-type').value;
        const fileName = `${league.replace(' ', '_')}_${statsType.replace(' ', '_')}.csv`;
        loadTable('player-tables', [{ title: `Player Stats (${statsType})`, file: fileName }]);
    }

    document.getElementById('league').addEventListener('change', loadPlayersTable);
    document.getElementById('stats-type').addEventListener('change', loadPlayersTable);
    document.getElementById('division').addEventListener('change', loadPlayersTable);
    document.getElementById('position').addEventListener('change', loadPlayersTable);
    document.getElementById('birth-year').addEventListener('input', loadPlayersTable);

    // Load weekly tables
    loadTable('weekly-tables', [
        { title: 'Points', file: 'points-week.csv' },
        { title: 'Rebounds', file: 'rebounds-week.csv' },
        { title: 'Assists', file: 'assists-week.csv' },
        { title: 'Steals', file: 'steals-week.csv' },
        { title: 'Blocks', file: 'blocks-week.csv' },
        { title: 'PER', file: 'per-week.csv' }
    ]);

    // Load regular season tables
    loadTable('regular-season-tables', [
        { title: 'Points', file: 'points-regular.csv' },
        { title: 'Rebounds', file: 'rebounds-regular.csv' },
        { title: 'Assists', file: 'assists-regular.csv' },
        { title: 'Steals', file: 'steals-regular.csv' },
        { title: 'Blocks', file: 'blocks-regular.csv' },
        { title: 'PER', file: 'per-regular.csv' }
    ]);

    // Initial load for Players page
    loadPlayersTable();
});
