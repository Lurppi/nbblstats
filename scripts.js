// Countdown script
function updateCountdown() {
    const endDate = new Date('2024-10-13T13:00:00');
    const now = new Date();
    const timeDiff = endDate - now;

    if (timeDiff <= 0) {
        document.getElementById('countdown').innerHTML = "The season has started!";
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
        ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
