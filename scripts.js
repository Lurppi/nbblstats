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
});
