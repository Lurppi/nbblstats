document.addEventListener('DOMContentLoaded', function() {

    // Teams-Seite
    const csvFilesTeams = {
        totals: 'data/teams_totals.csv',
        averages: 'data/teams_averages.csv',
        shooting: 'data/teams_shooting.csv',
        advanced: 'data/teams_advanced.csv',
        fourFactors: 'data/teams_four_factors.csv'
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
            team: row[0],
            division: row[1],
            league: row[2],
            stat1: row[3],
            stat2: row[4],
            stat3: row[5]
        }));
    }

    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.team}</td><td>${row.division}</td><td>${row.league}</td><td>${row.stat1}</td><td>${row.stat2}</td><td>${row.stat3}</td>`;
            tbody.appendChild(tr);
        });
    }

    function updateTeamsTable() {
        const statType = document.getElementById('stat-type').value;
        const filePath = csvFilesTeams[statType];
        loadCSV(filePath, data => populateTable('teams-table', data));
    }

    document.getElementById('stat-type').addEventListener('change', updateTeamsTable);
    updateTeamsTable();  // Initial load

    // Players-Seite
    const csvFilesPlayers = {
        totals: 'data/players_totals.csv',
        averages: 'data/players_averages.csv',
        shooting: 'data/players_shooting.csv',
        advanced1: 'data/players_advanced1.csv',
        advanced2: 'data/players_advanced2.csv',
        fourFactors: 'data/players_four_factors.csv'
    };

    function updatePlayersTable() {
        const statType = document.getElementById('stat-type').value;
        const filePath = csvFilesPlayers[statType];
        loadCSV(filePath, data => populateTable('players-table', data));
    }

    document.getElementById('stat-type').addEventListener('change', updatePlayersTable);
    document.getElementById('division').addEventListener('change', updatePlayersTable);
    document.getElementById('league').addEventListener('change', updatePlayersTable);
    document.getElementById('position').addEventListener('change', updatePlayersTable);
    document.getElementById('birth-year').addEventListener('change', updatePlayersTable);
    updatePlayersTable();  // Initial load

    // Roster-Seite
    const csvFilesRoster = {
        roster: 'data/roster.csv'
    };

    function updateRosterTable() {
        loadCSV(csvFilesRoster.roster, data => populateTable('roster-table', data));
    }

    updateRosterTable();  // Initial load

});
