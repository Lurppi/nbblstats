document.addEventListener("DOMContentLoaded", function () {
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

    function loadTablesForHomePage() {
        // Weekly Top 3 Tables
        const weeklyTopFiles = [
            "points-week.csv",
            "rebounds-week.csv",
            "assists-week.csv",
            "steals-week.csv",
            "blocks-week.csv",
            "per-week.csv"
        ];

        // Regular Season Top 3 Tables
        const regularSeasonTopFiles = [
            "points-regular.csv",
            "rebounds-regular.csv",
            "assists-regular.csv",
            "steals-regular.csv",
            "blocks-regular.csv",
            "per-regular.csv"
        ];

        weeklyTopFiles.forEach((file, index) => {
            loadTable(file, `#weekly-top3-tables table:nth-of-type(${index + 1})`);
        });

        regularSeasonTopFiles.forEach((file, index) => {
            loadTable(file, `#regular-season-top3-tables table:nth-of-type(${index + 1})`);
        });
    }

    function loadPlayersTables() {
        // Filter for Player Tables
        const statsType = document.getElementById("stats-type").value;
        const league = document.getElementById("league").value;
        const files = [
            `stats-${statsType}-${league}-a.csv`,
            `stats-${statsType}-${league}-b.csv`
        ];

        const container = document.getElementById("players-tables");
        container.innerHTML = ""; // Clear previous content

        files.forEach(file => {
            loadTable(file, "#players-tables");
        });
    }

    document.getElementById("apply-filters").addEventListener("click", loadPlayersTables);

    // Initial load
    loadTablesForHomePage();
    loadPlayersTables();
});
