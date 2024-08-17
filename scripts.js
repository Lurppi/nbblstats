document.addEventListener('DOMContentLoaded', () => {
    const countdownDate = new Date('2024-10-13T13:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeDiff = countdownDate - now;

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

    function loadCSV(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(text => Papa.parse(text, { header: true, skipEmptyLines: true, complete: (results) => callback(results.data) }));
    }

    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

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
