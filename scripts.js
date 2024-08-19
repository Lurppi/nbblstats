// Home Page: Load CSV files and render the top 3 performers
document.addEventListener("DOMContentLoaded", function () {
    loadTable("points-week.csv", "#weekly-points", 3);
    loadTable("rebounds-week.csv", "#weekly-rebounds", 3);
    loadTable("assists-week.csv", "#weekly-assists", 3);
    loadTable("steals-week.csv", "#weekly-steals", 3);
    loadTable("blocks-week.csv", "#weekly-blocks", 3);
    loadTable("per-week.csv", "#weekly-per", 3);

    loadTable("points-regular.csv", "#regular-points", 3);
    loadTable("rebounds-regular.csv", "#regular-rebounds", 3);
    loadTable("assists-regular.csv", "#regular-assists", 3);
    loadTable("steals-regular.csv", "#regular-steals", 3);
    loadTable("blocks-regular.csv", "#regular-blocks", 3);
    loadTable("per-regular.csv", "#regular-per", 3);
});

// Players Page: Load and filter the player stats based on selections
document.addEventListener("DOMContentLoaded", function () {
    const leagueSelect = document.getElementById("league-select");
    const statsTypeSelect = document.getElementById("stats-type-select");

    const updatePlayerTable = () => {
        const league = leagueSelect.value;
        const statsType = statsTypeSelect.value;
        let csvFile;

        if (league === "Regular Season") {
            switch (statsType) {
                case "Totals":
                    csvFile = "Regular_Totals.csv";
                    break;
                case "Averages":
                    csvFile = "Regular_Averages.csv";
                    break;
                case "Shooting":
                    csvFile = "Regular_Shooting.csv";
                    break;
                case "Advanced1":
                    csvFile = "Regular_Advanced1.csv";
                    break;
                case "Advanced2":
                    csvFile = "Regular_Advanced2.csv";
                    break;
                case "Four Factors":
                    csvFile = "Regular_Four_Factors.csv";
                    break;
            }
        } else if (league === "Playoffs") {
            switch (statsType) {
                case "Totals":
                    csvFile = "Playoffs_Totals.csv";
                    break;
                case "Averages":
                    csvFile = "Playoffs_Averages.csv";
                    break;
                case "Shooting":
                    csvFile = "Playoffs_Shooting.csv";
                    break;
                case "Advanced1":
                    csvFile = "Playoffs_Advanced1.csv";
                    break;
                case "Advanced2":
                    csvFile = "Playoffs_Advanced2.csv";
                    break;
                case "Four Factors":
                    csvFile = "Playoffs_Four_Factors.csv";
                    break;
            }
        }

        loadTable(csvFile, "#table-container");
    };

    leagueSelect.addEventListener("change", updatePlayerTable);
    statsTypeSelect.addEventListener("change", updatePlayerTable);

    updatePlayerTable(); // Initial load
});

function loadTable(csvFile, tableSelector, limit = null) {
    fetch(csvFile)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n").map(row => row.split(";"));
            const headers = rows[0];
            let tableHTML = "<table><thead><tr>";
            headers.forEach(header => tableHTML += `<th>${header}</th>`);
            tableHTML += "</tr></thead><tbody>";

            const rowsToDisplay = limit ? rows.slice(1, limit + 1) : rows.slice(1);
            rowsToDisplay.forEach(row => {
                tableHTML += "<tr>";
                row.forEach(cell => tableHTML += `<td>${cell}</td>`);
                tableHTML += "</tr>";
            });

            tableHTML += "</tbody></table>";
            document.querySelector(tableSelector).innerHTML = tableHTML;
        });
}

// Sorting function for tables
document.addEventListener("click", function (e) {
    if (e.target.tagName === 'TH') {
        const table = e.target.closest('table');
        const thIndex = Array.prototype.indexOf.call(e.target.parentElement.children, e.target);
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const asc = e.target.classList.toggle('asc');

        rows.sort((row1, row2) => {
            const cell1 = row1.children[thIndex].innerText;
            const cell2 = row2.children[thIndex].innerText;
            const isNumeric = !isNaN(cell1) && !isNaN(cell2);
            return isNumeric ? (asc ? cell1 - cell2 : cell2 - cell1) : (asc ? cell1.localeCompare(cell2) : cell2.localeCompare(cell1));
        });

        rows.forEach(row => table.querySelector('tbody').appendChild(row));
    }
});
