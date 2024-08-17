document.addEventListener("DOMContentLoaded", function() {
    // Countdown Timer
    const countdownDate = new Date("2024-10-13T13:00:00").getTime();
    const countdownElement = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "Saison gestartet!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days} Tage ${hours} Stunden ${minutes} Minuten ${seconds} Sekunden`;
    }

    setInterval(updateCountdown, 1000);

    // Menu Navigation
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector(".dropbtn");
        dropbtn.addEventListener("click", () => {
            const content = dropdown.querySelector(".dropdown-content");
            content.classList.toggle("show");
        });

        dropdown.addEventListener("mouseleave", () => {
            const content = dropdown.querySelector(".dropdown-content");
            content.classList.remove("show");
        });
    });

    // Update for Teams page
    const statsTypeSelect = document.getElementById("stats-type");
    const teamsTableContainer = document.getElementById("teams-table-container");

    statsTypeSelect.addEventListener("change", function() {
        const selectedValue = this.value;
        let headers = [];
        switch (selectedValue) {
            case "totals":
            case "averages":
                headers = ["Team", "Division", "League", "Minutes", "Points", "Rebounds", "Assists", "Steals", "Blocks", "Turnovers", "Fouls", "Efficiency"];
                break;
            case "shooting":
                headers = ["Team", "Division", "League", "2PM", "2PA", "2P%", "3PM", "3PA", "3P%", "FGM", "FGA", "FG%", "FTM", "FTA", "FT%"];
                break;
            case "advanced":
                headers = ["Team", "Division", "League", "ORTG", "DRTG", "NRTG", "TS%", "PPP", "PER", "PIE"];
                break;
            case "four-factors":
                headers = ["Team", "Division", "League", "EFG%", "TOV%", "ORB%", "FT-Rate", "EFG%", "TOV%", "ORB%", "FT-Rate"];
                break;
        }
        renderTeamsTable(headers);
    });

    function renderTeamsTable(headers) {
        let tableHTML = `<table>
            <thead>
                <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
                <!-- Dynamische Daten hier einfügen -->
            </tbody>
        </table>`;
        teamsTableContainer.innerHTML = tableHTML;
    }
    
    // Update for Players page
    const playerStatsTypeSelect = document.getElementById("stats-type");
    const playersTableContainer = document.getElementById("players-table-container");

    playerStatsTypeSelect.addEventListener("change", function() {
        const selectedValue = this.value;
        let headers = [];
        switch (selectedValue) {
            case "totals":
                headers = ["Player", "Position", "Birth Year", "Minutes", "Points", "Rebounds", "Assists", "Steals", "Blocks", "Turnovers", "Fouls", "Efficiency", "DD", "TD"];
                break;
            case "averages":
                headers = ["Player", "Position", "Birth Year", "Minutes", "Points", "Rebounds", "Assists", "Steals", "Blocks", "Turnovers", "Fouls", "Efficiency", "PER", "PIE"];
                break;
            case "shooting":
                headers = ["Player", "Position", "Birth Year", "2PM", "2PA", "2P%", "3PM", "3PA", "3P%", "FGM", "FGA", "FG%", "FTM", "FTA", "FT%"];
                break;
            case "advanced1":
                headers = ["Player", "Position", "Birth Year", "ORTG", "DRTG", "NRTG", "OBPM", "DBPM", "BPM", "VORP", "OWS", "DWS", "WS", "WS/40", "PER"];
                break;
            case "advanced2":
                headers = ["Player", "Position", "Birth Year", "FIC", "FIC/Gm", "PIE", "Assist Ratio", "Assist Rate", "AS/TO", "Rebound%", "Steal%", "Block%", "Usage Rate", "TS%"];
                break;
            case "four-factors":
                headers = ["Player", "Position", "Birth Year", "EFG%", "TOV%", "ORB%", "FT-Rate", "EFG%", "TOV%", "ORB%", "FT-Rate"];
                break;
        }
        renderPlayersTable(headers);
    });

    function renderPlayersTable(headers) {
        let tableHTML = `<table>
            <thead>
                <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
                <!-- Dynamische Daten hier einfügen -->
            </tbody>
        </table>`;
        playersTableContainer.innerHTML = tableHTML;
    }
});
