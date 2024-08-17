document.addEventListener('DOMContentLoaded', function() {

    const csvFilesHome = {
        weekPoints: 'data/week_points.csv',
        weekRebounds: 'data/week_rebounds.csv',
        weekAssists: 'data/week_assists.csv',
        weekSteals: 'data/week_steals.csv',
        weekBlocks: 'data/week_blocks.csv',
        week3PM: 'data/week_3pm.csv',
        seasonPoints: 'data/season_points.csv',
        seasonRebounds: 'data/season_rebounds.csv',
        seasonAssists: 'data/season_assists.csv',
        seasonSteals: 'data/season_steals.csv',
        seasonBlocks: 'data/season_blocks.csv',
        season3PM: 'data/season_3pm.csv'
    };

    function loadCSV(filePath, callback) {
        fetch(filePath)
            .then(response => response.text())
            .then(text => callback(parseCSV(text)))
            .catch(error => console.error('Error loading CSV:', error));
    }

    function parseCSV(text) {
        const rows = text.split('\n').map(row => row.split(','));
        return rows.slice(1).map(row => ({
            name: row[0],
            team: row[1],
            stat: row[2]
        }));
    }

    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.name}</td><td>${row.team}</td><td>${row.stat}</td>`;
            tbody.appendChild(tr);
        });
    }

    function updateHomeTables() {
        const tableIds = [
            'top-performers-points', 'top-performers-rebounds', 'top-performers-assists',
            'top-performers-steals', 'top-performers-blocks', 'top-performers-3pm',
            'season-top-performers-points', 'season-top-performers-rebounds', 'season-top-performers-assists',
            'season-top-performers-steals', 'season-top-performers-blocks', 'season-top-performers-3pm'
        ];
        
        const fileMapping = {
            'top-performers-points': csvFilesHome.weekPoints,
            'top-performers-rebounds': csvFilesHome.weekRebounds,
            'top-performers-assists': csvFilesHome.weekAssists,
            'top-performers-steals': csvFilesHome.weekSteals,
            'top-performers-blocks': csvFilesHome.weekBlocks,
            'top-performers-3pm': csvFilesHome.week3PM,
            'season-top-performers-points': csvFilesHome.seasonPoints,
            'season-top-performers-rebounds': csvFilesHome.seasonRebounds,
            'season-top-performers-assists': csvFilesHome.seasonAssists,
            'season-top-performers-steals': csvFilesHome.seasonSteals,
            'season-top-performers-blocks': csvFilesHome.seasonBlocks,
            'season-top-performers-3pm': csvFilesHome.season3PM
        };

        tableIds.forEach(tableId => {
            const filePath = fileMapping[tableId];
            loadCSV(filePath, data => populateTable(tableId, data));
        });
    }

    updateHomeTables();  // Initial load

    // Countdown Timer
    function updateCountdown() {
        const targetDate = new Date('2024-10-13T13:00:00');
        const now = new Date();
        const timeDiff = targetDate - now;

        if (timeDiff <= 0) {
            document.getElementById('countdown').innerHTML = 'Season Starts Now!';
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);  // Update countdown every second

});
