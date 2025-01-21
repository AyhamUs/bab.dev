const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startGame');

let score = 0;
let timeLeft = 30;
let scoreMultiplier = 1;
let gameInterval, timerInterval, powerUpInterval;

function getRandomPosition() {
  const x = Math.random() * (gameContainer.clientWidth - 50);
  const y = Math.random() * (gameContainer.clientHeight - 50);
  return { x, y };
}

function createTarget() {
  const target = document.createElement('div');
  target.classList.add('absolute', 'bg-red-600', 'rounded-full', 'w-12', 'h-12', 'cursor-pointer');
  const { x, y } = getRandomPosition();
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener('click', () => {
    score += 10 * scoreMultiplier;
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

function createPowerUp() {
  const powerUp = document.createElement('div');
  powerUp.classList.add('absolute', 'bg-blue-600', 'rounded-full', 'w-12', 'h-12', 'cursor-pointer');
  const { x, y } = getRandomPosition();
  powerUp.style.left = `${x}px`;
  powerUp.style.top = `${y}px`;

  powerUp.addEventListener('click', () => {
    const powerUpType = Math.random() > 0.5 ? 'time' : 'score';
    if (powerUpType === 'time') {
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
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time Left: ${timeLeft}`;

  startButton.disabled = true;
  gameInterval = setInterval(createTarget, 1000);
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
  startButton.disabled = false;
  alert(`Game Over! Your score is ${score}`);
}

startButton.addEventListener('click', startGame);
