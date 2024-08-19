document.addEventListener('DOMContentLoaded', function () {
    loadTables();

    document.getElementById('league-filter').addEventListener('change', loadTables);
    document.getElementById('stats-type-filter').addEventListener('change', loadTables);
    document.getElementById('division-filter').addEventListener('change', filterTables);
    document.getElementById('position-filter').addEventListener('change', filterTables);
    document.getElementById('year-filter').addEventListener('input', filterTables);
    document.getElementById('games-filter').addEventListener('input', filterTables);
    document.getElementById('minutes-filter').addEventListener('input', filterTables);
});

function loadTables() {
    const league = document.getElementById('league-filter').value;
    const statsType = document.getElementById('stats-type-filter').value;
    const tableContainer = document.getElementById('player-tables');
    tableContainer.innerHTML = '';

    const fileName = `${league}_${statsType}.csv`;

    fetch(fileName)
        .then(response => response.text())
        .then(csvText => {
            const table = document.createElement('table');
            const rows = csvText.split('\n');
            const headerRow = rows[0].split(';');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const header = document.createElement('tr');
            headerRow.forEach(headerCell => {
                const th = document.createElement('th');
                th.textContent = headerCell;
                th.classList.add('sortable');
                th.addEventListener('click', () => sortTable(table, th.cellIndex));
                header.appendChild(th);
            });
            thead.appendChild(header);
            table.appendChild(thead);

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].split(';');
                if (row.length > 1) {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                }
            }
            table.appendChild(tbody);
            tableContainer.appendChild(table);

            filterTables();
        });
}

function filterTables() {
    const division = document.getElementById('division-filter').value;
    const position = document.getElementById('position-filter').value;
    const year = parseInt(document.getElementById('year-filter').value);
    const games = parseInt(document.getElementById('games-filter').value);
    const minutes = parseInt(document.getElementById('minutes-filter').value);

    const rows = document.querySelectorAll('#player-tables table tbody tr');

    rows.forEach(row => {
        const div = row.cells[3].textContent;
        const pos = row.cells[2].textContent;
        const born = parseInt(row.cells[4].textContent);
        const gp = parseInt(row.cells[5].textContent);
        const mp = parseInt(row.cells[6].textContent);

        let showRow = true;

        if (division !== 'both' && div !== division) showRow = false;
        if (position !== 'all' && pos !== position) showRow = false;
        if (year && born !== year) showRow = false;
        if (games && gp < games) showRow = false;
        if (minutes && mp < minutes) showRow = false;

        row.style.display = showRow ? '' : 'none';
    });
}

function sortTable(table, columnIndex) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const isNumeric = !isNaN(rows[0].cells[columnIndex].textContent.trim());
    const direction = table.querySelector('th').classList.contains('asc') ? -1 : 1;

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();

        return isNumeric
            ? direction * (parseFloat(aText) - parseFloat(bText))
            : direction * aText.localeCompare(bText);
    });

    rows.forEach(row => table.querySelector('tbody').appendChild(row));

    table.querySelectorAll('th').forEach(th => th.classList.remove('asc', 'desc'));
    table.querySelector(`th:nth-child(${columnIndex + 1})`).classList.add(direction === 1 ? 'asc' : 'desc');
}
