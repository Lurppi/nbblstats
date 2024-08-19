document.addEventListener('DOMContentLoaded', function() {
  const leagueTypeSelect = document.getElementById('league-type');
  const statTypeSelect = document.getElementById('stat-type');
  const playerNameInput = document.getElementById('player-name');
  const loadDataButton = document.getElementById('load-data');
  const dataTable = document.getElementById('data-table');

  const leagueTypeOptions = ['League1', 'League2']; // Example options
  const statTypeFiles = {
    totals: 'totals.csv',
    averages: 'averages.csv',
    shooting: 'shooting.csv',
    advanced1: 'advanced1.csv',
    advanced2: 'advanced2.csv',
    four-factors: 'four-factors.csv'
  };

  function populateLeagueOptions() {
    leagueTypeOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      leagueTypeSelect.appendChild(opt);
    });
  }

  function loadTableData() {
    const leagueType = leagueTypeSelect.value;
    const statType = statTypeSelect.value;
    const playerName = playerNameInput.value.trim();
    const csvFile = statTypeFiles[statType];
    
    // Assuming a function fetchCSVData exists that fetches CSV data based on the file name
    fetchCSVData(csvFile, leagueType, playerName).then(data => {
      dataTable.innerHTML = ''; // Clear previous data
      // Populate the table with new data
      renderTable(data);
    }).catch(error => {
      console.error('Error loading data:', error);
    });
  }

  function fetchCSVData(file, league, player) {
    // Implement CSV fetching and parsing logic
    // Return a promise with the parsed data
  }

  function renderTable(data) {
    // Implement table rendering logic
  }

  populateLeagueOptions();

  loadDataButton.addEventListener('click', loadTableData);
});
