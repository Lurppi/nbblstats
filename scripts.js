document.addEventListener('DOMContentLoaded', () => {
    const tables = {
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
        'Regular_Totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Totals.csv',
        'Playoffs_Totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Totals.csv',
        'Regular_Averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Averages.csv',
        'Playoffs_Averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Averages.csv',
        'Regular_Shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Shooting.csv',
        'Playoffs_Shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Shooting.csv',
        'Regular_Advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced1.csv',
        'Playoffs_Advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced1.csv',
        'Regular_Advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced2.csv',
        'Playoffs_Advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced2.csv',
        'Regular_Four_Factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Four_Factors.csv',
        'Playoffs_Four_Factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Four_Factors.csv'
    };

    const fetchAndDisplayTable = (tableId, csvUrl) => {
        fetch(csvUrl)
            .then(response => response.text())
            .then(csvData => {
                const rows = csvData.split('\n').map(row => row.split(';'));
                const table = document.createElement('table');
                table.classList.add('sortable');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                const headers = rows[0];
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);

                for (let i = 1; i < rows.length; i++) {
                    const row = document.createElement('tr');
                    rows[i].forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                }

                table.appendChild(thead);
                table.appendChild(tbody);
                document.getElementById(tableId).appendChild(table);

                // Tabellen sortierbar machen
                Array.from(table.querySelectorAll('th')).forEach(header => {
                    header.addEventListener('click', () => {
                        const index = Array.from(header.parentElement.children).indexOf(header);
                        const ascending = header.classList.contains('ascending');
                        const direction = ascending ? -1 : 1;
                        header.classList.toggle('ascending', !ascending);
                        header.classList.toggle('descending', ascending);

                        const rows = Array.from(table.querySelector('tbody').rows);
                        rows.sort((a, b) => {
                            const aText = a.cells[index].textContent.trim();
                            const bText = b.cells[index].textContent.trim();
                            return (aText > bText ? 1 : -1) * direction;
                        });
                        rows.forEach(row => table.querySelector('tbody').appendChild(row));
                    });
                });
            });
    };

    Object.keys(tables).forEach(tableId => fetchAndDisplayTable(tableId, tables[tableId]));

    // Filter für die Players-Seite implementieren
    if (window.location.pathname.includes('players.html')) {
        const filters = {
            division: document.getElementById('division-filter'),
            position: document.getElementById('position-filter'),
            year: document.getElementById('year-filter')
        };

        const filterTable = () => {
            const division = filters.division.value;
            const position = filters.position.value;
            const year = filters.year.value;

            document.querySelectorAll('.table-container table tbody tr').forEach(row => {
                const divisionText = row.cells[0].textContent.trim(); 
                const positionText = row.cells[1].textContent.trim(); 
                const yearText = row.cells[2].textContent.trim(); 

                const divisionMatch = division === 'Both' || divisionText === division;
                const positionMatch = position === 'All' || positionText === position;
                const yearMatch = year === 'All' || yearText === year;

                if (divisionMatch && positionMatch && yearMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        filters.division.addEventListener('change', filterTable);
        filters.position.addEventListener('change', filterTable);
        filters.year.addEventListener('change', filterTable);
    }
});
