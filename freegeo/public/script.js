// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Default view (global)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let originalCoords = null; // Correct location
let guessedCoords = null;  // User's guess
let score = 0;
let round = 1;
const maxRounds = 5;

// Function to load a random location
function loadLocation() {
  // Replace with your actual location data
  const locations = [
    { lat: 48.8588443, lon: 2.2943506, image: 'images/1.jpg' }, // Eiffel Tower
    { lat: 40.689247, lon: -74.044502, image: 'images/2.jpg' }, // Statue of Liberty
    { lat: 27.1751448, lon: 78.0421422, image: 'images/3.jpg' }, // Taj Mahal
    { lat: 51.5007292, lon: -0.1246254, image: 'images/4.jpg' }, // Big Ben
    { lat: -33.8567844, lon: 151.2152967, image: 'images/5.jpg' } // Sydney Opera House
];


  const randomIndex = Math.floor(Math.random() * locations.length);
  const location = locations[randomIndex];

  // Set the global original coordinates
  originalCoords = [location.lat, location.lon];

  // Update the image
  document.getElementById('street-image').src = location.image;

  // Reset guessedCoords for the new round
  guessedCoords = null;

  // Enable "Make Guess" button
  document.getElementById('guess-btn').disabled = false;
}

// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Function to draw a line between two locations
function drawLine(map, originalCoords, guessedCoords) {
  const polyline = L.polyline([originalCoords, guessedCoords], {
    color: 'red',
    weight: 4,
    opacity: 0.8
  }).addTo(map);

  // Adjust map view to show the line
  map.fitBounds(polyline.getBounds());
}

// Event: Handle map click for guessing
map.on('click', function(e) {
  // Store the guessed coordinates
  guessedCoords = [e.latlng.lat, e.latlng.lng];

  // Add a marker at the guessed location
  L.marker(guessedCoords).addTo(map);

  // Enable "Make Guess" button
  document.getElementById('guess-btn').disabled = false;
});

// Event: Handle "Make Guess" button
document.getElementById('guess-btn').addEventListener('click', function() {
  if (!guessedCoords) return;

  // Calculate the distance
  const distance = calculateDistance(
    originalCoords[0], originalCoords[1],
    guessedCoords[0], guessedCoords[1]
  );

  // Update the score (closer guesses earn more points)
  const roundScore = Math.max(0, Math.floor((5000 - distance) * 0.1));
  score += roundScore;

  // Update the UI
  document.getElementById('distance').innerText = distance.toFixed(2);
  document.getElementById('score').innerText = score;

  // Draw the line between the original location and the guess
  drawLine(map, originalCoords, guessedCoords);

  // Disable "Make Guess" button
  document.getElementById('guess-btn').disabled = true;

  // Enable "Next Round" button
  document.getElementById('next-btn').disabled = false;
});

// Event: Handle "Next Round" button
document.getElementById('next-btn').addEventListener('click', function() {
  round++;
  if (round > maxRounds) {
    alert(`Game Over! Your final score is: ${score}`);
    round = 1;
    score = 0;
  }

  // Clear map markers and polylines
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  // Update UI
  document.getElementById('distance').innerText = '-';
  document.getElementById('next-btn').disabled = true;

  // Load a new location
  loadLocation();
});

// Initialize the game
loadLocation();
