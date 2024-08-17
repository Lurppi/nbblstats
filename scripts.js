document.addEventListener('DOMContentLoaded', function() {
    // Dropdown Navigation
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseover', function() {
            this.querySelector('.dropdown-content').style.display = 'block';
        });

        dropdown.addEventListener('mouseout', function() {
            this.querySelector('.dropdown-content').style.display = 'none';
        });
    });

    // Countdown Timer
    function updateCountdown() {
        const now = new Date();
        const eventDate = new Date('2024-10-13T13:00:00'); // Saisonstart

        const diff = eventDate - now;

        if (diff <= 0) {
            document.getElementById('countdown').innerHTML = 'Die Saison hat begonnen!';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerHTML = `${days} Tage ${hours} Stunden ${minutes} Minuten ${seconds} Sekunden`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Table update based on filter selection
    function updateTable(containerId, filterValue) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear previous content

        let tableHtml = '';

        if (containerId === 'teams-table-container') {
            switch (filterValue) {
                case 'totals':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Division</th>
                                    <th>League</th>
                                    <th>Minutes</th>
                                    <th>Points</th>
                                    <th>Rebounds</th>
                                    <th>Assists</th>
                                    <th>Steals</th>
                                    <th>Blocks</th>
                                    <th>Turnovers</th>
                                    <th>Fouls</th>
                                    <th>Efficiency</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'averages':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Division</th>
                                    <th>League</th>
                                    <th>Minutes</th>
                                    <th>Points</th>
                                    <th>Rebounds</th>
                                    <th>Assists</th>
                                    <th>Steals</th>
                                    <th>Blocks</th>
                                    <th>Turnovers</th>
                                    <th>Fouls</th>
                                    <th>Efficiency</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'shooting':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Division</th>
                                    <th>League</th>
                                    <th>2PM</th>
                                    <th>2PA</th>
                                    <th>2P%</th>
                                    <th>3PM</th>
                                    <th>3PA</th>
                                    <th>3P%</th>
                                    <th>FGM</th>
                                    <th>FGA</th>
                                    <th>FG%</th>
                                    <th>FTM</th>
                                    <th>FTA</th>
                                    <th>FT%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'advanced':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Division</th>
                                    <th>League</th>
                                    <th>ORTG</th>
                                    <th>DRTG</th>
                                    <th>NRTG</th>
                                    <th>TS%</th>
                                    <th>PPP</th>
                                    <th>PER</th>
                                    <th>PIE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'four-factors':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Team</th>
                                    <th>Division</th>
                                    <th>League</th>
                                    <th>[OFFENSE] EFG%</th>
                                    <th>[OFFENSE] TOV%</th>
                                    <th>[OFFENSE] ORB%</th>
                                    <th>[OFFENSE] FT-Rate</th>
                                    <th>[DEFENSE] EFG%</th>
                                    <th>[DEFENSE] TOV%</th>
                                    <th>[DEFENSE] ORB%</th>
                                    <th>[DEFENSE] FT-Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
            }
        } else if (containerId === 'players-table-container') {
            switch (filterValue) {
                case 'totals':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Birth Year</th>
                                    <th>Minutes</th>
                                    <th>Points</th>
                                    <th>Rebounds</th>
                                    <th>Assists</th>
                                    <th>Steals</th>
                                    <th>Blocks</th>
                                    <th>Turnovers</th>
                                    <th>Fouls</th>
                                    <th>Efficiency</th>
                                    <th>DD</th>
                                    <th>TD</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'averages':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Birth Year</th>
                                    <th>Minutes</th>
                                    <th>Points</th>
                                    <th>Rebounds</th>
                                    <th>Assists</th>
                                    <th>Steals</th>
                                    <th>Blocks</th>
                                    <th>Turnovers</th>
                                    <th>Fouls</th>
                                    <th>Efficiency</th>
                                    <th>PER</th>
                                    <th>PIE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'shooting':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Birth Year</th>
                                    <th>2PM</th>
                                    <th>2PA</th>
                                    <th>2P%</th>
                                    <th>3PM</th>
                                    <th>3PA</th>
                                    <th>3P%</th>
                                    <th>FGM</th>
                                    <th>FGA</th>
                                    <th>FG%</th>
                                    <th>FTM</th>
                                    <th>FTA</th>
                                    <th>FT%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'advanced1':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Birth Year</th>
                                    <th>ORTG</th>
                                    <th>DRTG</th>
                                    <th>NRTG</th>
                                    <th>OBPM</th>
                                    <th>DBPM</th>
                                    <th>BPM</th>
                                    <th>VORP</th>
                                    <th>OWS</th>
                                    <th>DWS</th>
                                    <th>WS</th>
                                    <th>WS/40</th>
                                    <th>PER</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'advanced2':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Birth Year</th>
                                    <th>FIC</th>
                                    <th>FIC/Gm</th>
                                    <th>PIE</th>
                                    <th>Assist Ratio</th>
                                    <th>Assist Rate</th>
                                    <th>AS/TO</th>
                                    <th>Rebound%</th>
                                    <th>Steal%</th>
                                    <th>Block%</th>
                                    <th>Usage Rate</th>
                                    <th>TS%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
                case 'four-factors':
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Birth Year</th>
                                    <th>[OFFENSE] EFG%</th>
                                    <th>[OFFENSE] TOV%</th>
                                    <th>[OFFENSE] ORB%</th>
                                    <th>[OFFENSE] FT-Rate</th>
                                    <th>[DEFENSE] EFG%</th>
                                    <th>[DEFENSE] TOV%</th>
                                    <th>[DEFENSE] ORB%</th>
                                    <th>[DEFENSE] FT-Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Add rows dynamically -->
                            </tbody>
                        </table>
                    `;
                    break;
            }
        }

        container.innerHTML = tableHtml;
    }

    // Event listeners for filters
    document.getElementById('stats-filter').addEventListener('change', function() {
        updateTable('teams-table-container', this.value);
    });

    document.getElementById('stats-filter').addEventListener('change', function() {
        updateTable('players-table-container', this.value);
    });
});
