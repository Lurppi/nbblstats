// scripts.js für Home, Teams und Players

document.addEventListener('DOMContentLoaded', function() {
    // Helper function to load CSV files
    function loadCSV(filename, callback) {
        fetch(filename)
            .then(response => response.text())
            .then(data => Papa.parse(data, { header: true, dynamicTyping: true, complete: callback }))
            .catch(error => console.error('Fehler beim Laden der CSV-Datei:', error));
    }

    // Helper function to render tables
    function renderTable(containerId, data, columns) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<table>';
        html += '<thead><tr>';
        columns.forEach(col => html += `<th>${col}</th>`);
        html += '</tr></thead>';
        html += '<tbody>';

        data.forEach(row => {
            html += '<tr>';
            columns.forEach(col => html += `<td>${row[col]}</td>`);
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Functions specific to the Home Page
    function loadHomeTables() {
        const tables = [
            { id: 'points-top-3', file: 'top_3_points.csv', columns: ['Name', 'Team', 'Points'] },
            { id: 'rebounds-top-3', file: 'top_3_rebounds.csv', columns: ['Name', 'Team', 'Rebounds'] },
            { id: 'assists-top-3', file: 'top_3_assists.csv', columns: ['Name', 'Team', 'Assists'] },
            { id: 'steals-top-3', file: 'top_3_steals.csv', columns: ['Name', 'Team', 'Steals'] },
            { id: 'blocks-top-3', file: 'top_3_blocks.csv', columns: ['Name', 'Team', 'Blocks'] },
            { id: 'per-top-3', file: 'top_3_per.csv', columns: ['Name', 'Team', 'PER'] },
            { id: 'points-reg-season', file: 'reg_season_points.csv', columns: ['Name', 'Team', 'Points'] },
            { id: 'rebounds-reg-season', file: 'reg_season_rebounds.csv', columns: ['Name', 'Team', 'Rebounds'] },
            { id: 'assists-reg-season', file: 'reg_season_assists.csv', columns: ['Name', 'Team', 'Assists'] },
            { id: 'steals-reg-season', file: 'reg_season_steals.csv', columns: ['Name', 'Team', 'Steals'] },
            { id: 'blocks-reg-season', file: 'reg_season_blocks.csv', columns: ['Name', 'Team', 'Blocks'] },
            { id: 'per-reg-season', file: 'reg_season_per.csv', columns: ['Name', 'Team', 'PER'] }
        ];

        tables.forEach(table => {
            loadCSV(table.file, results => renderTable(table.id, results.data, table.columns));
        });
    }

    // Functions specific to the Teams Page
    function loadTeamsTable() {
        const filter = document.getElementById('filter') ? document.getElementById('filter').value : 'totals';
        loadCSV(`teams_${filter}.csv`, results => renderTable('teams-table', results.data, ['Team', 'Division', 'League', 'Minutes', 'Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'Turnovers', 'Fouls', 'Efficiency']));
    }

    document.getElementById('filter')?.addEventListener('change', loadTeamsTable);

    // Functions specific to the Players Page
    function loadPlayersTable() {
        const filter = document.getElementById('stats-type') ? document.getElementById('stats-type').value : 'totals';
        loadCSV(`players_${filter}.csv`, results => renderTable('players-table', results.data, ['Player', 'Position', 'BirthYear', 'Minutes', 'Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'Turnovers', 'Fouls', 'Efficiency', 'DD', 'TD']));
    }

    document.getElementById('stats-type')?.addEventListener('change', loadPlayersTable);

    // Countdown Timer
    function updateCountdown() {
        const countdownDate = new Date('2024-10-13T13:00:00').getTime();
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerHTML =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById('countdown').innerHTML = "Saison gestartet!";
        }
    }

    const interval = setInterval(updateCountdown, 1000);

    // Initial load for Home page
    if (document.body.classList.contains('home')) {
        loadHomeTables();
    }

    // Initial load for Teams page
    if (document.body.classList.contains('teams')) {
        loadTeamsTable();
    }

    // Initial load for Players page
    if (document.body.classList.contains('players')) {
        loadPlayersTable();
    }
});
