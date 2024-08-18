document.addEventListener('DOMContentLoaded', () => {
    const tables = {
        // Weekly Stats
        'points-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/points-week.csv',
        'rebounds-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/rebounds-week.csv',
        'assists-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/assists-week.csv',
        'steals-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/steals-week.csv',
        'blocks-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/blocks-week.csv',
        'per-week': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-week.csv',

        // Regular Season Stats
        'points-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/points-regular.csv',
        'rebounds-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/rebounds-regular.csv',
        'assists-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/assists-regular.csv',
        'steals-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/steals-regular.csv',
        'blocks-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/blocks-regular.csv',
        'per-regular': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/per-regular.csv',

        // Regular Season Tables for Players Page
        'Regular_Totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Totals.csv',
        'Regular_Averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Averages.csv',
        'Regular_Shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Shooting.csv',
        'Regular_Advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced1.csv',
        'Regular_Advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Advanced2.csv',
        'Regular_Four_Factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Regular_Four_Factors.csv',

        // Playoffs Tables for Players Page
        'Playoffs_Totals': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Totals.csv',
        'Playoffs_Averages': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Averages.csv',
        'Playoffs_Shooting': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Shooting.csv',
        'Playoffs_Advanced1': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced1.csv',
        'Playoffs_Advanced2': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Advanced2.csv',
        'Playoffs_Four_Factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Four_Factors.csv'
    };

    const loadTable = (tableId, fileName) => {
        fetch(fileName)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const table = document.getElementById(tableId);
                const tbody = table.querySelector('tbody');
                tbody.innerHTML = ''; // Clear existing rows
                rows.forEach((row, index) => {
                    if (index > 0 && row.length > 1) { // Skip header row and empty rows
                        const tr = document.createElement('tr');
                        row.forEach(cell => {
                            const td = document.createElement('td');
                            td.textContent = cell;
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    }
                });
            })
            .catch(error => console.error('Error loading table:', error));
    };

    Object.keys(tables).forEach(tableId => {
        loadTable(tableId, tables[tableId]);
    });
});
