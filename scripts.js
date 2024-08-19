document.addEventListener('DOMContentLoaded', function() {
    // Home-Seite
    const csvUrls = {
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
        'per-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-regular.csv'
    };

    function loadTop3(id, url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const table = document.getElementById(id);
                const rows = data.split('\n').map(row => row.split(';'));
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                rows.slice(0, 4).forEach((row, index) => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const element = document.createElement(index === 0 ? 'th' : 'td');
                        element.textContent = cell;
                        tr.appendChild(element);
                    });
                    (index === 0 ? thead : tbody).appendChild(tr);
                });
                table.appendChild(thead);
                table.appendChild(tbody);
            })
            .catch(error => console.error('Error loading table data:', error));
    }

    for (const [id, url] of Object.entries(csvUrls)) {
        loadTop3(id, url);
    }

    // Players-Seite
    const files = {
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

    function loadTable(url, containerId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const tableContainer = document.getElementById(containerId);
                tableContainer.innerHTML = '';
                const rows = data.split('\n').map(row => row.split(';'));
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                rows.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    row.forEach((cell, cellIndex) => {
                        const element = document.createElement(index === 0 ? 'th' : 'td');
                        element.textContent = cell;
                        tr.appendChild(element);
                    });
                    (index === 0 ? thead : tbody).appendChild(tr);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                tableContainer.appendChild(table);
            })
            .catch(error => console.error('Error loading table data:', error));
    }

    function loadFilteredTable() {
        const league = document.getElementById('league-filter').value;
        const statType = document.getElementById('stat-type-filter').value;
        const url = files[`${league}-${statType}`];
        if (url) {
            loadTable(url, 'players-tables');
        }
    }

    function populateFilter(filterId, columnIndex, isTeamFilter = false) {
        const filter = document.getElementById(filterId);
        fetch(files['regular-totals']) // Use any CSV file to get filter data
            .then(response => response.text())
            .then(data => {
                const items = new Set(data.split('\n').slice(1).map(row => row.split(';')[columnIndex]));
                items.forEach(item => {
                    if (item) {
                        const option = document.createElement('option');
                        option.value = item;
                        option.textContent = item;
                        filter.appendChild(option);
                    }
                });

                if (isTeamFilter) {
                    const sortedOptions = Array.from(filter.options).sort((a, b) => a.text.localeCompare(b.text));
                    filter.innerHTML = ''; // Clear existing options
                    sortedOptions.forEach(option => filter.appendChild(option));
                }
            })
            .catch(error => console.error('Error loading filter data:', error));
    }

    // Initial load for Home Page
    for (const [id, url] of Object.entries(csvUrls)) {
        loadTop3(id, url);
    }

    // Initial load for Players Page
    document.getElementById('league-filter').value = 'regular';
    document.getElementById('stat-type-filter').value = 'totals';
    loadFilteredTable();
    populateFilter('division-filter', 0); // Division filter from index 0 of CSV
    populateFilter('position-filter', 1); // Position filter from index 1 of CSV
    populateFilter('team-filter', 2, true); // Team filter from index 2 of CSV and sort

    document.getElementById('league-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('stat-type-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('division-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('team-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('position-filter').addEventListener('change', loadFilteredTable);
    document.getElementById('year-filter').addEventListener('input', loadFilteredTable);
    document.getElementById('games-played-filter').addEventListener('input', loadFilteredTable);
    document.getElementById('minutes-played-filter').addEventListener('input', loadFilteredTable);
});
