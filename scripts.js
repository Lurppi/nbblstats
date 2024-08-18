document.addEventListener('DOMContentLoaded', () => {
    const tableConfigs = {
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

    const leagueSelect = document.getElementById('league');
    const statsTypeSelect = document.getElementById('stats-type');
    const divisionSelect = document.getElementById('division');
    const positionSelect = document.getElementById('position');
    const birthYearInput = document.getElementById('birth-year');

    function loadTable(fileName, containerId) {
        const container = document.getElementById(containerId);
        Papa.parse(fileName, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data;
                if (data.length === 0) return;
                
                const columns = Object.keys(data[0]);
                let tableHtml = '<table><thead><tr>';
                columns.forEach(column => {
                    tableHtml += `<th>${column}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';
                data.forEach(row => {
                    tableHtml += '<tr>';
                    columns.forEach(column => {
                        tableHtml += `<td>${row[column]}</td>`;
                    });
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody></table>';
                container.innerHTML = tableHtml;
                applyFilters();
            }
        });
    }

    function updateTables() {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const fileName = tableConfigs[league][statsType];
        const containerId = 'player-tables';

        loadTable(fileName, containerId);
    }

    function applyFilters() {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        const fileName = tableConfigs[league][statsType];
        
        Papa.parse(fileName, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data;
                const filteredData = data.filter(row => {
                    const division = divisionSelect.value;
                    const position = positionSelect.value;
                    const birthYear = birthYearInput.value;
                    
                    const matchesDivision = division === 'Both' || row['DIV'] === division;
                    const matchesPosition = position === 'All' || row['POS'] === position;
                    const matchesYear = birthYear === '' || row['BORN'] == birthYear;

                    return matchesDivision && matchesPosition && matchesYear;
                });

                // Generate table HTML
                const columns = Object.keys(filteredData[0] || {});
                let tableHtml = '<table><thead><tr>';
                columns.forEach(column => {
                    tableHtml += `<th>${column}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';
                filteredData.forEach(row => {
                    tableHtml += '<tr>';
                    columns.forEach(column => {
                        tableHtml += `<td>${row[column]}</td>`;
                    });
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody></table>';
                document.getElementById('player-tables').innerHTML = tableHtml;
            }
        });
    }

    leagueSelect.addEventListener('change', updateTables);
    statsTypeSelect.addEventListener('change', updateTables);
    divisionSelect.addEventListener('change', applyFilters);
    positionSelect.addEventListener('change', applyFilters);
    birthYearInput.addEventListener('input', applyFilters);

    // Set default filter values and load initial table
    window.onload = () => {
        leagueSelect.value = 'Regular Season';
        statsTypeSelect.value = 'Totals';
        updateTables();
    };
});
