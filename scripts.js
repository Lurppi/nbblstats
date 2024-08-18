document.addEventListener("DOMContentLoaded", function() {
    // Function to load CSV data and display it in a table
    function loadCSV(csvFile, tableId, limit = 3) {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data.slice(0, limit);
                let tableHtml = '<table><thead><tr>';
                for (let key in data[0]) {
                    tableHtml += `<th>${key}</th>`;
                }
                tableHtml += '</tr></thead><tbody>';
                data.forEach(row => {
                    tableHtml += '<tr>';
                    for (let key in row) {
                        tableHtml += `<td>${row[key]}</td>`;
                    }
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody></table>';
                document.getElementById(tableId).innerHTML = tableHtml;
            }
        });
    }

    // Load data for the Home page
    if (document.getElementById("points-week")) {
        loadCSV("points-week.csv", "points-week");
        loadCSV("rebounds-week.csv", "rebounds-week");
        loadCSV("assists-week.csv", "assists-week");
        loadCSV("steals-week.csv", "steals-week");
        loadCSV("blocks-week.csv", "blocks-week");
        loadCSV("per-week.csv", "per-week");
        loadCSV("points-regular.csv", "points-regular");
        loadCSV("rebounds-regular.csv", "rebounds-regular");
        loadCSV("assists-regular.csv", "assists-regular");
        loadCSV("steals-regular.csv", "steals-regular");
        loadCSV("blocks-regular.csv", "blocks-regular");
        loadCSV("per-regular.csv", "per-regular");
    }

    // Function to load player stats based on filter
    function loadPlayerStats(league, statsType) {
        let csvFile = "";
        if (league === "regular") {
            switch(statsType) {
                case "totals": csvFile = "Regular_Totals.csv"; break;
                case "averages": csvFile = "Regular_Averages.csv"; break;
                case "shooting": csvFile = "Regular_Shooting.csv"; break;
                case "advanced1": csvFile = "Regular_Advanced1.csv"; break;
                case "advanced2": csvFile = "Regular_Advanced2.csv"; break;
                case "four-factors": csvFile = "Regular_Four_Factors.csv"; break;
            }
        } else {
            switch(statsType) {
                case "totals": csvFile = "Playoffs_Totals.csv"; break;
                case "averages": csvFile = "Playoffs_Averages.csv"; break;
                case "shooting": csvFile = "Playoffs_Shooting.csv"; break;
                case "advanced1": csvFile = "Playoffs_Advanced1.csv"; break;
                case "advanced2": csvFile = "Playoffs_Advanced2.csv"; break;
                case "four-factors": csvFile = "Playoffs_Four_Factors.csv"; break;
            }
        }
        loadCSV(csvFile, "player-stats-table", 50);
    }

    // Load initial player stats with default filters
    if (document.getElementById("league-filter")) {
        const leagueFilter = document.getElementById("league-filter");
        const statsTypeFilter = document.getElementById("stats-type-filter");

        leagueFilter.addEventListener("change", function() {
            loadPlayerStats(leagueFilter.value, statsTypeFilter.value);
        });

        statsTypeFilter.addEventListener("change", function() {
            loadPlayerStats(leagueFilter.value, statsTypeFilter.value);
        });

        loadPlayerStats(leagueFilter.value, statsTypeFilter.value);
    }
});
