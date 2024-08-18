document.addEventListener('DOMContentLoaded', function() {
    // Home page tables
    if (document.querySelector('#points-week-table')) {
        loadTable('points-week.csv', 'points-week-table');
        loadTable('rebounds-week.csv', 'rebounds-week-table');
        loadTable('assists-week.csv', 'assists-week-table');
        loadTable('steals-week.csv', 'steals-week-table');
        loadTable('blocks-week.csv', 'blocks-week-table');
        loadTable('per-week.csv', 'per-week-table');

        loadTable('points-regular.csv', 'points-regular-table');
        loadTable('rebounds-regular.csv', 'rebounds-regular-table');
        loadTable('assists-regular.csv', 'assists-regular-table');
        loadTable('steals-regular.csv', 'steals-regular-table');
        loadTable('blocks-regular.csv', 'blocks-regular-table');
        loadTable('per-regular.csv', 'per-regular-table');
    }

    // Players page
    if (document.querySelector('#players-tables')) {
        const leagueFilter = document.querySelector('#league-filter');
        const divisionFilter = document.querySelector('#division-filter');
        const positionFilter = document.querySelector('#position-filter');
        const yearFilter = document.querySelector('#year-filter');
        const gamesFilter = document.querySelector('#games-filter');
        const minutesFilter = document.querySelector('#minutes-filter');
        const statTypeFilter = document.querySelector('#stat-type-filter');

        const filters = [
            leagueFilter, divisionFilter, positionFilter, yearFilter, gamesFilter, minutesFilter, statTypeFilter
        ];

        filters.forEach(filter => {
            filter.addEventListener('change', function() {
                loadPlayerTables(leagueFilter.value, statTypeFilter.value);
            });
        });

        loadPlayerTables(leagueFilter.value, statTypeFilter.value); // Load initial data
    }
});

function loadTable(csvFileName, tableId) {
    Papa.parse(csvFileName, {
        download: true,
        header: true,
        complete: function(results) {
            const table = document.querySelector(`#${tableId} tbody`);
            table.innerHTML = '';
            const top3 = results.data.slice(0, 3);
            top3.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.Name}</td>
                    <td>${row.Team}</td>
                    <td>${row.Stat}</td>
                `;
                table.appendChild(tr);
            });
        }
    });
}

function loadPlayerTables(league, statType) {
    const playersTables = document.querySelector('#players-tables');
    playersTables.innerHTML = ''; // Clear existing tables

    let csvFileName;
    if (league === "Regular Season") {
        csvFileName = `Regular_${statType}.csv`;
    } else {
        csvFileName = `Playoffs_${statType}.csv`;
    }

    Papa.parse(csvFileName, {
        download: true,
        header: true,
        complete: function(results) {
            const tableWrapper = document.createElement('div');
            tableWrapper.classList.add('table-wrapper');
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Team</th>
                        <th>Division</th>
                        <th>Position</th>
                        <th>Year of Birth</th>
                        <th>${statType}</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.data.map(row => `
                        <tr>
                            <td>${row.Name}</td>
                            <td>${row.Team}</td>
                            <td>${row.DIV}</td>
                            <td>${row.POS}</td>
                            <td>${row.BORN}</td>
                            <td>${row[statType]}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            tableWrapper.appendChild(table);
            playersTables.appendChild(tableWrapper);

            applyFilters();
        }
    });
}

function applyFilters() {
    const divisionFilter = document.querySelector('#division-filter').value;
    const positionFilter = document.querySelector('#position-filter').value;
    const yearFilter = document.querySelector('#year-filter').value;
    const gamesFilter = document.querySelector('#games-filter').value;
    const minutesFilter = document.querySelector('#minutes-filter').value;

    const rows = document.querySelectorAll('#players-tables tbody tr');
    rows.forEach(row => {
        let showRow = true;

        if (divisionFilter !== "Both" && row.cells[2].textContent !== divisionFilter) {
            showRow = false;
        }

        if (positionFilter !== "All" && row.cells[3].textContent !== positionFilter) {
            showRow = false;
        }

        if (yearFilter && row.cells[4].textContent !== yearFilter) {
            showRow = false;
        }

        if (gamesFilter && row.cells[5].textContent < gamesFilter) {
            showRow = false;
        }

        if (minutesFilter && row.cells[6].textContent < minutesFilter) {
            showRow = false;
        }

        row.style.display = showRow ? '' : 'none';
    });
}
