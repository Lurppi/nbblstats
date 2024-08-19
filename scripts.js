const tables = {
    "totals": {
        "regular": "path/to/regular_totals.csv",
        "playoffs": "path/to/playoffs_totals.csv"
    },
    "averages": {
        "regular": "path/to/regular_averages.csv",
        "playoffs": "path/to/playoffs_averages.csv"
    },
    "shooting": {
        "regular": "path/to/regular_shooting.csv",
        "playoffs": "path/to/playoffs_shooting.csv"
    },
    "advanced1": {
        "regular": "path/to/regular_advanced1.csv",
        "playoffs": "path/to/playoffs_advanced1.csv"
    },
    "advanced2": {
        "regular": "path/to/regular_advanced2.csv",
        "playoffs": "path/to/playoffs_advanced2.csv"
    },
    "fourfactors": {
        "regular": "path/to/regular_fourfactors.csv",
        "playoffs": "path/to/playoffs_fourfactors.csv"
    }
};

function loadTables() {
    const league = document.getElementById('league').value;
    const statType = document.getElementById('stat-type').value;
    const url = tables[statType][league];
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(';'));
            displayTables(rows);
        })
        .catch(error => console.error('Error loading data:', error));
}

function displayTables(data) {
    const container = document.getElementById('player-tables');
    container.innerHTML = '';

    const headers = data[0];
    const rows = data.slice(1);

    if (rows.length === 0) return;

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.classList.add('sortable');
        th.addEventListener('click', () => sortTable(table, headers.indexOf(header)));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

function sortTable(table, columnIndex) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const isNumeric = !isNaN(rows[0].cells[columnIndex].textContent.trim());
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return isNumeric
            ? parseFloat(aText) - parseFloat(bText)
            : aText.localeCompare(bText);
    });
    rows.forEach(row => table.querySelector('tbody').appendChild(row));
}

function filterTable() {
    // Implement the filtering logic here
}

document.addEventListener('DOMContentLoaded', () => {
    loadTables();
});
