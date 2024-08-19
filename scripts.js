document.addEventListener("DOMContentLoaded", function () {
    const tableContainer = document.getElementById("table-container");
    let tableData = [];

    function applyFilters(data) {
        const league = document.getElementById("league-select").value;
        const statsType = document.getElementById("stats-type-select").value;
        const division = document.getElementById("division-select").value;
        const position = document.getElementById("position-select").value;
        const year = document.getElementById("year-select").value;
        const minGames = document.getElementById("games-played").value;
        const minMinutes = document.getElementById("minutes-played").value;

        const filteredRows = data.filter(row => {
            const div = row['DIV'];
            const pos = row['POS'];
            const birthYear = row['BORN'];
            const gamesPlayed = parseInt(row['GP'], 10);
            const minutesPlayed = parseInt(row['MP'], 10);

            return (division === 'Both' || div === division) &&
                   (position === 'All' || pos === position) &&
                   (year === 'All' || birthYear === year) &&
                   (minGames === '' || gamesPlayed >= minGames) &&
                   (minMinutes === '' || minutesPlayed >= minMinutes);
        });

        renderTable(filteredRows);
    }

    function loadTable(csvFile, tableSelector) {
        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").map(row => row.split(";"));
                const headers = rows[0];
                let tableHTML = "<table><thead><tr>";
                headers.forEach(header => tableHTML += `<th>${header}</th>`);
                tableHTML += "</tr></thead><tbody>";

                const dataRows = rows.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, index) => obj[header] = row[index]);
                    return obj;
                });

                dataRows.forEach(row => {
                    tableHTML += "<tr>";
                    headers.forEach(header => {
                        tableHTML += `<td>${row[header]}</td>`;
                    });
                    tableHTML += "</tr>";
                });

                tableHTML += "</tbody></table>";
                document.querySelector(tableSelector).innerHTML = tableHTML;

                // Enable sorting on table headers
                document.querySelectorAll("th").forEach(th => {
                    th.addEventListener("click", () => sortTable(th));
                });
            });
    }

    function renderTable(data) {
        tableContainer.innerHTML = "";
        const tableHTML = data.map(row => {
            const rowHTML = Object.values(row).map(val => `<td>${val}</td>`).join('');
            return `<tr>${rowHTML}</tr>`;
        }).join('');
        tableContainer.innerHTML = `<table><thead><tr>${Object.keys(data[0]).map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${tableHTML}</tbody></table>`;
    }

    function sortTable(th) {
        const table = th.closest("table");
        const rowsArray = Array.from(table.querySelector("tbody").rows);
        const index = Array.from(th.parentNode.children).indexOf(th);
        const isAscending = th.classList.toggle("ascending");

        rowsArray.sort((rowA, rowB) => {
            const cellA = rowA.cells[index].innerText;
            const cellB = rowB.cells[index].innerText;

            return isAscending ? cellA.localeCompare(cellB, undefined, { numeric: true }) : cellB.localeCompare(cellA, undefined, { numeric: true });
        });

        const tbody = table.querySelector("tbody");
        rowsArray.forEach(row => tbody.appendChild(row));
    }

    // Event listeners for filters
    document.getElementById("league-select").addEventListener("change", function () {
        const league = this.value;
        const statsType = document.getElementById("stats-type-select").value;
        const csvFile = `${league === 'Regular Season' ? 'Regular' : 'Playoffs'}_${statsType}.csv`;
        loadTable(csvFile, "#table-container");
    });

    document.getElementById("stats-type-select").addEventListener("change", function () {
        const league = document.getElementById("league-select").value;
        const statsType = this.value;
        const csvFile = `${league === 'Regular Season' ? 'Regular' : 'Playoffs'}_${statsType}.csv`;
        loadTable(csvFile, "#table-container");
    });

    document.getElementById("division-select").addEventListener("change", function () {
        applyFilters(tableData);
    });

    document.getElementById("position-select").addEventListener("change", function () {
        applyFilters(tableData);
    });

    document.getElementById("year-select").addEventListener("change", function () {
        applyFilters(tableData);
    });

    document.getElementById("games-played").addEventListener("input", function () {
        applyFilters(tableData);
    });

    document.getElementById("minutes-played").addEventListener("input", function () {
        applyFilters(tableData);
    });

    // Initialize with default filters
    loadTable("Regular_Totals.csv", "#table-container");
});
