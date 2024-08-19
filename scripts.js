document.addEventListener("DOMContentLoaded", function () {
    const leagueFilter = document.getElementById("league-filter");
    const statsTypeFilter = document.getElementById("stats-type-filter");
    const divisionFilter = document.getElementById("division-filter");
    const positionFilter = document.getElementById("position-filter");
    const bornFilter = document.getElementById("born-filter");
    const gamesPlayedFilter = document.getElementById("games-played-filter");
    const minutesPlayedFilter = document.getElementById("minutes-played-filter");
    const tableContainer = document.getElementById("table-container");

    function loadTable() {
        const league = leagueFilter.value;
        const statsType = statsTypeFilter.value;
        const division = divisionFilter.value;
        const position = positionFilter.value;
        const born = bornFilter.value;
        const gamesPlayed = gamesPlayedFilter.value;
        const minutesPlayed = minutesPlayedFilter.value;

        const fileName = `${league}_${statsType}.csv`;

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
                            if (!isNaN(cellA) && !isNaN(cellB)) {
                                return parseFloat(cellA) - parseFloat(cellB);
                            } else {
                                return cellA.localeCompare(cellB);
                            }
                        });
                        const sortedTableHTML = `
                            <table>
                                <thead>
                                    <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                                </thead>
                                <tbody>
                                    ${sortedRows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                                </tbody>
                            </table>
                        `;
                        tableContainer.innerHTML = sortedTableHTML;
                    });
                });
            })
            .catch(error => {
                console.error('Error loading table:', error);
                tableContainer.innerHTML = "<p>Error loading table.</p>";
            });
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
