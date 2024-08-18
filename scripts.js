document.addEventListener('DOMContentLoaded', () => {
    function loadTable(containerId, fileName) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear previous content

        fetch(fileName)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
                return response.text();
            })
            .then(text => {
                const data = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
                if (data.length === 0) return;

                const headers = Object.keys(data[0]);
                const table = document.createElement('table');
                table.classList.add('sortable');

                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    th.classList.add('sortable');
                    th.addEventListener('click', () => sortTable(table, headers.indexOf(header)));
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
            })
            .catch(error => console.error(error));
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
        const division = document.getElementById('division').value;
        const position = document.getElementById('position').value;
        const birthYear = document.getElementById('birth-year').value;

        const fileName = `${league.replace(' ', '_')}_${statsType.replace(' ', '_')}.csv`;

        fetch(fileName)
            .then(response => response.text())
            .then(text => {
                const data = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
                if (data.length === 0) return;

                const filteredData = data.filter(row => 
                    (division === 'Both' || row['DIV'] === division) &&
                    (position === 'All' || row['POS'] === position) &&
                    (!birthYear || row['BORN'] === birthYear)
                );

                const headers = Object.keys(data[0]);
                const table = document.createElement('table');
                table.classList.add('sortable');

                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    th.classList.add('sortable');
                    th.addEventListener('click', () => sortTable(table, headers.indexOf(header)));
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                filteredData.forEach(row => {
                    const tr = document.createElement('tr');
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.textContent = row[header] || 'N/A';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);

                const playerTables = document.getElementById('player-tables');
                playerTables.innerHTML = '';
                playerTables.appendChild(table);
            })
            .catch(error => console.error(error));
    }

    // Event listeners for filter changes
    document.getElementById('league').addEventListener('change', loadPlayersTable);
    document.getElementById('stats-type').addEventListener('change', loadPlayersTable);
    document.getElementById('division').addEventListener('change', loadPlayersTable);
    document.getElementById('position').addEventListener('change', loadPlayersTable);
    document.getElementById('birth-year').addEventListener('input', loadPlayersTable);

    // Set default filters and load initial data
    document.getElementById('league').value = 'Regular Season';
    document.getElementById('stats-type').value = 'Totals';
    document.getElementById('division').value = 'Both';
    document.getElementById('position').value = 'All';
    document.getElementById('birth-year').value = '';
    loadPlayersTable();
});
