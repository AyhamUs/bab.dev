const gameContainer = document.getElementById('gameContainer');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameMain = document.getElementById('gameMain');
let money = 0;
let timeLeft = 30;
let scoreMultiplier = 1;
let gameInterval, timerInterval;

// Fullscreen Toggle functionality
fullscreenBtn.addEventListener('click', () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
    document.documentElement.msRequestFullscreen();
  }

  // Hide fullscreen button when in fullscreen mode
  fullscreenBtn.style.display = 'none';
});

// Detect when exiting fullscreen
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.style.display = 'block'; // Show button again when exiting fullscreen
  }
});

// Function to load money from cookies
function loadMoney() {
  const savedMoney = getCookie('money');
  if (savedMoney) {
    money = parseInt(savedMoney, 10);
  }
}

// Function to save money to cookies
function saveMoney() {
  setCookie('money', money, 30); // Store for 30 days
}

// Utility function to get a cookie value
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Utility function to set a cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to start the game
function startGame() {
  cleanupGame();
  money = 0;
  timeLeft = 30;
  scoreMultiplier = 1;
  gameInterval = setInterval(createTarget, 1000); // Create targets every second
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Function to clean up game state
function cleanupGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameContainer.innerHTML = ''; // Clear previous game content
  moneyDisplay = document.createElement('div');
  moneyDisplay.textContent = `$ ${money}`;
  gameContainer.appendChild(moneyDisplay);
}

// Handle end of the game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Save money to cookies and show a message
  saveMoney();
  alert(`Game Over! Your money: $${money}`);
  
  // Show "Back to Menu" button
  const backToMenuButton = document.createElement('button');
  backToMenuButton.textContent = 'Back to Menu';
  backToMenuButton.classList.add('mt-4', 'px-6', 'py-2', 'bg-gray-600', 'text-white', 'font-bold', 'rounded', 'hover:bg-gray-700');
  backToMenuButton.addEventListener('click', showStartMenu);
  gameContainer.appendChild(backToMenuButton);
}

// Function to create targets
function createTarget() {
  const target = document.createElement('div');
  target.classList.add('absolute', 'bg-red-600', 'rounded-full', 'w-12', 'h-12', 'cursor-pointer');
  const x = Math.random() * (gameContainer.clientWidth - 50);
  const y = Math.random() * (gameContainer.clientHeight - 50);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener('click', () => {
    money += (10 * scoreMultiplier);  // Update money
    gameContainer.removeChild(target);
  });

  gameContainer.appendChild(target);

  setTimeout(() => {
    if (gameContainer.contains(target)) {
      gameContainer.removeChild(target);
    }
  }, 2000);
}

// Show Start Menu
function showStartMenu() {
  loadMoney(); // Ensure money is loaded from cookies
  gameContainer.innerHTML = ''; // Clear any previous game content

  const startMenu = document.createElement('div');
  startMenu.innerHTML = `
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-gray-900 p-6 rounded-lg">
      <h2 class="text-3xl font-bold text-white mb-4">Welcome to Catch the Target!</h2>
      <h3 class="text-xl text-white mb-4">Your Money: $${money}</h3>
      <button id="startGameBtn" class="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Start Game</button>
    </div>
  `;
  
  gameContainer.appendChild(startMenu);

  document.getElementById('startGameBtn').addEventListener('click', startGame);
}

// Initialize the game by showing the start menu
showStartMenu();
