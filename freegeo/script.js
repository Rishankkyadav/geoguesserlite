let map, guessMarker, answerMarker;
let currentRound = 0;
let totalScore = 0;

function initMap() {
  // Initialize the Leaflet map
  map = L.map('map').setView([20, 0], 2);

  // Load OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // Enable marker placement on map click
  map.on('click', function (e) {
    if (guessMarker) guessMarker.remove();
    guessMarker = L.marker(e.latlng).addTo(map);
    document.getElementById('guess-btn').disabled = false;
  });

  document.getElementById('guess-btn').onclick = makeGuess;
  document.getElementById('next-btn').onclick = nextRound;

  loadRound();
}

function loadRound() {
  // Load the image for the current round
  document.getElementById('street-image').src = `images/${currentRound + 1}.jpg`;
  document.getElementById('guess-btn').disabled = true;
  document.getElementById('next-btn').disabled = true;

  // Reset the map and markers
  if (guessMarker) guessMarker.remove();
  if (answerMarker) answerMarker.remove();
  map.setView([20, 0], 2);
}

function makeGuess() {
  const guessedLatLng = guessMarker.getLatLng();
  const actualLatLng = L.latLng(LOCATIONS[currentRound]);

  // Calculate distance and update score
  const distance = guessedLatLng.distanceTo(actualLatLng) / 1000;
  const roundScore = Math.max(5000 - Math.round(distance), 0);
  totalScore += roundScore;

  // Update UI
  document.getElementById('distance').textContent = distance.toFixed(2);
  document.getElementById('score').textContent = totalScore;

  // Mark the correct location on the map
  answerMarker = L.marker(actualLatLng, {
    icon: L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      iconSize: [32, 32],
    }),
  }).addTo(map);

  document.getElementById('guess-btn').disabled = true;
  document.getElementById('next-btn').disabled = false;
}

function nextRound() {
  currentRound++;
  if (currentRound >= LOCATIONS.length) {
    alert(`Game Over! Final Score: ${totalScore}`);
    location.reload();
  } else {
    loadRound();
  }
}

window.onload = initMap;
