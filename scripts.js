document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseover', function() {
            this.querySelector('.dropdown-content').style.display = 'block';
        });
        dropdown.addEventListener('mouseout', function() {
            this.querySelector('.dropdown-content').style.display = 'none';
        });
    });

    // Countdown timer for season start
    const countDownDate = new Date("Oct 13, 2024 13:00:00").getTime();

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = `${days}d ${hours
