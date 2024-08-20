document.addEventListener('DOMContentLoaded', function () {
    // Helper function to fetch CSV data from the correct GitHub URL
    async function fetchCSV(fileName) {
        const url = `https://raw.githubusercontent.com/Lurppi/nbblstats/main/${fileName}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch ${fileName}`);
            return [];
        }
        const text = await response.text();
        const rows = text.trim().split('\n').map(row => row.split(','));
        const headers = rows[0];
        return rows.slice(1).map(row => {
            return headers.reduce((acc, header, i) => {
                acc[header.trim()] = row[i].trim();
                return acc;
            }, {});
        });
    }

    // Function to render tables on index.html
    async function renderIndexTables() {
        const files = {
            'Weekly Points': 'points-week.csv',
            'Weekly Rebounds': 'rebounds-week.csv',
            'Weekly Assists': 'assists-week.csv',
            'Weekly Steals': 'steals-week.csv',
            'Weekly Blocks': 'blocks-week.csv',
            'Weekly PER': 'per-week.csv',
            'Season Points': 'points-regular.csv',
            'Season Rebounds': 'rebounds-regular.csv',
            'Season Assists': 'assists-regular.csv',
            'Season Steals': 'steals-regular.csv',
            'Season Blocks': 'blocks-regular.csv',
            'Season PER': 'per-regular.csv',
        };

        const weeklyContainer = document.getElementById('weekly-tables');
        const seasonContainer = document.getElementById('season-tables');

        for (const [title, file] of Object.entries(files)) {
            const data = await fetchCSV(file);
            const top3 = data.slice(0, 3);

            const table = document.createElement('table');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = Object.keys(top3[0]).map(key => `<th>${key}</th>`).join('');
            table.appendChild(headerRow);

            top3.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = Object.values(row).map(value => `<td>${value}</td>`).join('');
                table.appendChild(tr);
            });

            const section = title.includes('Weekly') ? weeklyContainer : seasonContainer;
            section.appendChild(table);
        }
    }

    // Function to render player tables on players.html
    async function renderPlayerTables() {
        const league = document.getElementById('league').value;
        const statsType = document.getElementById('stats-type').value;
        const fileName = `${league}-${statsType}.csv`;
        const data = await fetchCSV(fileName);

        // Filtering logic
        const filters = {
            division: document.getElementById('division').value,
            team: document.getElementById('team').value,
            position: document.getElementById('position').value,
            yearOfBirth: document.getElementById('year-of-birth').value,
            gamesPlayed: document.getElementById('games-played').value,
            minutesPlayed: document.getElementById('minutes-played').value,
        };

        const filteredData = data.filter(row => {
            return (filters.division === 'All' || row.DIV === filters.division) &&
                   (filters.team === 'All' || row.TEAM === filters.team) &&
                   (filters.position === 'All' || row.POS === filters.position) &&
                   (filters.yearOfBirth === '' || row.BORN === filters.yearOfBirth) &&
                   (filters.gamesPlayed === '' || parseInt(row.GP, 10) >= parseInt(filters.gamesPlayed, 10)) &&
                   (filters.minutesPlayed === '' || parseInt(row.MIN, 10) >= parseInt(filters.minutesPlayed, 10));
        });

        // Update filter options
        function updateFilterOptions() {
            const uniqueValues = (array, key) => [...new Set(array.map(item => item[key]))];
            const divOptions = ['All', ...uniqueValues(data, 'DIV')];
            const teamOptions = ['All', ...uniqueValues(data, 'TEAM')].sort();
            const posOptions = ['All', ...uniqueValues(data, 'POS')];
            const yearOptions = ['All', ...uniqueValues(data, 'BORN')];

            const filtersMap = {
                'division': divOptions,
                'team': teamOptions,
                'position': posOptions,
                'year-of-birth': yearOptions
            };

            Object.keys(filtersMap).forEach(filterId => {
                const select = document.getElementById(filterId);
                select.innerHTML = filtersMap[filterId].map(value => `<option value="${value}">${value}</option>`).join('');
            });
        }
        updateFilterOptions();

        // Render player table
        const playerTablesContainer = document.getElementById('player-tables');
        playerTablesContainer.innerHTML = ''; // Clear previous tables

        const table = document.createElement('table');
        const headers = Object.keys(filteredData[0] || {}).map(key => `<th>${key}</th>`).join('');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = headers;
        table.appendChild(headerRow);

        filteredData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = Object.values(row).map(value => `<td>${value}</td>`).join('');
            table.appendChild(tr);
        });

        playerTablesContainer.appendChild(table);
    }

    // Event listeners for filter changes
    document.getElementById('filter-form').addEventListener('change', renderPlayerTables);

    // Initial rendering based on page
    if (document.body.classList.contains('home-page')) {
        renderIndexTables();
    } else if (document.body.classList.contains('players-page')) {
        renderPlayerTables();
    }
});
