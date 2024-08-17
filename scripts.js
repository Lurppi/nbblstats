$(document).ready(function() {
    // Initialisiere DataTables für Teams und Spieler
    var teamsTable = $('#teams-table').DataTable();
    var playersTable = $('#players-table').DataTable();

    // Funktion zum Laden der Daten
    function loadCSV(file, table) {
        $.ajax({
            url: file,
            dataType: 'text',
        }).done(function(data) {
            var parsedData = Papa.parse(data, {header: true});
            table.clear();
            table.rows.add(parsedData.data);
            table.draw();
        });
    }

    // Lade die Standarddaten
    loadCSV('teams_totals.csv', teamsTable);
    loadCSV('players_totals.csv', playersTable);

    // Filterfunktionen für Teams
    $('#team-division, #team-league, #team-position, #team-stats').change(function() {
        var division = $('#team-division').val();
        var league = $('#team-league').val();
        var position = $('#team-position').val();
        var statsType = $('#team-stats').val();
        loadCSV(`teams_${statsType}_${division}_${league}_${position}.csv`, teamsTable);
    });

    // Filterfunktionen für Spieler
    $('#player-division, #player-league, #player-position, #player-stats').change(function() {
        var division = $('#player-division').val();
        var league = $('#player-league').val();
        var position = $('#player-position').val();
        var statsType = $('#player-stats').val();
        loadCSV(`players_${statsType}_${division}_${league}_${position}.csv`, playersTable);
    });
});
