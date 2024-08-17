document.addEventListener('DOMContentLoaded', () => {
    // Function to load CSV data and populate table
    function loadCSV(filePath, callback) {
        fetch(filePath)
            .then(response => response.text())
            .then(text => {
                const data = Papa.parse(text, { header: true });
                callback(data.data);
            });
    }

    // Function to populate table with data
    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';  // Clear existing content

        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.keys(row).forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    // Update Home tables with data
    function updateHomeTables() {
        const fileMapping = {
            'top-performers-points': 'data/top-performers-points.csv',
            'top-performers-rebounds': 'data/top-performers-rebounds.csv',
            'top-performers-assists': 'data/top-performers-assists.csv',
            'top-performers-steals': 'data/top-performers-steals.csv',
            'top-performers-blocks': 'data/top-performers-blocks.csv',
            'top-performers-3pm': 'data/top-performers-3pm.csv',
            'season-top-performers-points': 'data/season-top-performers-points.csv',
            'season-top-performers-rebounds': 'data/season-top-performers-rebounds.csv',
            'season-top-performers-assists': 'data/season-top-performers-assists.csv',
            'season-top-performers-steals': 'data/season-top-performers-steals.csv',
            'season-top-performers-blocks': 'data/season-top-performers-blocks.csv',
            'season-top-performers-3pm': 'data/season-top-performers-3pm.csv'
        };

        Object.keys(fileMapping).forEach(tableId => {
            loadCSV(fileMapping[tableId], data => populateTable(tableId, data));
        });
    }

    updateHomeTables();  // Initial load

    // Countdown Timer
    function updateCountdown() {
        const targetDate = new Date('2024-10-13T13:00:00');
        const now = new Date();
        const timeDiff = targetDate - now;

        if (timeDiff <= 0) {
            document.getElementById('countdown').textContent = 'The season has started!';
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        document.getElementById('countdown').textContent =
            `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Function to filter teams
    function filterTeams() {
        const division = document.getElementById('division-filter').value;
        const league = document.getElementById('league-filter').value;
        const statsType = document.getElementById('stats-type-filter').value;

        const fileMapping = {
            'totals': 'data/teams-totals.csv',
            'averages': 'data/teams-averages.csv',
            'shooting': 'data/teams-shooting.csv',
            'advanced': 'data/teams-advanced.csv',
            'four-factors': 'data/teams-four-factors.csv'
        };

        loadCSV(fileMapping[statsType], data => {
            const filteredData = data.filter(row => 
                (division === 'all' || row['Division'] === division) &&
                (league === 'all' || row['League'] === league)
            );
            populateTable('teams-table', filteredData);
        });
    }

    // Function to filter players
    function filterPlayers() {
        const division = document.getElementById('division-filter').value;
        const league = document.getElementById('league-filter').value;
        const position = document.getElementById('position-filter').value;
        const birthYear = document.getElementById('birth-year-filter').value;
        const statsType = document.getElementById('stats-type-filter').value;

        const fileMapping = {
            'totals': 'data/players-totals.csv',
            'averages': 'data/players-averages.csv',
            'shooting': 'data/players-shooting.csv',
            'advanced1': 'data/players-advanced1.csv',
            'advanced2': 'data/players-advanced2.csv',
            'four-factors': 'data/players-four-factors.csv'
        };

        loadCSV(fileMapping[statsType], data => {
            const filteredData = data.filter(row => 
                (division === 'all' || row['Division'] === division) &&
                (league === 'all' || row['League'] === league) &&
                (position === 'all' || row['Position'] === position) &&
                (birthYear === 'all' || row['Birth Year'] === birthYear)
            );
            populateTable('players-table', filteredData);
        });
    }

    document.getElementById('division-filter').addEventListener('change', filterTeams);
    document.getElementById('league-filter').addEventListener('change', filterTeams);
    document.getElementById('stats-type-filter').addEventListener('change', filterTeams);

    document.getElementById('division-filter').addEventListener('change', filterPlayers);
    document.getElementById('league-filter').addEventListener('change', filterPlayers);
    document.getElementById('position-filter').addEventListener('change', filterPlayers);
    document.getElementById('birth-year-filter').addEventListener('change', filterPlayers);
    document.getElementById('stats-type-filter').addEventListener('change', filterPlayers);
});
