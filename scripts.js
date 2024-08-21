document.addEventListener("DOMContentLoaded", function() {
    // Base path to load CSV files from GitHub
    const basePath = "https://raw.githubusercontent.com/Lurppi/nbblstats/main/";

    // Function to load CSV data into tables
    function loadCSVData(tableId, csvFile) {
        fetch(basePath + csvFile)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                let table = document.getElementById(tableId);
                let html = '<thead><tr>';
                
                const headers = rows[0].split(',');
                headers.forEach(header => {
                    html += `<th>${header}</th>`;
                });
                html += '</tr></thead><tbody>';
                
                for(let i = 1; i < rows.length; i++) {
                    const cells = rows[i].split(',');
                    html += '<tr>';
                    cells.forEach(cell => {
                        html += `<td>${cell}</td>`;
                    });
                    html += '</tr>';
                }
                html += '</tbody>';
                table.innerHTML = html;
            });
    }

    // Load tables on the main page
    loadCSVData("points-week", "points-week.csv");
    loadCSVData("rebounds-week", "rebounds-week.csv");
    loadCSVData("assists-week", "assists-week.csv");
    loadCSVData("steals-week", "steals-week.csv");
    loadCSVData("blocks-week", "blocks-week.csv");
    loadCSVData("per-week", "per-week.csv");
    loadCSVData("points-regular", "points-regular.csv");
    loadCSVData("rebounds-regular", "rebounds-regular.csv");
    loadCSVData("assists-regular", "assists-regular.csv");
    loadCSVData("steals-regular", "steals-regular.csv");
    loadCSVData("blocks-regular", "blocks-regular.csv");
    loadCSVData("per-regular", "per-regular.csv");

    // Function to apply filters and load the appropriate table on players page
    function applyFilters() {
        const league = document.getElementById("league").value.toLowerCase().replace(' ', '_');
        const statsType = document.getElementById("statsType").value.toLowerCase().replace(' ', '_');
        
        const fileName = `${league}_${statsType}.csv`;
        loadCSVData("statsTables", fileName);
    }

    // Event listener for filters on the players page
    document.getElementById("applyFilters").addEventListener("click", applyFilters);

    // Load the default table (Regular Season Totals) on the players page
    loadCSVData("statsTables", "regular_season_totals.csv");
});
