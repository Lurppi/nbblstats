// Helper function to load CSV files using PapaParse
function loadCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        header: true,
        complete: function(results) {
            callback(results.data);
        }
    });
}

// Function to update tables on the home page
function updateHomePage() {
    loadCSV('Regular_Totals.csv', function(data) {
        createTable(data, '#regular-points-table', ['Player', 'Points']);
    });
    loadCSV('Playoffs_Totals.csv', function(data) {
        createTable(data, '#playoffs-points-table', ['Player', 'Points']);
    });
    // Repeat for other CSV files as needed
}

function createTable(data, selector, columns) {
    let table = document.querySelector(selector);
    let headers = columns.map(col => `<th>${col}</th>`).join('');
    let rows = data.slice(0, 3).map(row => {
        return `<tr>${columns.map(col => `<td>${row[col] || ''}</td>`).join('')}</tr>`;
    }).join('');
    table.innerHTML = `<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody>`;
}

// Function to update player stats page
function updatePlayerStats() {
    const statType = document.getElementById('stat-type').value;
    const playoffFilter = document.getElementById('playoff-filter').value;
    const minGP = document.getElementById('gp-filter').value;
    const minMP = document.getElementById('mp-filter').value;
    
    let file = `${playoffFilter}_${statType}.csv`;
    
    loadCSV(file, function(data) {
        // Filter by GP and MP
        if (minGP) data = data.filter(row => row.GP >= minGP);
        if (minMP) data = data.filter(row => row.MP >= minMP);
        
        createTable(data, '#player-stats-table', ['Player', 'Position', 'Birth Year', 'GP', 'MP', 'Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'Turnovers', 'Fouls', 'Efficiency', 'DD', 'TD']);
    });
}

// Event listeners for filters
document.getElementById('stat-type').addEventListener('change', updatePlayerStats);
document.getElementById('playoff-filter').addEventListener('change', updatePlayerStats);
document.getElementById('gp-filter').addEventListener('input', updatePlayerStats);
document.getElementById('mp-filter').addEventListener('input', updatePlayerStats);

// Initial data load for home page
updateHomePage();
