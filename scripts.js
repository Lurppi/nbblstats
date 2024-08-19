document.addEventListener('DOMContentLoaded', function() {
    // URLs für CSV-Dateien auf der Home-Seite
    const homeCsvUrls = {
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
        'per-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-regular.csv'
    };

    // Funktion zum Laden und Anzeigen der Top 3 Performer
    function loadTop3(id, url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const table = document.getElementById(id);
                const rows = data.split('\n').map(row => row.split(';'));
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                const uniqueRows = new Set(); // Verfolgt einzigartige Zeilen

                rows.slice(0, 4).forEach((row, index) => {
                    if (!uniqueRows.has(row.join(';'))) {
                        uniqueRows.add(row.join(';'));
                        const tr = document.createElement('tr');
                        row.forEach(cell => {
                            const element = document.createElement(index === 0 ? 'th' : 'td');
                            element.textContent = cell;
                            tr.appendChild(element);
                        });
                        (index === 0 ? thead : tbody).appendChild(tr);
                    }
                });

                table.appendChild(thead);
                table.appendChild(tbody);
            })
            .catch(error => console.error('Fehler beim Laden der Tabellendaten:', error));
    }

    // CSV-Dateien für die Players-Seite
    const playersCsvUrls = {
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
        'regular-fourfactors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_FourFactors.csv',
        'playoffs-fourfactors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_FourFactors.csv'
    };

    function populateTeamFilter(teams) {
        const teamFilter = document.getElementById('team-filter');
        teamFilter.innerHTML = '';

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilter.appendChild(option);
        });
    }

    function updateTeamsBasedOnFilter() {
        const league = document.getElementById('league-filter').value;
        const statType = document.getElementById('stat-type-filter').value;
        const division = document.getElementById('division-filter').value;
        
        const key = `${league}-${statType}`.toLowerCase();
        const url = playersCsvUrls[key];

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(';'));
                const teams = new Set();

                rows.slice(1).forEach(row => {
                    const rowDivision = row[1]; // Annahme: Division ist in Spalte 2
                    const team = row[2]; // Annahme: Team ist in Spalte 3

                    if (division === 'both' || rowDivision === division) {
                        teams.add(team);
                    }
                });

                populateTeamFilter(Array.from(teams).sort());
            })
            .catch(error => console.error('Fehler beim Laden der Teamdaten:', error));
    }

    function loadPlayerStats() {
        // Logik zum Laden und Anzeigen der Spielerstatistiken basierend auf den Filtern
    }

    // Event-Listener für Filteränderungen
    document.getElementById('league-filter').addEventListener('change', updateTeamsBasedOnFilter);
    document.getElementById('stat-type-filter').addEventListener('change', updateTeamsBasedOnFilter);
    document.getElementById('division-filter').addEventListener('change', updateTeamsBasedOnFilter);

    // Laden der Top 3 Performer für die Home-Seite
    for (const [id, url] of Object.entries(homeCsvUrls)) {
        loadTop3(id, url);
    }

    // Initiales Laden der Teams basierend auf den Standardfiltern
    updateTeamsBasedOnFilter();
});
