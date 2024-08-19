document.addEventListener('DOMContentLoaded', function() {
  const playersTableBody = document.querySelector('#players-table tbody');

  function loadPlayersData() {
    // Assuming a function fetchPlayersData exists that fetches player data
    fetchPlayersData().then(players => {
      playersTableBody.innerHTML = ''; // Clear previous rows
      players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${player.name}</td>
          <td>${player.team}</td>
          <td>${player.position}</td>
          <td>${player.stats}</td>
        `;
        playersTableBody.appendChild(row);
      });
    }).catch(error => {
      console.error('Error loading players data:', error);
    });
  }

  function fetchPlayersData() {
    // Implement data fetching logic
    // Return a promise with the player data
  }

  loadPlayersData();
});
