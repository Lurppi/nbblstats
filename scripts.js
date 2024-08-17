document.addEventListener('DOMContentLoaded', function () {
    const csvFiles = {
        'points-week': 'points-week.csv',
        'rebounds-week': 'rebounds-week.csv',
        'assists-week': 'assists-week.csv',
        'steals-week': 'steals-week.csv',
        'blocks-week': 'blocks-week.csv',
        'per-week': 'per-week.csv',
        'points-reg-season': 'points-reg-season.csv',
        'rebounds-reg-season': 'rebounds-reg-season.csv',
        'assists-reg-season': 'assists-reg-season.csv',
        'steals-reg-season': 'steals-reg-season.csv',
        'blocks-reg-season': 'blocks-reg-season.csv',
        'per-reg-season': 'per-reg-season.csv',
        'teams-table': 'teams.csv',
        'players-table': 'players.csv',
        'roster-table': 'roster.csv'
    };

    function loadCSV(id, fileName) {
        Papa.parse(fileName, {
            download: true,
            header: true,
            complete: function (results) {
                const data = results.data;
                const table = document.createElement('table');
                const header = document.createElement('thead');
                const body = document.createElement('tbody');
                const thead = document.createElement('tr');

                // Create table header
                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    thead.appendChild(th);
                });

                header.appendChild(thead);
                table.appendChild(header);

                // Create table rows
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(value => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        tr.appendChild(td);
                    });
                    body.appendChild(tr);
                });

                table.appendChild(body);
                document.getElementById(id).appendChild(table);
            }
        });
    }

    // Load all CSV files
    for (const [id, file] of Object.entries(csvFiles)) {
        loadCSV(id, file);
    }
});
