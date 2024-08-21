document.addEventListener('DOMContentLoaded', function () {
    // Helper function to fetch CSV data from the correct GitHub URL
    async function fetchCSV(fileName) {
        const url = `https://raw.githubusercontent.com/Lurppi/nbblstats/main/${fileName}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch ${fileName}`);
            return [];
        }
        const text = await response.text();
        const rows = text.trim().split('\n').map(row => row.split(';'));
        const headers = rows[0];
        return rows.slice(1).map(row => {
            return headers.reduce((acc, header, i) => {
                acc[header.trim()] = row[i].trim();
                return acc;
            }, {});
        });
    }

    async function renderPlayerTables() {
        const league = document.getElementById('league').value;
        const statsType = document.getElementById('stats-type').value;
        const fileName = `${statsType.toLowerCase().replace(/ /g, '-')}-${league.toLowerCase().replace(/ /g, '-')}.csv`;

        const data = await fetchCSV(fileName);
        if (data.length === 0) {
            document.getElementById('table-container').innerHTML = '<p>No data available.</p>';
            return;
        }

        const filters = {
            division: document.getElementById('division').value,
            team: document.getElementById('team').value,
            position: document.getElementById('position').value,
            yearOfBirth: document.getElementById('year-of-birth').value,
            gamesPlayed: document.getElementById('games-played').value,
            minutesPlayed: document.getElementById('minutes-played').value,
        };

        const filteredData = data.filter(row => {
            return (
                (filters.division === 'All' || row['Division'] === filters.division) &&
                (filters.team === 'All' || row['Team'] === filters.team) &&
                (filters.position === 'All' || row['Position'] === filters.position) &&
                (!filters.yearOfBirth || row['Year of Birth'] === filters.yearOfBirth) &&
                (!filters.gamesPlayed || parseInt(row['Games Played']) >= parseInt(filters.gamesPlayed)) &&
                (!filters.minutesPlayed || parseInt(row['Minutes Played']) >= parseInt(filters.minutesPlayed))
            );
        });

        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';

        if (filteredData.length > 0) {
            const headers = Object.keys(filteredData[0]);
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                </thead>
                <tbody>${filteredData.map(row => `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`).join('')}</tbody>
            `;
            tableContainer.appendChild(table);

            // Add sorting functionality
            table.querySelectorAll('th').forEach((header, index) => {
                header.addEventListener('click', () => {
                    const rows = Array.from(table.querySelectorAll('tbody tr'));
                    const ascending = header.dataset.sortDirection !== 'asc';
                    header.dataset.sortDirection = ascending ? 'asc' : 'desc';
                    rows.sort((a, b) => {
                        const aText = a.children[index].innerText;
                        const bText = b.children[index].innerText;
                        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
                    });
                    table.querySelector('tbody').append(...rows);
                });
            });
        } else {
            tableContainer.innerHTML = '<p>No data available for the selected filters.</p>';
        }
    }

    // Initialize the page by rendering the player tables with default or initial filter values
    if (document.getElementById('player-stats')) {
        document.querySelectorAll('#filters select, #filters input').forEach(input => {
            input.addEventListener('change', renderPlayerTables);
        });
        renderPlayerTables(); // Call the function once when the page loads
    }
});
