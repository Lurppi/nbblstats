document.addEventListener("DOMContentLoaded", function() {
    // Initialize filters and table on the players page
    if (document.getElementById("league-filter")) {
        initializeFilters();
        loadTableData();
    }

    // Event listeners for filters
    document.getElementById("league-filter").addEventListener("change", loadTableData);
    document.getElementById("stat-type-filter").addEventListener("change", loadTableData);
    document.getElementById("division-filter").addEventListener("change", applyFilters);
    document.getElementById("team-filter").addEventListener("change", applyFilters);
    document.getElementById("position-filter").addEventListener("change", applyFilters);
    document.getElementById("year-filter").addEventListener("change", applyFilters);
    document.getElementById("games-filter").addEventListener("input", applyFilters);
    document.getElementById("minutes-filter").addEventListener("input", applyFilters);
});

function initializeFilters() {
    // Populate dynamic filters with 'All' option
    const divisionFilter = document.getElementById("division-filter");
    const teamFilter = document.getElementById("team-filter");
    const positionFilter = document.getElementById("position-filter");
    const yearFilter = document.getElementById("year-filter");

    divisionFilter.innerHTML = '<option value="all">All</option>';
    teamFilter.innerHTML = '<option value="all">All</option>';
    positionFilter.innerHTML = '<option value="all">All</option>';
    yearFilter.innerHTML = '<option value="all">All</option>';
}

function loadTableData() {
    const league = document.getElementById("league-filter").value;
    const statType = document.getElementById("stat-type-filter").value;

    let csvFile = `data/${league}-${statType}.csv`;

    // Fetch and parse CSV file
    fetch(csvFile)
        .then(response => response.text())
        .then(csvData => {
            const rows = csvData.split("\n").map(row => row.split(";"));
            const headers = rows[0];
            const data = rows.slice(1);

            // Update dynamic filters based on CSV data
            updateDynamicFilters(data);

            // Generate and display the table
            generateTable(headers, data);
        });
}

function updateDynamicFilters(data) {
    const divisionFilter = document.getElementById("division-filter");
    const teamFilter = document.getElementById("team-filter");
    const positionFilter = document.getElementById("position-filter");
    const yearFilter = document.getElementById("year-filter");

    const divisions = new Set();
    const teams = new Set();
    const positions = new Set();
    const years = new Set();

    data.forEach(row => {
        divisions.add(row[headers.indexOf("DIV")]);
        teams.add(row[headers.indexOf("TEAM")]);
        positions.add(row[headers.indexOf("POS")]);
        years.add(row[headers.indexOf("BORN")]);
    });

    populateFilterOptions(divisionFilter, divisions);
    populateFilterOptions(teamFilter, teams);
    populateFilterOptions(positionFilter, positions);
    populateFilterOptions(yearFilter, years);
}

function populateFilterOptions(filterElement, options) {
    filterElement.innerHTML = '<option value="all">All</option>';
    options.forEach(option => {
        filterElement.innerHTML += `<option value="${option}">${option}</option>`;
    });
}

function generateTable(headers, data) {
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = ''; // Clear previous table

    const table = document.createElement("table");
    table.classList.add("stats-table");

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Generate table headers
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Generate table rows
    data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function applyFilters() {
    const divisionFilter = document.getElementById("division-filter").value;
    const teamFilter = document.getElementById("team-filter").value;
    const positionFilter = document.getElementById("position-filter").value;
    const yearFilter = document.getElementById("year-filter").value;
    const gamesFilter = parseInt(document.getElementById("games-filter").value, 10);
    const minutesFilter = parseInt(document.getElementById("minutes-filter").value, 10);

    const rows = document.querySelectorAll("#table-container tbody tr");

    rows.forEach(row => {
        const division = row.cells[headers.indexOf("DIV")].textContent;
        const team = row.cells[headers.indexOf("TEAM")].textContent;
        const position = row.cells[headers.indexOf("POS")].textContent;
        const year = row.cells[headers.indexOf("BORN")].textContent;
        const games = parseInt(row.cells[headers.indexOf("GAMES")].textContent, 10);
        const minutes = parseInt(row.cells[headers.indexOf("MINUTES")].textContent, 10);

        let display = true;

        if (divisionFilter !== "all" && divisionFilter !== division) display = false;
        if (teamFilter !== "all" && teamFilter !== team) display = false;
        if (positionFilter !== "all" && positionFilter !== position) display = false;
        if (yearFilter !== "all" && yearFilter !== year) display = false;
        if (!isNaN(gamesFilter) && games < gamesFilter) display = false;
        if (!isNaN(minutesFilter) && minutes < minutesFilter) display = false;

        row.style.display = display ? "" : "none";
    });
}
