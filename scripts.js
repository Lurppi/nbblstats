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
        const rows = text.trim().split('\n').map(row => row.split(';'));
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
        const league = document.getElementById('league').value.toLowerCase();
        const statsType = document.getElementById('stats-type').value.toLowerCase();
        const fileName = `${league}-${statsType}.csv`;
        const data = await fetchCSV(fileName);

        // Populating filter options dynamically
        const divisions = [...new Set(data.map(row => row.DIV))];
        const teams = [...new Set(data.map(row => row.TEAM))];
        const positions = [...new Set(data.map(row => row.POS))];
        const yearsOfBirth = [...new Set(data.map(row => row.BORN))];

        populateSelect('division', divisions);
        populateSelect('team', teams);
        populateSelect('position', positions);
        populateSelect('year-of-birth', yearsOfBirth);

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
                   (filters.gamesPlayed === '' || parseInt(row.GP) >= parseInt(filters.gamesPlayed)) &&
                   (filters.minutesPlayed === '' || parseInt(row.MIN) >= parseInt(filters.minutesPlayed));
        });

        renderTable(filteredData);
    }

    function populateSelect(id, options) {
        const select = document.getElementById(id);
        select.innerHTML = `<option value="All">All</option>`;
        options.forEach(option => {
            select.innerHTML += `<option value="${option}">${option}</option>`;
        });
    }

    function renderTable(data) {
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = Object.keys(data[0]).map(key => `<th>${key}</th>`).join('');
        table.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = Object.values(row).map(value => `<td>${value}</td>`).join('');
            table.appendChild(tr);
        });

        tableContainer.appendChild(table);
    }

    // Initial load for index.html
    if (document.getElementById('weekly-tables') && document.getElementById('season-tables')) {
        renderIndexTables();
    }

    // Event listeners for players.html
    if (document.getElementById('league') && document.getElementById('stats-type')) {
        document.getElementById('league').addEventListener('change', renderPlayerTables);
        document.getElementById('stats-type').addEventListener('change', renderPlayerTables);
        document.getElementById('division').addEventListener('change', renderPlayerTables);
        document.getElementById('team').addEventListener('change', renderPlayerTables);
        document.getElementById('position').addEventListener('change', renderPlayerTables);
        document.getElementById('year-of-birth').addEventListener('input', renderPlayerTables);
        document.getElementById('games-played').addEventListener('input', renderPlayerTables);
        document.getElementById('minutes-played').addEventListener('input', renderPlayerTables);

        renderPlayerTables();
    }
});
