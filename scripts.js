document.addEventListener('DOMContentLoaded', () => {
    function loadCSV(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parsedData = Papa.parse(data, { header: true }).data;
                callback(parsedData);
            });
    }

    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    function filterHome() {
        const fileMapping = {
            'top-performers-points': 'data/top-performers-points.csv',
            'top-performers-rebounds': 'data/top-performers-rebounds.csv',
            'top-performers-assists': 'data/top-performers-assists.csv',
            'top-performers-steals': 'data/top-performers-steals.csv',
            'top-performers-blocks': 'data/top-performers-blocks.csv',
            'top-performers-per': 'data/top-performers-per.csv',
            'season-top-performers-points': 'data/regular-season-top-performers-points.csv',
            'season-top-performers-rebounds': 'data/regular-season-top-performers-rebounds.csv',
            'season-top-performers-assists': 'data/regular-season-top-performers-assists.csv'
        };

        for (const [id, url] of Object.entries(fileMapping)) {
            loadCSV(url, data => {
                populateTable(id, data);
            });
        }
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

    document.getElementById('division-filter').addEventListener('change', () => {
        filterTeams();
        filterPlayers();
    });
    document.getElementById('league-filter').addEventListener('change', () => {
        filterTeams();
        filterPlayers();
    });
    document.getElementById('stats-type-filter').addEventListener('change', () => {
        filterHome();
        filterTeams();
        filterPlayers();
    });
    document.getElementById('position-filter').addEventListener('change', filterPlayers);
    document.getElementById('birth-year-filter').addEventListener('change', filterPlayers);

    // Initial Load
    filterHome();
    filterTeams();
    filterPlayers();
});
