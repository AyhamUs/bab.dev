const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const startMenu = document.createElement('div');
const upgradeMenu = document.createElement('div');

let score = 0;
let timeLeft = 30;
let gameInterval, timerInterval, powerUpInterval;
let targetSpeed = 1000; // Time in ms between targets appearing

let upgrades = {
  scoreBoost: 0,
  fasterTargets: 0,
  targetSize: 12, // Default target size
  timeFreezeChance: 0.2, // 20% chance to freeze time
};

// Start Menu
function showStartMenu() {
  // Cleanup the game state if returning to the menu
  cleanupGame();

  startMenu.innerHTML = `
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-gray-900 p-6 rounded-lg">
      <h2 class="text-3xl font-bold text-white mb-4">Welcome to Catch the Target!</h2>
      <button id="startGameBtn" class="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Start Game</button>
      <button id="shopBtn" class="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">Shop (Upgrades)</button>
      <button id="instructionsBtn" class="mt-4 px-6 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700">Instructions</button>
    </div>
  `;
  gameContainer.innerHTML = ''; // Clear any previous game elements
  gameContainer.appendChild(startMenu);

  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('shopBtn').addEventListener('click', showUpgradeMenu);
  document.getElementById('instructionsBtn').addEventListener('click', showInstructions);
}

// Cleanup function to clear game state and intervals
function cleanupGame() {
  // Clear any active intervals
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(powerUpInterval);

  // Reset game state
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time Left: ${timeLeft}`;

  // Clear any existing game elements
  gameContainer.innerHTML = '';
}

// Upgrade Menu
function showUpgradeMenu() {
  cleanupGame(); // Clean up game state before showing upgrades

  startMenu.style.display = 'none'; // Hide the start menu
  upgradeMenu.innerHTML = `
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-gray-900 p-6 rounded-lg">
      <h2 class="text-3xl font-bold text-white mb-4">Upgrades</h2>
      <div class="text-left text-white mb-4">
        <p>Score Boost: +${upgrades.scoreBoost}</p>
        <button id="scoreBoostBtn" class="w-full mt-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Upgrade Score Boost (Cost: 100)</button>
        <p>Faster Targets: Speed ${1000 - targetSpeed}ms</p>
        <button id="fasterTargetsBtn" class="w-full mt-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Upgrade Speed (Cost: 200)</button>
        <p>Time Freeze Chance: ${Math.round(upgrades.timeFreezeChance * 100)}%</p>
        <button id="timeFreezeBtn" class="w-full mt-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Upgrade Freeze Chance (Cost: 150)</button>
      </div>
      <button id="backBtn" class="mt-4 px-6 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700">Back to Menu</button>
    </div>
  `;
  gameContainer.appendChild(upgradeMenu);

  document.getElementById('scoreBoostBtn').addEventListener('click', () => upgrade('scoreBoost'));
  document.getElementById('fasterTargetsBtn').addEventListener('click', () => upgrade('fasterTargets'));
  document.getElementById('timeFreezeBtn').addEventListener('click', () => upgrade('timeFreezeChance'));
  document.getElementById('backBtn').addEventListener('click', showStartMenu);
}

// Instructions Menu
function showInstructions() {
  cleanupGame(); // Clean up game before showing instructions

  startMenu.style.display = 'none'; // Hide the start menu
  const instructions = document.createElement('div');
  instructions.innerHTML = `
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-gray-900 p-6 rounded-lg">
      <h2 class="text-3xl font-bold text-white mb-4">Instructions</h2>
      <p class="text-white">Click on the targets to score points!</p>
      <p class="text-white mt-2">Upgrade your abilities in the shop to make the game easier!</p>
      <button id="backToMenu" class="mt-4 px-6 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700">Back to Menu</button>
    </div>
  `;
  gameContainer.appendChild(instructions);

  document.getElementById('backToMenu').addEventListener('click', showStartMenu);
}

// Fullscreen Toggle
fullscreenBtn.addEventListener('click', () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
    document.documentElement.msRequestFullscreen();
  }

  // Hide fullscreen button when in fullscreen mode
  fullscreenBtn.style.display = 'none';
});

// Detect fullscreen change
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.style.display = 'block'; // Show button again when exiting fullscreen
  }
});

// Start Game
function startGame() {
  cleanupGame(); // Clear any previous game state

  score = 0;
  timeLeft = 30;
  scoreMultiplier = 1;
  upgrades.scoreBoost = 0;
  upgrades.fasterTargets = 0;
  upgrades.timeFreezeChance = 0.2;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time Left: ${timeLeft}`;
  gameContainer.innerHTML = ''; // Clear any previous game

  startMenu.style.display = 'none'; // Hide the start menu
  gameInterval = setInterval(createTarget, targetSpeed);
  powerUpInterval = setInterval(createPowerUp, 5000); // Power-ups appear every 5 seconds
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End Game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(powerUpInterval);
  alert(`Game Over! Your score is ${score}`);
  showStartMenu(); // Show the start menu after game over
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
    score += (10 * scoreMultiplier);
    scoreDisplay.textContent = `Score: ${score}`;
    gameContainer.removeChild(target);
  });

  gameContainer.appendChild(target);

  setTimeout(() => {
    if (gameContainer.contains(target)) {
      gameContainer.removeChild(target);
    }
  }, 2000);
}

// Function to create power-ups
function createPowerUp() {
  const powerUp = document.createElement('div');
  powerUp.classList.add('absolute', 'bg-yellow-500', 'rounded-full', 'w-8', 'h-8', 'cursor-pointer');
  const x = Math.random() * (gameContainer.clientWidth - 50);
  const y = Math.random() * (gameContainer.clientHeight - 50);
  powerUp.style.left = `${x}px`;
  powerUp.style.top = `${y}px`;

  powerUp.addEventListener('click', () => {
    // Apply some game-changing power-up logic here (e.g., freezing time, increasing score, etc.)
    scoreMultiplier *= 2;
    scoreDisplay.textContent = `Score: ${score}`;
    gameContainer.removeChild(powerUp);
  });

  gameContainer.appendChild(powerUp);

  setTimeout(() => {
    if (gameContainer.contains(powerUp)) {
      gameContainer.removeChild(powerUp);
    }
  }, 2000);
}
