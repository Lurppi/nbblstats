document.addEventListener('DOMContentLoaded', () => {
    const tableConfigs = {
        'weekly-points': 'points-week.csv',
        'weekly-rebounds': 'rebounds-week.csv',
        'weekly-assists': 'assists-week.csv',
        'weekly-steals': 'steals-week.csv',
        'weekly-blocks': 'blocks-week.csv',
        'weekly-per': 'per-week.csv',
        'regular-points': 'points-regular.csv',
        'regular-rebounds': 'rebounds-regular.csv',
        'regular-assists': 'assists-regular.csv',
        'regular-steals': 'steals-regular.csv',
        'regular-blocks': 'blocks-regular.csv',
        'regular-per': 'per-regular.csv'
    };

    function loadTable(containerId, fileName) {
        const container = document.getElementById(containerId);
        Papa.parse(fileName, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data;
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
            }
        });
    }

    function updateTables() {
        Object.keys(tableConfigs).forEach(id => {
            loadTable(id, tableConfigs[id]);
        });
    }

    updateTables();
});
