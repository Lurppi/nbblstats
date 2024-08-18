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
        'Playoffs_Four_Factors': 'https://raw.githubusercontent.com/Lurppi/nbblstats/main/Playoffs_Four_Factors.csv',
    };

    Object.keys(tables).forEach(tableId => {
        fetch(tables[tableId])
            .then(response => response.text())
            .then(data => {
                const table = document.getElementById(tableId);
                const rows = data.trim().split('\n').slice(1); // Überspringen der Kopfzeile
                rows.forEach(row => {
                    const cells = row.split(',');
                    const tr = document.createElement('tr');
                    cells.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    table.querySelector('tbody').appendChild(tr);
                });
            })
            .catch(error => console.error(`Error loading data for ${tableId}:`, error));
    });

    document.querySelectorAll('.sortable th').forEach(header => {
        header.addEventListener('click', () => {
            const table = header.parentElement.parentElement.parentElement;
            const
