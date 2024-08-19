document.addEventListener("DOMContentLoaded", function () {
    const leagueFilter = document.getElementById("league-filter");
    const statsTypeFilter = document.getElementById("stats-type-filter");
    const divisionFilter = document.getElementById("division-filter");
    const positionFilter = document.getElementById("position-filter");
    const bornFilter = document.getElementById("born-filter");
    const gamesPlayedFilter = document.getElementById("games-played-filter");
    const minutesPlayedFilter = document.getElementById("minutes-played-filter");
    const tableContainer = document.getElementById("table-container");

    const fileMapping = {
        'regular': {
            'totals': 'regular_totals.csv',
            'averages': 'regular_averages.csv',
            'shooting': 'regular_shooting.csv',
            'advanced1': 'regular_advanced1.csv',
            'advanced2': 'regular_advanced2.csv',
            'fourfactors': 'regular_fourfactors.csv'
        },
        'playoffs': {
            'totals': 'playoffs_totals.csv',
            'averages': 'playoffs_averages.csv',
            'shooting': 'playoffs_shooting.csv',
            'advanced1': 'playoffs_advanced1.csv',
            'advanced2': 'playoffs_advanced2.csv',
            'fourfactors': 'playoffs_fourfactors.csv'
        }
    };

    function loadTable() {
        const league = leagueFilter.value;
        const statsType = statsTypeFilter.value;
        const division = divisionFilter.value;
        const position = positionFilter.value;
        const born = bornFilter.value;
        const gamesPlayed = gamesPlayedFilter.value;
        const minutesPlayed = minutesPlayedFilter.value;

        const fileName = fileMapping[league][statsType];

        fetch(fileName)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(';'));
                const headers = rows[0];
                let filteredRows = rows.slice(1);

                // Division filter
                if (division !== "both") {
                    filteredRows = filteredRows.filter(row => row[headers.indexOf("DIV")] === division);
                }

                // Position filter
                if (position !== "all") {
                    filteredRows = filteredRows.filter(row => row[headers.indexOf("POS")] === position);
                }

                // Year of Birth filter
                if (born) {
                    filteredRows = filteredRows.filter(row => parseInt(row[headers.indexOf("BORN")]) >= parseInt(born));
                }

                // Games Played filter
                if (gamesPlayed) {
                    filteredRows = filteredRows.filter(row => parseInt(row[headers.indexOf("GP")]) >= parseInt(gamesPlayed));
                }

                // Minutes Played filter
                if (minutesPlayed) {
                    filteredRows = filteredRows.filter(row => parseInt(row[headers.indexOf("MP")]) >= parseInt(minutesPlayed));
                }

                const tableHTML = `
                    <table>
                        <thead>
                            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${filteredRows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>
                `;

                tableContainer.innerHTML = tableHTML;

                // Sortierfunktion für jede Spalte aktivieren
                document.querySelectorAll('th').forEach((header, index) => {
                    header.addEventListener('click', () => {
                        const sortedRows = filteredRows.sort((a, b) => {
                            const cellA = a[index];
                            const cellB = b[index];
                            return isNaN(cellA) ? cellA.localeCompare(cellB) : cellA - cellB;
                        });
                        tableContainer.innerHTML = `
                            <table>
                                <thead>
                                    <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                                </thead>
                                <tbody>
                                    ${sortedRows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                                </tbody>
                            </table>
                        `;
                    });
                });
            })
            .catch(error => console.error('Error loading the table data:', error));
    }

    leagueFilter.addEventListener("change", loadTable);
    statsTypeFilter.addEventListener("change", loadTable);
    divisionFilter.addEventListener("change", loadTable);
    positionFilter.addEventListener("change", loadTable);
    bornFilter.addEventListener("input", loadTable);
    gamesPlayedFilter.addEventListener("input", loadTable);
    minutesPlayedFilter.addEventListener("input", loadTable);

    loadTable();
});
