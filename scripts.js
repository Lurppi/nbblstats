document.addEventListener('DOMContentLoaded', function() {
    // CSV-Dateipfade auf GitHub
    const files = {
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
        'per-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-regular.csv',
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

    function loadTable(id, url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const table = document.getElementById(id);
                const rows = data.split('\n').map(row => row.split(','));
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                rows.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    row.forEach((cell) => {
                        const td = document.createElement(index === 0 ? 'th' : 'td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    (index === 0 ? thead : tbody).appendChild(tr);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
            })
            .catch(error => console.error('Error loading table data:', error));
    }

    // Tabellen auf der Home-Seite laden
    Object.keys(files).forEach(key => {
        if (document.getElementById(key)) {
            loadTable(key, files[key]);
        }
    });

    // Filter für die Players-Seite
    const leagueFilter = document.getElementById('league-filter');
    const statTypeFilter = document.getElementById('stat-type-filter');
    const divisionFilter = document.getElementById('division-filter');
    const positionFilter = document.getElementById('position-filter');
    const yearFilter = document.getElementById('year-filter');
    const gamesPlayedFilter = document.getElementById('games-played-filter');
    const minutesPlayedFilter = document.getElementById('minutes-played-filter');
    const teamFilter = document.getElementById('team-filter');

    function loadFilteredTable() {
        const league = leagueFilter.value;
        const statType = statTypeFilter.value;

        const url = files[`regular-${statType}`];
        if (url) {
            loadTable('regular-totals', url);
        }
    }

    leagueFilter.addEventListener('change', loadFilteredTable);
    statTypeFilter.addEventListener('change', loadFilteredTable);
});
