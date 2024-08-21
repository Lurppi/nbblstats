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

    async function renderIndexTables() {
        const files = {
            'Weekly Points': 'points-week.csv',
            'Weekly Rebounds': 'rebounds-week.csv',
            'Weekly Assists': 'assists-week.csv',
            'Weekly Steals': 'steals-week.csv',
            'Weekly Blocks': 'blocks-week.csv',
            'Weekly PER': 'per-week.csv',
            'Season Points': 'points-regular.csv',
            'Season Rebounds': 'rebounds-regular.csv',
            'Season Assists': 'assists-regular.csv',
            'Season Steals': 'steals-regular.csv',
            'Season Blocks': 'blocks-regular.csv',
            'Season PER': 'per-regular.csv',
        };

        const weeklyContainer = document.getElementById('weekly-tables');
        const seasonContainer = document.getElementById('season-tables');

        for (const [title, file] of Object.entries(files)) {
            const data = await fetchCSV(file);
            if (data.length === 0) continue;
            const top3 = data.slice(0, 3);
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr><th colspan="${Object.keys(data[0]).length}">${title}</th></tr>
                    <tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}</tr>
                </thead>
                <tbody>${top3.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody>
            `;
            if (title.startsWith('Weekly')) {
                weeklyContainer.appendChild(table);
            } else {
                seasonContainer.appendChild(table);
            }
        }
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

    if (document.getElementById('weekly-tables')) {
        renderIndexTables();
    }

    if (document.getElementById('player-stats')) {
        document.querySelectorAll('#filters select, #filters input').forEach(input => {
            input.addEventListener('change', renderPlayerTables);
        });
        renderPlayerTables();
    }
});
