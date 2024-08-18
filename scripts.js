document.addEventListener('DOMContentLoaded', function () {
    const statTypeSelect = document.getElementById('statType');
    const seasonTypeSelect = document.getElementById('seasonType');
    const gpFilterInput = document.getElementById('gpFilter');
    const mpFilterInput = document.getElementById('mpFilter');

    let currentData = [];

    function loadCSV(filePath) {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: function (results) {
                currentData = results.data;
                updateTable();
            }
        });
    }

    function updateTable() {
        const gpFilter = parseInt(gpFilterInput.value) || 0;
        const mpFilter = parseInt(mpFilterInput.value) || 0;

        let filteredData = currentData.filter(row => {
            return parseInt(row['GP']) >= gpFilter && parseInt(row['MP']) >= mpFilter;
        });

        displayTable(filteredData);
    }

    function displayTable(data) {
        const tableContainer = document.getElementById('statsTable');
        tableContainer.innerHTML = '';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            const headerRow = document.createElement('tr');

            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                th.addEventListener('click', () => sortTable(data, header));
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);

            data.forEach(row => {
                const tr = document.createElement('tr');

                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }

    function sortTable(data, column) {
        const direction = data[0][column] > data[1][column] ? 1 : -1;
        data.sort((a, b) => (a[column] > b[column] ? direction : -direction));
        displayTable(data);
    }

    function updateCSV() {
        const statType = statTypeSelect.value;
        const seasonType = seasonTypeSelect.value;

        let filePath = '';

        switch (statType) {
            case 'totals':
                filePath = seasonType === 'regular' ? 'Regular_Totals.csv' : 'Playoffs_Totals.csv';
                break;
            case 'averages':
                filePath = seasonType === 'regular' ? 'Regular_Averages.csv' : 'Playoffs_Averages.csv';
                break;
            case 'shooting':
                filePath = seasonType === 'regular' ? 'Regular_Shooting.csv' : 'Playoffs_Shooting.csv';
                break;
            case 'advanced1':
                filePath = seasonType === 'regular' ? 'Regular_Advanced1.csv' : 'Playoffs_Advanced1.csv';
                break;
            case 'advanced2':
                filePath = seasonType === 'regular' ? 'Regular_Advanced2.csv' : 'Playoffs_Advanced2.csv';
                break;
            case 'fourfactors':
                filePath = seasonType === 'regular' ? 'Regular_FourFactors.csv' : 'Playoffs_FourFactors.csv';
                break;
        }

        loadCSV(filePath);
    }

    statTypeSelect.addEventListener('change', updateCSV);
    seasonTypeSelect.addEventListener('change', updateCSV);
    gpFilterInput.addEventListener('input', updateTable);
    mpFilterInput.addEventListener('input', updateTable);

    updateCSV();  // Initial table load
});
