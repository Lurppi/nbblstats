function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(function(section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Initialisieren der DataTables
$(document).ready(function() {
    $('#teams-table').DataTable();
    $('#players-table').DataTable();
    $('#roster-table').DataTable();
});
