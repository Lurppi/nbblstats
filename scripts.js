document.addEventListener('DOMContentLoaded', function() {
    // Navigation Handling
    document.querySelectorAll('nav ul li a').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let targetId = this.getAttribute('href').replace('.html', '');
            showSection(targetId);
        });
    });

    function showSection(sectionId) {
        document.querySelectorAll('section').forEach(function(section) {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    // DataTables Initialization
    $('#teams-table').DataTable();
    $('#players-table').DataTable();
    $('#roster-table').DataTable();
});
