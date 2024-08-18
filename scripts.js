document.addEventListener('DOMContentLoaded', function() {
    const tableConfigs = {
        'Regular Season': {
            'Totals': 'Regular_Totals.csv',
            'Averages': 'Regular_Averages.csv',
            'Shooting': 'Regular_Shooting.csv',
            'Advanced1': 'Regular_Advanced1.csv',
            'Advanced2': 'Regular_Advanced2.csv',
            'Four Factors': 'Regular_Four_Factors.csv'
        },
        'Playoffs': {
            'Totals': 'Playoffs_Totals.csv',
            'Averages': 'Playoffs_Averages.csv',
            'Shooting': 'Playoffs_Shooting.csv',
            'Advanced1': 'Playoffs_Advanced1.csv',
            'Advanced2': 'Playoffs_Advanced2.csv',
            'Four Factors': 'Playoffs_Four_Factors.csv'
        }
    };

    const leagueSelect = document.getElementById('league');
    const statsTypeSelect = document.getElementById('stats-type');
    const divisionSelect = document.getElementById('division');
    const positionSelect = document.getElementById('position');
    const birthYearInput = document.getElementById('birth-year');

    function loadTable(fileName) {
        Papa.parse(fileName, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data;
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Create table header
                const headerRow = document.createElement('tr');
                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);

                // Create table rows
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(value => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                document.getElementById('player-tables').innerHTML = '';
                document.getElementById('player-tables').appendChild(table);
                addSorting(table);
            }
        });
    }

    function addSorting(table) {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const isAscending = header.classList.contains('asc');
                rows.sort((a, b) => {
                    const aText = a.children[index].textContent.trim();
                    const bText = b.children[index].textContent.trim();
                    if (isNaN(aText) || isNaN(bText)) {
                        return (aText > bText ? 1 : -1) * (isAscending ? -1 : 1);
                    }
                    return (parseFloat(aText) - parseFloat(bText)) * (isAscending ? -1 : 1);
                });
                const tbody = table.querySelector('tbody');
                tbody.innerHTML = '';
                rows.forEach(row => tbody.appendChild(row));
                header.classList.toggle('asc', !isAscending);
                header.classList.toggle('desc', isAscending);
            });
        });
    }

    function updatePlayersTable() {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const fileName = tableConfigs[league][statsType];
        loadTable(fileName);
    }

    leagueSelect.addEventListener('change', updatePlayersTable);
    statsTypeSelect.addEventListener('change', updatePlayersTable);
    divisionSelect.addEventListener('change', filterPlayers);
    positionSelect.addEventListener('change', filterPlayers);
    birthYearInput.addEventListener('input', filterPlayers);

    function filterPlayers() {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const fileName = tableConfigs[league][statsType];
        Papa.parse(fileName, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data;
                const filteredData = data.filter(row => {
                    const divisionMatch = (divisionSelect.value === 'Both' || row.DIV === divisionSelect.value);
                    const positionMatch = (positionSelect.value === 'Both' || row.POS === positionSelect.value);
                    const yearMatch = (!birthYearInput.value || row.BORN === birthYearInput.value);
                    return divisionMatch && positionMatch && yearMatch;
                });
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Create table header
                const headerRow = document.createElement('tr');
                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);

                // Create table rows
                filteredData.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(value => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                document.getElementById('player-tables').innerHTML = '';
                document.getElementById('player-tables').appendChild(table);
                addSorting(table);
            }
        });
    }

    // Initialize with default filters
    updatePlayersTable();
});
