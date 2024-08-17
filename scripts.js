document.addEventListener('DOMContentLoaded', function () {
    // Countdown Timer
    const countdownDate = new Date('October 13, 2024 13:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById('countdown').innerHTML = "EXPIRED";
        }
    }

    setInterval(updateCountdown, 1000);

    // Add event listeners for filtering
    document.getElementById('stats-type').addEventListener('change', function () {
        const filterValue = this.value;
        updateTableContent(filterValue);
    });

    function updateTableContent(statsType) {
        const container = document.getElementById('teams-table-container');
        container.innerHTML = ''; // Clear previous content

        // Add new content based on the selected filter
        // This would typically be done with AJAX requests or by updating the DOM with data
    }
});
