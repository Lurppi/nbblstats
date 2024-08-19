document.addEventListener('DOMContentLoaded', function() {
    const files = {
        'points-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/points-week.csv',
        'rebounds-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/rebounds-week.csv',
        'assists-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/assists-week.csv',
        'steals-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/steals-week.csv',
        'blocks-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/blocks-week.csv',
        'per-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-week.csv',
        'points-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/points-regular.csv',
        'rebounds-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/rebounds-regular.csv',
        'assists-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/assists-regular.csv',
        'steals-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/steals-regular.csv',
        'blocks-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/blocks-regular.csv',
        'per-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-regular.csv',
        'regular-totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Totals.csv',
        'playoffs-totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Totals.csv',
        'regular-averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Averages.csv',
        'playoffs-averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Averages.csv',
        'regular-shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Shooting.csv',
        'playoffs-shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Shooting.csv',
        'regular-advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced1.csv',
        'playoffs-advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced1.csv',
        'regular-advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced2.csv',
        'playoffs-advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced2.csv',
        'regular-fourfactors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Four_Factors.csv',
        'playoffs-fourfactors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Four_Factors.csv'
    };

    function loadTable(id, url, limit) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const table = document.getElementById(id);
                const rows = data.split('\n').map(row => row.split(','));
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                rows.slice(0, limit).forEach((row, index) => {
                    const tr = document.createElement('tr');
                    row.forEach((cell, cellIndex) => {
                        const td = document.createElement(index === 0 ? 'th' : 'td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    (index === 0 ? thead : tbody).appendChild(tr);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
            })
            .catch(error => console.error('Error loading table data:', error));
    }

    function loadFilteredTable() {
        const league = document.getElementById('league-filter').value;
        const statType = document.getElementById('stat-type-filter').value;
        const url = files[`${league}-${statType}`];

        if (url) {
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    const tableContainer = document.getElementById('players-tables');
                    tableContainer.innerHTML = '';
                    const rows = data.split('\n').map(row => row.split(','));
                    const thead = document.createElement('thead');
                    const tbody = document.createElement('tbody');

                    rows.forEach((row, index) => {
                        if (index === 0) {
                            row.forEach((cell, cellIndex) => {
                                const th = document.createElement('th');
                                th.textContent = cell;
                                th.addEventListener('click', () => sortTable(thead, tbody, cellIndex));
                                thead.appendChild(th);
                            });
                        } else {
                            const tr = document.createElement('tr');
                            row.forEach((cell) => {
                                const td = document.createElement('td');
                                td.textContent = cell;
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                        }
                    });

                    const table = document.createElement('table');
                    table.appendChild(thead);
                    table.appendChild(tbody);
                    tableContainer.appendChild(table);
                })
                .catch(error => console.error('Error loading table data:', error));
        }
    }

    function sortTable(thead, tbody, columnIndex) {
        const rows = Array.from(tbody.rows);
        const isAscending = thead.rows[0].cells[columnIndex].classList.contains('sort-asc');

        rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        rows.forEach(row => tbody.appendChild(row));
        thead.rows[0].cells[columnIndex].classList.toggle('sort-asc', !isAscending);
        thead.rows[0].cells[columnIndex].classList.toggle('sort-desc', isAscending);
    }

    function populateTeamFilter() {
        const teamFilter = document.getElementById('team-filter');
        fetch(files['regular-totals'])
            .then(response => response.text())
            .then(data => {
                const teams = new Set(data.split('\n').slice(1).map(row => row.split(',')[2]));
                teams.forEach(team => {
                    const option = document.createElement('option');
                    option.value = team;
                    option.textContent = team;
                    teamFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading teams:', error));
    }

    // Initial load
    document.getElementById('league-filter').value = 'regular';
    document.getElementById('stat-type-filter').value = 'totals';
    loadFilteredTable();
    populateTeamFilter();

    document.getElementById('league-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('stat-type-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('division-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('team-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('position-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('year-filter').addEventListener('input', loadFilteredTable);
    document.getElementById('games-played-filter').addEventListener('input', loadFilteredTable);
    document.getElementById('minutes-played-filter').addEventListener('input', loadFilteredTable);
});
