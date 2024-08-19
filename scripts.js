document.addEventListener("DOMContentLoaded", function () {
    function loadTable(csvFile, tableSelector, topN = null) {
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

                // Sort and filter top N rows if needed
                if (topN !== null) {
                    dataRows.sort((a, b) => b["Points"] - a["Points"]);
                    dataRows.slice(0, topN);
                }

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
                document.querySelectorAll(`${tableSelector} th`).forEach(th => {
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
            { file: "points-week.csv", top: 3 },
            { file: "rebounds-week.csv", top: 3 },
            { file: "assists-week.csv", top: 3 },
            { file: "steals-week.csv", top: 3 },
            { file: "blocks-week.csv", top: 3 },
            { file: "per-week.csv", top: 3 }
        ];

        // Regular Season Top 3 Tables
        const regularSeasonTopFiles = [
            { file: "points-regular.csv", top: 3 },
            { file: "rebounds-regular.csv", top: 3 },
            { file: "assists-regular.csv", top: 3 },
            { file: "steals-regular.csv", top: 3 },
            { file: "blocks-regular.csv", top: 3 },
            { file: "per-regular.csv", top: 3 }
        ];

        weeklyTopFiles.forEach((fileInfo, index) => {
            loadTable(fileInfo.file, `#weekly-top3-tables table:nth-of-type(${index + 1})`, fileInfo.top);
        });

        regularSeasonTopFiles.forEach((fileInfo, index) => {
            loadTable(fileInfo.file, `#regular-season-top3-tables table:nth-of-type(${index + 1})`, fileInfo.top);
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

    function applyFilters() {
        const division = document.getElementById("division").value;
        const position = document.getElementById("position").value;
        const yearOfBirth = parseInt(document.getElementById("year-of-birth").value) || null;
        const gamesPlayed = parseInt(document.getElementById("games-played").value) || null;
        const minutesPlayed = parseInt(document.getElementById("minutes-played").value) || null;

        const tables = document.querySelectorAll("#players-tables table");
        tables.forEach(table => {
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                const div = cells[0].innerText;
                const pos = cells[1].innerText;
                const birthYear = parseInt(cells[2].innerText);
                const games = parseInt(cells[3].innerText);
                const minutes = parseInt(cells[4].innerText);

                if ((division === "both" || div === division) &&
                    (position === "all" || pos === position) &&
                    (yearOfBirth === null || birthYear === yearOfBirth) &&
                    (gamesPlayed === null || games >= gamesPlayed) &&
                    (minutesPlayed === null || minutes >= minutesPlayed)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    document.getElementById("apply-filters").addEventListener("click", () => {
        loadPlayersTables();
        applyFilters();
    });

    // Initial load
    loadTablesForHomePage();
    loadPlayersTables();
});
