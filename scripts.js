document.addEventListener("DOMContentLoaded", function() {
    // Countdown Timer
    const countdownDate = new Date("2024-10-13T13:00:00").getTime();

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = 
            days + " Tage " + hours + " Stunden " + minutes + " Minuten " + seconds + " Sekunden ";

        if (distance < 0) {
            clearInterval(interval);
            document.getElementById("countdown").innerHTML = "Saison gestartet!";
        }
    }, 1000);

    // Navigation Dropdown
    document.querySelectorAll('.dropdown-btn').forEach(function(el) {
        el.addEventListener('click', function(event) {
            event.preventDefault();
            const dropdownContent = this.nextElementSibling;
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.dropdown-content a').forEach(function(el) {
        el.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = this.href;
        });
    });
});
