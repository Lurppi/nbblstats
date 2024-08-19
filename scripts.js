document.addEventListener('DOMContentLoaded', function() {
    const csvUrls = {
        regular: {
            totals: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_totals.csv',
            averages: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_averages.csv',
            shooting: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_shooting.csv',
            advanced1: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_advanced1.csv',
            advanced2: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_advanced2.csv',
            four_factors: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/regular_four_factors.csv'
        },
        playoffs: {
            totals: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_totals.csv',
            averages: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_averages.csv',
            shooting: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_shooting.csv',
            advanced1: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_advanced1.csv',
            advanced2: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_advanced2.csv',
            four_factors: 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/playoffs_four_factors.csv'
        }
    };

    function loadPlayerTable() {
        const url = getPlayerTableUrl();
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('player-table-container').innerHTML = csvToHtmlTable(data);
                addSortFunctionality();
                applyFilters(); // Filters should be applied after table is loaded
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }

    function getPlayerTableUrl() {
        const league = document.getElementById('league-filter').value;
        const statsType = document.getElementById('stats-type-filter').value;
        return csvUrls[league][statsType];
    }

    function csvToHtmlTable(csv) {
        const rows = csv.split('\n');
        const headers = rows[0].split(';');
        let table = '<table><thead><tr>';
        headers.forEach(header => table += `<th class="sortable">${header}</th>`);
        table += '</tr></thead><tbody>';

        rows.slice(1).forEach(row => {
            if (row) {
                const columns = row.split(';');
                table += '<tr>';
                columns.forEach(col => table += `<td>${col}</td>`);
                table += '</tr>';
            }
        });

        table += '</tbody></table>';
        return table;
    }

    function addSortFunctionality() {
        const headers = document.querySelectorAll('th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const table = header.closest('table');
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const index = Array.from(header.parentElement.children).indexOf(header);
                const isAscending = header.classList.contains('asc');

                rows.sort((a, b) => {
                    const aText = a.children[index].textContent.trim();
                    const bText = b.children[index].textContent.trim();

                    if (!isNaN(aText) && !isNaN(bText)) {
                        return isAscending ? aText - bText : bText - aText;
                    }

                    return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
                });

                rows.forEach(row => table.querySelector('tbody').appendChild(row));
                headers.forEach(h => h.classList.remove('asc', 'desc'));
                header.classList.add(isAscending ? 'desc' : 'asc');
            });
        });
    }

    function applyFilters() {
        const division = document.getElementById('division-filter').value;
        const position = document.getElementById('position-filter').value;
        const yearOfBirth = document.getElementById('year-of-birth-filter').value;
        const minGamesPlayed = parseInt(document.getElementById('games-played-filter').value, 10) || 0;
        const minMinutesPlayed = parseInt(document.getElementById('minutes-played-filter').value, 10) || 0;

        document.querySelectorAll('#player-table-container table tbody tr').forEach(row => {
            const cols = row.children;
            const rowDivision = cols[cols.length - 5].textContent.trim();
            const rowPosition = cols[cols.length - 4].textContent.trim();
            const rowYearOfBirth = cols[cols.length - 3].textContent.trim();
            const rowGamesPlayed = parseInt(cols[cols.length - 2].textContent.trim(), 10);
            const rowMinutesPlayed = parseInt(cols[cols.length - 1].textContent.trim(), 10);

            const matchesDivision = division === 'both' || rowDivision === division;
            const matchesPosition = position === 'all' || rowPosition === position;
            const matchesYearOfBirth = !yearOfBirth || rowYearOfBirth.includes(yearOfBirth);
            const matchesGamesPlayed = rowGamesPlayed >= minGamesPlayed;
            const matchesMinutesPlayed = rowMinutesPlayed >= minMinutesPlayed;

            row.style.display = matchesDivision && matchesPosition && matchesYearOfBirth && matchesGamesPlayed && matchesMinutesPlayed ? '' : 'none';
        });
    }

    document.getElementById('league-filter').addEventListener('change', loadPlayerTable);
    document.getElementById('stats-type-filter').addEventListener('change', loadPlayerTable);
    document.getElementById('division-filter').addEventListener('change', applyFilters);
    document.getElementById('position-filter').addEventListener('change', applyFilters);
    document.getElementById('year-of-birth-filter').addEventListener('input', applyFilters);
    document.getElementById('games-played-filter').addEventListener('input', applyFilters);
    document.getElementById('minutes-played-filter').addEventListener('input', applyFilters);

    loadPlayerTable();
});
