document.addEventListener('DOMContentLoaded', () => {
    // Home Page Table Loading
    const homeTables = {
        'points-week': 'points-week.csv',
        'rebounds-week': 'rebounds-week.csv',
        'assists-week': 'assists-week.csv',
        'steals-week': 'steals-week.csv',
        'blocks-week': 'blocks-week.csv',
        'per-week': 'per-week.csv',
        'points-regular': 'points-regular.csv',
        'rebounds-regular': 'rebounds-regular.csv',
        'assists-regular': 'assists-regular.csv',
        'steals-regular': 'steals-regular.csv',
        'blocks-regular': 'blocks-regular.csv',
        'per-regular': 'per-regular.csv'
    };

    if (document.body.classList.contains('home-page')) {
        loadHomeTables(homeTables);
    }

    // Players Page Table Loading and Filter Functionality
    const playersPage = document.body.classList.contains('players-page');
    if (playersPage) {
        const filters = {
            league: document.getElementById('league'),
            statsType: document.getElementById('stats-type'),
            division: document.getElementById('division'),
            position: document.getElementById('position'),
            birthYear: document.getElementById('birth-year')
        };

        filters.league.addEventListener('change', () => loadPlayerTables(filters));
        filters.statsType.addEventListener('change', () => loadPlayerTables(filters));
        filters.division.addEventListener('change', () => loadPlayerTables(filters));
        filters.position.addEventListener('change', () => loadPlayerTables(filters));
        filters.birthYear.addEventListener('input', () => loadPlayerTables(filters));

        // Initialize default filters
        filters.league.value = 'Regular Season';
        filters.statsType.value = 'Totals';
        filters.division.value = 'Both';
        filters.position.value = 'Both';
        filters.birthYear.value = '';

        loadPlayerTables(filters);
    }
});

function loadHomeTables(tables) {
    Object.keys(tables).forEach(id => {
        fetch(tables[id])
            .then(response => response.text())
            .then(data => {
                const tableContainer = document.getElementById(id);
                if (tableContainer) {
                    tableContainer.innerHTML = generateTableHTML(data);
                }
            });
    });
}

function loadPlayerTables(filters) {
    const league = filters.league.value;
    const statsType = filters.statsType.value;
    const division = filters.division.value;
    const position = filters.position.value;
    const birthYear = filters.birthYear.value;

    const fileName = getPlayerTableFileName(league, statsType);
    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            const tableHTML = generateTableHTML(data);
            const tableContainer = document.getElementById('player-tables');
            if (tableContainer) {
                tableContainer.innerHTML = tableHTML;
                applyFilters(division, position, birthYear);
                makeTablesSortable();
            }
        });
}

function getPlayerTableFileName(league, statsType) {
    const fileNames = {
        'Regular Season': {
            'Totals': 'Regular_Totals.csv',
            'Averages': 'Regular_Averages.csv',
            'Shooting': 'Regular_Shooting.csv',
            'Advanced1': 'Regular_Advanced1.csv',
            'Advanced2': 'Regular_Advanced2.csv',
            'Four Factors': 'Regular_Four_Factors.csv'
        },
        'Playoffs': {
            'Totals': 'Playoffs_Totals.csv',
            'Averages': 'Playoffs_Averages.csv',
            'Shooting': 'Playoffs_Shooting.csv',
            'Advanced1': 'Playoffs_Advanced1.csv',
            'Advanced2': 'Playoffs_Advanced2.csv',
            'Four Factors': 'Playoffs_Four_Factors.csv'
        }
    };

    return fileNames[league][statsType] || '';
}

function generateTableHTML(csvData) {
    const rows = csvData.trim().split('\n').map(row => row.split(','));
    let tableHTML = '<table>';

    // Generate table headers
    tableHTML += '<thead><tr>';
    rows[0].forEach(header => tableHTML += `<th>${header}</th>`);
    tableHTML += '</tr></thead>';

    // Generate table body
    tableHTML += '<tbody>';
    for (let i = 1; i < rows.length; i++) {
        tableHTML += '<tr>';
        rows[i].forEach(cell => tableHTML += `<td>${cell}</td>`);
        tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';

    return tableHTML;
}

function applyFilters(division, position, birthYear) {
    const rows = document.querySelectorAll('#player-tables tbody tr');
    rows.forEach(row => {
        const cells = row.children;
        const cellDivision = cells[2].textContent;
        const cellPosition = cells[3].textContent;
        const cellBirthYear = cells[4].textContent;

        const matchesDivision = division === 'Both' || cellDivision === division;
        const matchesPosition = position === 'Both' || cellPosition === position;
        const matchesBirthYear = !birthYear || cellBirthYear.includes(birthYear);

        row.style.display = (matchesDivision && matchesPosition && matchesBirthYear) ? '' : 'none';
    });
}

function makeTablesSortable() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const isAscending = header.classList.toggle('asc');
                rows.sort((a, b) => {
                    const aText = a.children[index].textContent.trim();
                    const bText = b.children[index].textContent.trim();

                    if (!isNaN(aText) && !isNaN(bText)) {
                        return isAscending ? aText - bText : bText - aText;
                    }
                    return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
                });

                const tbody = table.querySelector('tbody');
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
}
