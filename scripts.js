document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/';
    const FILES = {
        pointsWeek: 'points-week.csv',
        reboundsWeek: 'rebounds-week.csv',
        assistsWeek: 'assists-week.csv',
        stealsWeek: 'steals-week.csv',
        blocksWeek: 'blocks-week.csv',
        perWeek: 'per-week.csv',
        pointsRegular: 'points-regular.csv',
        reboundsRegular: 'rebounds-regular.csv',
        assistsRegular: 'assists-regular.csv',
        stealsRegular: 'steals-regular.csv',
        blocksRegular: 'blocks-regular.csv',
        perRegular: 'per-regular.csv',
        regularTotals: 'Regular_Totals.csv',
        regularAverages: 'Regular_Averages.csv',
        regularShooting: 'Regular_Shooting.csv',
        regularAdvanced1: 'Regular_Advanced1.csv',
        regularAdvanced2: 'Regular_Advanced2.csv',
        regularFourFactors: 'Regular_Four_Factors.csv',
        playoffsTotals: 'Playoffs_Totals.csv',
        playoffsAverages: 'Playoffs_Averages.csv',
        playoffsShooting: 'Playoffs_Shooting.csv',
        playoffsAdvanced1: 'Playoffs_Advanced1.csv',
        playoffsAdvanced2: 'Playoffs_Advanced2.csv',
        playoffsFourFactors: 'Playoffs_Four_Factors.csv'
    };

    // Function to fetch CSV data and convert it to table
    async function fetchAndDisplayData(url, tableId) {
        try {
            const response = await fetch(url);
            const data = await response.text();
            const rows = data.split('\n').filter(row => row.trim() !== '');
            const table = document.getElementById(tableId);
            let html = '<thead><tr>';
            const headers = rows[0].split(';');
            headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
            html += '</tr></thead><tbody>';
            rows.slice(1, 4).forEach(row => {
                const columns = row.split(';');
                html += '<tr>';
                columns.forEach(col => {
                    html += `<td>${col}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody>';
            table.innerHTML = html;
        } catch (error) {
            console.error('Error fetching or displaying data:', error);
        }
    }

    // Load data for index.html
    const tables = [
        { file: FILES.pointsWeek, id: 'points-week' },
        { file: FILES.reboundsWeek, id: 'rebounds-week' },
        { file: FILES.assistsWeek, id: 'assists-week' },
        { file: FILES.stealsWeek, id: 'steals-week' },
        { file: FILES.blocksWeek, id: 'blocks-week' },
        { file: FILES.perWeek, id: 'per-week' },
        { file: FILES.pointsRegular, id: 'points-regular' },
        { file: FILES.reboundsRegular, id: 'rebounds-regular' },
        { file: FILES.assistsRegular, id: 'assists-regular' },
        { file: FILES.stealsRegular, id: 'steals-regular' },
        { file: FILES.blocksRegular, id: 'blocks-regular' },
        { file: FILES.perRegular, id: 'per-regular' }
    ];

    // Load all tables
    tables.forEach(table => fetchAndDisplayData(`${BASE_URL}${table.file}`, table.id));

    // Filter logic for players.html
    function updateFilters() {
        const league = document.getElementById('league').value;
        const statsType = document.getElementById('statsType').value;
        const file = FILES[`${league}${statsType}`] || '';

        fetchAndDisplayData(`${BASE_URL}${file}`, 'regular-totals');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'regular-averages');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'regular-shooting');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'regular-advanced1');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'regular-advanced2');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'regular-fourfactors');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'playoffs-totals');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'playoffs-averages');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'playoffs-shooting');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'playoffs-advanced1');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'playoffs-advanced2');
        fetchAndDisplayData(`${BASE_URL}${file}`, 'playoffs-fourfactors');
    }

    document.getElementById('league').addEventListener('change', updateFilters);
    document.getElementById('statsType').addEventListener('change', updateFilters);

    // Initial load for Players Page
    updateFilters();
});
