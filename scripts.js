// Home Page Script

document.addEventListener('DOMContentLoaded', () => {
    const tables = {
        'points-week': 'points-week.csv',
        'rebounds-week': 'rebounds-week.csv',
        'assists-week': 'assists-week.csv',
        'steals-week': 'steals-week.csv',
        'blocks-week': 'blocks-week.csv',
        'per-week': 'per-week.csv',
        'points-regular': 'points-regular.csv',
        'rebounds-regular': 'rebounds-regular.csv',
        'assists-regular': 'assists-regular.csv',
        'steals-regular': 'steals-regular.csv',
        'blocks-regular': 'blocks-regular.csv',
        'per-regular': 'per-regular.csv',
    };

    const loadTable = (tableId, fileName) => {
        fetch(fileName)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const table = document.getElementById(tableId);
                const tbody = table.querySelector('tbody');
                tbody.innerHTML = ''; // Clear existing rows
                rows.forEach((row, index) => {
                    if (index > 0 && row.length > 1) { // Skip header row and empty rows
                        const tr = document.createElement('tr');
                        row.forEach(cell => {
                            const td = document.createElement('td');
                            td.textContent = cell;
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    }
                });
            })
            .catch(error => console.error('Error loading table:', error));
    };

    Object.keys(tables).forEach(tableId => {
        loadTable(tableId, tables[tableId]);
    });
});

// Players Page Script

document.addEventListener('DOMContentLoaded', () => {
    const filters = {
        league: 'Regular Season',
        division: 'Both',
        position: 'All',
        statsType: 'Totals'
    };

    const tables = {
        'Regular Season': {
            'Totals': 'Regular_Totals.csv',
            'Averages': 'Regular_Averages.csv',
            'Shooting': 'Regular_Shooting.csv',
            'Advanced1': 'Regular_Advanced1.csv',
            'Advanced2': 'Regular_Advanced2.csv',
            'Four Factors': 'Regular_Four_Factors.csv',
        },
        'Playoffs': {
            'Totals': 'Playoffs_Totals.csv',
            'Averages': 'Playoffs_Averages.csv',
            'Shooting': 'Playoffs_Shooting.csv',
            'Advanced1': 'Playoffs_Advanced1.csv',
            'Advanced2': 'Playoffs_Advanced2.csv',
            'Four Factors': 'Playoffs_Four_Factors.csv',
        }
    };

    const updateTable = () => {
        const { league, statsType } = filters;
        const fileName = tables[league][statsType];
        const tableContainer = document.getElementById('players-tables');
        tableContainer.innerHTML = `
            <table id="players-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Team</th>
                        <th>DIV</th>
                        <th>POS</th>
                        <th>BORN</th>
                        <th>Stat</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        fetch(fileName)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const table = document.getElementById('players-table');
                const tbody = table.querySelector('tbody');
                tbody.innerHTML = ''; // Clear existing rows
                rows.forEach((row, index) => {
                    if (index > 0 && row.length > 1) { // Skip header row and empty rows
                        const tr = document.createElement('tr');
                        row.forEach(cell => {
                            const td = document.createElement('td');
                            td.textContent = cell;
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    }
                });
                addSorting();
            })
            .catch(error => console.error('Error loading table:', error));
    };

    const addSorting = () => {
        const table = document.getElementById('players-table');
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const isAscending = header.classList.contains('asc');
                rows.sort((rowA, rowB) => {
                    const cellA = rowA.children[index].textContent;
                    const cellB = rowB.children[index].textContent;
                    if (isNaN(cellA) || isNaN(cellB)) {
                        return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                    }
                    return isAscending ? cellA - cellB : cellB - cellA;
                });
                rows.forEach(row => table.querySelector('tbody').appendChild(row));
                headers.forEach(h => h.classList.remove('asc', 'desc'));
                header.classList.toggle('asc', !isAscending);
                header.classList.toggle('desc', isAscending);
            });
        });
    };

    const applyFilters = () => {
        const leagueSelect = document.getElementById('league');
        const divisionSelect = document.getElementById('division');
        const positionSelect = document.getElementById('position');
        const statsTypeSelect = document.getElementById('stats-type');

        leagueSelect.addEventListener('change', (e) => {
            filters.league = e.target.value;
            updateTable();
        });

        divisionSelect.addEventListener('change', (e) => {
            filters.division = e.target.value;
            updateTable();
        });

        positionSelect.addEventListener('change', (e) => {
            filters.position = e.target.value;
            updateTable();
        });

        statsTypeSelect.addEventListener('change', (e) => {
            filters.statsType = e.target.value;
            updateTable();
        });

        updateTable(); // Initial load
    };

    applyFilters();
});
