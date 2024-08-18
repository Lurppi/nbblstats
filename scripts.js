// Ensure PapaParse is included in your HTML file for this to work
document.addEventListener('DOMContentLoaded', () => {
    // Home page
    loadTable('weekly-top', [
        { title: 'Points', file: 'points-week.csv' },
        { title: 'Rebounds', file: 'rebounds-week.csv' },
        { title: 'Assists', file: 'assists-week.csv' },
        { title: 'Steals', file: 'steals-week.csv' },
        { title: 'Blocks', file: 'blocks-week.csv' },
        { title: 'PER', file: 'per-week.csv' }
    ]);

    loadTable('regular-season-top', [
        { title: 'Points', file: 'points-regular.csv' },
        { title: 'Rebounds', file: 'rebounds-regular.csv' },
        { title: 'Assists', file: 'assists-regular.csv' },
        { title: 'Steals', file: 'steals-regular.csv' },
        { title: 'Blocks', file: 'blocks-regular.csv' },
        { title: 'PER', file: 'per-regular.csv' }
    ]);

    // Players page
    const leagueSelect = document.getElementById('league');
    const statsTypeSelect = document.getElementById('stats-type');
    const divisionSelect = document.getElementById('division');
    const positionSelect = document.getElementById('position');
    const birthYearInput = document.getElementById('birth-year');

    const loadPlayersTable = () => {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const division = divisionSelect.value;
        const position = positionSelect.value;
        const birthYear = birthYearInput.value;

        let file = '';

        if (league === 'Regular Season' && statsType === 'Totals') file = 'Regular_Totals.csv';
        else if (league === 'Playoffs' && statsType === 'Totals') file = 'Playoffs_Totals.csv';
        else if (league === 'Regular Season' && statsType === 'Averages') file = 'Regular_Averages.csv';
        else if (league === 'Playoffs' && statsType === 'Averages') file = 'Playoffs_Averages.csv';
        else if (league === 'Regular Season' && statsType === 'Shooting') file = 'Regular_Shooting.csv';
        else if (league === 'Playoffs' && statsType === 'Shooting') file = 'Playoffs_Shooting.csv';
        else if (league === 'Regular Season' && statsType === 'Advanced1') file = 'Regular_Advanced1.csv';
        else if (league === 'Playoffs' && statsType === 'Advanced1') file = 'Playoffs_Advanced1.csv';
        else if (league === 'Regular Season' && statsType === 'Advanced2') file = 'Regular_Advanced2.csv';
        else if (league === 'Playoffs' && statsType === 'Advanced2') file = 'Playoffs_Advanced2.csv';
        else if (league === 'Regular Season' && statsType === 'Four Factors') file = 'Regular_Four_Factors.csv';
        else if (league === 'Playoffs' && statsType === 'Four Factors') file = 'Playoffs_Four_Factors.csv';

        loadTable('player-tables', [{ title: statsType, file }], {
            league, division, position, birthYear
        });
    };

    leagueSelect.addEventListener('change', loadPlayersTable);
    statsTypeSelect.addEventListener('change', loadPlayersTable);
    divisionSelect.addEventListener('change', loadPlayersTable);
    positionSelect.addEventListener('change', loadPlayersTable);
    birthYearInput.addEventListener('input', loadPlayersTable);

    // Function to load table
    function loadTable(containerId, files, filters = {}) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        files.forEach(fileInfo => {
            const table = document.createElement('table');
            const title = document.createElement('caption');
            title.textContent = fileInfo.title;
            table.appendChild(title);

            fetch(fileInfo.file)
                .then(response => response.text())
                .then(text => {
                    const data = Papa.parse(text, { header: true }).data;
                    if (data.length === 0) return;

                    const headers = Object.keys(data[0]);
                    const thead = document.createElement('thead');
                    const tr = document.createElement('tr');
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        th.classList.add('sortable');
                        th.addEventListener('click', () => sortTable(table, headers.indexOf(header)));
                        tr.appendChild(th);
                    });
                    thead.appendChild(tr);
                    table.appendChild(thead);

                    const tbody = document.createElement('tbody');
                    data.forEach(row => {
                        if (shouldIncludeRow(row, filters)) {
                            const tr = document.createElement('tr');
                            headers.forEach(header => {
                                const td = document.createElement('td');
                                td.textContent = row[header];
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                        }
                    });
                    table.appendChild(tbody);
                    container.appendChild(table);
                });
        });
    }

    function shouldIncludeRow(row, filters) {
        // Apply filters to determine if row should be included
        if (filters.league && row.League !== filters.league) return false;
        if (filters.division && row.Division !== filters.division && filters.division !== 'Both') return false;
        if (filters.position && row.Position !== filters.position && filters.position !== 'All') return false;
        if (filters.birthYear && row.BirthYear != filters.birthYear) return false;
        return true;
    }

    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rowsArray = Array.from(tbody.querySelectorAll('tr'));

        rowsArray.sort((a, b) => {
            const aText = a.children[columnIndex].textContent.trim();
            const bText = b.children[columnIndex].textContent.trim();
            return isNaN(aText) ? aText.localeCompare(bText) : aText - bText;
        });

        rowsArray.forEach(row => tbody.appendChild(row));
    }

    // Initial load
    loadTable('weekly-top', [
        { title: 'Points', file: 'points-week.csv' },
        { title: 'Rebounds', file: 'rebounds-week.csv' },
        { title: 'Assists', file: 'assists-week.csv' },
        { title: 'Steals', file: 'steals-week.csv' },
        { title: 'Blocks', file: 'blocks-week.csv' },
        { title: 'PER', file: 'per-week.csv' }
    ]);

    loadTable('regular-season-top', [
        { title: 'Points', file: 'points-regular.csv' },
        { title: 'Rebounds', file: 'rebounds-regular.csv' },
        { title: 'Assists', file: 'assists-regular.csv' },
        { title: 'Steals', file: 'steals-regular.csv' },
        { title: 'Blocks', file: 'blocks-regular.csv' },
        { title: 'PER', file: 'per-regular.csv' }
    ]);
});
