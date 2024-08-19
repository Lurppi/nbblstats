document.addEventListener('DOMContentLoaded', function() {
    const csvUrls = {
        'regular': {
            'totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Totals.csv',
            'averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Averages.csv',
            'shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Shooting.csv',
            'advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced1.csv',
            'advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced2.csv',
            'four_factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Four_Factors.csv',
        },
        'playoffs': {
            'totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Totals.csv',
            'averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Averages.csv',
            'shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Shooting.csv',
            'advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced1.csv',
            'advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced2.csv',
            'four_factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Four_Factors.csv',
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
                applyFilters(); // Apply filters after table is loaded
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }

    function getPlayerTableUrl() {
        const league = document.getElementById('league-filter').value;
        const statsType = document.getElementById('stats-type-filter').value;
        return csvUrls[league][statsType];
    }

    function csvToHtmlTable(csv) {
        const rows = csv.split('\n').map(row => row.split(','));
        let table = '<table><thead><tr>';
        table += rows[0].map(header => `<th class="sortable">${header}</th>`).join('');
        table += '</tr></thead><tbody>';
        for (let i = 1; i < rows.length; i++) {
            table += '<tr>';
            table += rows[i].map(cell => `<td>${cell}</td>`).join('');
            table += '</tr>';
        }
        table += '</tbody></table>';
        return table;
    }

    function addSortFunctionality() {
        document.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const index = Array.from(th.parentNode.children).indexOf(th);
                const ascending = !th.classList.contains('asc');
                rows.sort((rowA, rowB) => {
                    const cellA = rowA.children[index].innerText;
                    const cellB = rowB.children[index].innerText;
                    if (isNaN(cellA) || isNaN(cellB)) {
                        return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                    } else {
                        return ascending ? cellA - cellB : cellB - cellA;
                    }
                });
                tbody.innerHTML = '';
                rows.forEach(row => tbody.appendChild(row));
                document.querySelectorAll('th.sortable').forEach(th => th.classList.remove('asc', 'desc'));
                th.classList.add(ascending ? 'asc' : 'desc');
            });
        });
    }

    function applyFilters() {
        const filters = {
            'DIV': document.getElementById('division-filter').value,
            'POS': document.getElementById('position-filter').value,
            'BORN': document.getElementById('year-of-birth-filter').value,
            'GP': document.getElementById('games-played-filter').value,
            'MP': document.getElementById('minutes-played-filter').value,
        };

        const table = document.querySelector('#player-table-container table');
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tbody tr'));
        rows.forEach(row => {
            const cells = Array.from(row.children);
            const isVisible = Object.keys(filters).every((key, index) => {
                const cellValue = cells[index].innerText;
                if (!filters[key] || filters[key] === 'all') return true;
                if (key === 'GP' || key === 'MP') return parseFloat(cellValue) >= parseFloat(filters[key]);
                return cellValue.toLowerCase().includes(filters[key].toLowerCase());
            });

            row.style.display = isVisible ? '' : 'none';
        });
    }

    document.getElementById('league-filter').addEventListener('change', loadPlayerTable);
    document.getElementById('stats-type-filter').addEventListener('change', loadPlayerTable);
    document.getElementById('division-filter').addEventListener('change', applyFilters);
    document.getElementById('position-filter').addEventListener('change', applyFilters);
    document.getElementById('year-of-birth-filter').addEventListener('input', applyFilters);
    document.getElementById('games-played-filter').addEventListener('input', applyFilters);
    document.getElementById('minutes-played-filter').addEventListener('input', applyFilters);

    loadPlayerTable(); // Load the initial table
});
