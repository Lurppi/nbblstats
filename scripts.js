$(document).ready(function() {
    // Initialisierung der DataTables
    $('#teams-table').DataTable();
    $('#players-table').DataTable();
    $('#roster-table').DataTable();

    // Daten aus CSV laden
    Papa.parse('teams_data.csv', {
        download: true,
        header: true,
        complete: function(results) {
            $('#teams-table').DataTable().clear().rows.add(results.data).draw();
        }
    });

    Papa.parse('players_data.csv', {
        download: true,
        header: true,
        complete: function(results) {
            $('#players-table').DataTable().clear().rows.add(results.data).draw();
        }
    });

    Papa.parse('roster_data.csv', {
        download: true,
        header: true,
        complete: function(results) {
            $('#roster-table').DataTable().clear().rows.add(results.data).draw();
        }
    });

    // Filter-Logik
    $('#division').on('change', function() {
        $('#teams-table').DataTable().column(1).search(this.value).draw();
        $('#players-table').DataTable().column(1).search(this.value).draw();
    });

    $('#league').on('change', function() {
        $('#teams-table').DataTable().column(2).search(this.value).draw();
        $('#players-table').DataTable().column(2).search(this.value).draw();
    });

    $('#stats-type').on('change', function() {
        // Implementiere die Filter-Logik für Statistikarten
    });

    $('#position').on('change', function() {
        $('#players-table').DataTable().column(3).search(this.value).draw();
    });

    $('#year').on('change', function() {
        $('#players-table').DataTable().column(4).search(this.value).draw();
    });

    $('#team-select').on('change', function() {
        var team = this.value;
        Papa.parse('roster_data.csv', {
            download: true,
            header: true,
            complete: function(results) {
                var filteredData = results.data.filter(row => row.Team === team);
                $('#roster-table').DataTable().clear().rows.add(filteredData).draw();
            }
        });
    });
});
