const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startGame');
const startMenu = document.createElement('div');
const upgradeMenu = document.createElement('div');

let score = 0;
let timeLeft = 30;
let scoreMultiplier = 1;
let targetSpeed = 1000; // Time in ms between targets appearing
let gameInterval, timerInterval, powerUpInterval;

let upgrades = {
  scoreBoost: 0,
  fasterTargets: 0,
  targetSize: 12, // Default target size
  timeFreezeChance: 0.2, // 20% chance to freeze time
};

// Start Menu
function showStartMenu() {
  startMenu.innerHTML = `
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-gray-900 p-6 rounded-lg">
      <h2 class="text-3xl font-bold text-white mb-4">Welcome to Catch the Target!</h2>
      <button id="startGameBtn" class="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Start Game</button>
      <button id="shopBtn" class="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">Shop (Upgrades)</button>
      <button id="instructionsBtn" class="mt-4 px-6 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700">Instructions</button>
    </div>
  `;
  gameContainer.appendChild(startMenu);

  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('shopBtn').addEventListener('click', showUpgradeMenu);
  document.getElementById('instructionsBtn').addEventListener('click', showInstructions);
}

// Upgrade Menu
function showUpgradeMenu() {
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
  document.getElementById('backBtn').addEventListener('click', () => {
    upgradeMenu.style.display = 'none';
    showStartMenu();
  });
}

// Instructions Menu
function showInstructions() {
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

  document.getElementById('backToMenu').addEventListener('click', () => {
    instructions.style.display = 'none';
    showStartMenu();
  });
}

// Upgrade Logic
function upgrade(upgradeType) {
  const cost = getUpgradeCost(upgradeType);
  if (score >= cost) {
    score -= cost;
    upgrades[upgradeType]++;
    updateUpgradeUI(upgradeType);
    scoreDisplay.textContent = `Score: ${score}`;
    applyUpgrades();
  } else {
    alert("Not enough score to upgrade!");
  }
}

function getUpgradeCost(upgradeType) {
  if (upgradeType === 'scoreBoost') return 100 * (upgrades.scoreBoost + 1);
  if (upgradeType === 'fasterTargets') return 200 * (upgrades.fasterTargets + 1);
  if (upgradeType === 'timeFreezeChance') return 150 * (upgrades.timeFreezeChance + 0.1);
}

function updateUpgradeUI(upgradeType) {
  if (upgradeType === 'scoreBoost') {
    document.querySelector('#scoreBoostBtn').textContent = `Upgrade Score Boost (Cost: ${getUpgradeCost('scoreBoost')})`;
  }
  if (upgradeType === 'fasterTargets') {
    document.querySelector('#fasterTargetsBtn').textContent = `Upgrade Speed (Cost: ${getUpgradeCost('fasterTargets')})`;
  }
  if (upgradeType === 'timeFreezeChance') {
    document.querySelector('#timeFreezeBtn').textContent = `Upgrade Freeze Chance (Cost: ${getUpgradeCost('timeFreezeChance')})`;
  }
}

function applyUpgrades() {
  scoreMultiplier = 1 + upgrades.scoreBoost * 0.1;
  targetSpeed = Math.max(500, 1000 - upgrades.fasterTargets * 100); // Max speed is 500ms
  upgrades.timeFreezeChance = Math.min(0.8, upgrades.timeFreezeChance); // Cap freeze chance to 80%
}

function getRandomPosition() {
  const x = Math.random() * (gameContainer.clientWidth - upgrades.targetSize);
  const y = Math.random() * (gameContainer.clientHeight - upgrades.targetSize);
  return { x, y };
}

function createTarget() {
  const target = document.createElement('div');
  target.classList.add('absolute', 'bg-red-600', 'rounded-full', 'cursor-pointer');
  target.style.width = `${upgrades.targetSize}px`;
  target.style.height = `${upgrades.targetSize}px`;

  const { x, y } = getRandomPosition();
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener('click', () => {
    score += 10 * scoreMultiplier;
    scoreDisplay.textContent = `Score: ${score}`;
    target.style.animation = 'scaleUp 0.2s ease-out';
    gameContainer.removeChild(target);
  });

  gameContainer.appendChild(target);

  // Animation for target disappearing
  setTimeout(() => {
    if (gameContainer.contains(target)) {
      target.style.animation = 'scaleDown 0.2s ease-out';
      setTimeout(() => gameContainer.removeChild(target), 200);
    }
  }, 2000);
}

function createPowerUp() {
  const powerUp = document.createElement('div');
  powerUp.classList.add('absolute', 'bg-blue-600', 'rounded-full', 'cursor-pointer');
  const { x, y } = getRandomPosition();
  powerUp.style.left = `${x}px`;
  powerUp.style.top = `${y}px`;

  powerUp.addEventListener('click', () => {
    if (Math.random() < upgrades.timeFreezeChance) {
      activateTimeFreeze();
    } else {
      activateScoreMultiplier();
    }
    gameContainer.removeChild(powerUp);
  });

  gameContainer.appendChild(powerUp);

  setTimeout(() => {
    if (gameContainer.contains(powerUp)) {
      gameContainer.removeChild(powerUp);
    }
  }, 2000);
}

function activateTimeFreeze() {
  clearInterval(timerInterval);
  setTimeout(() => {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time Left: ${timeLeft}`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }, 3000); // Freeze for 3 seconds
}

function activateScoreMultiplier() {
  scoreMultiplier = 2;
  setTimeout(() => {
    scoreMultiplier = 1;
  }, 5000); // Score multiplier for 5 seconds
}

function startGame() {
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

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(powerUpInterval);
  alert(`Game Over! Your score is ${score}`);
  showStartMenu(); // Show the start menu after game over
}

document.addEventListener('DOMContentLoaded', showStartMenu);
