const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 32; // Size of each tile/sprite
let balance = 0;

const character = {
    x: canvas.width / 2 - tileSize / 2,
    y: canvas.height / 2 - tileSize / 2,
    width: tileSize,
    height: tileSize,
    sprite: new Image()
};

character.sprite.src = 'character.png';

const seeds = [];

document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            character.y -= tileSize;
            break;
        case 'ArrowDown':
        case 's':
            character.y += tileSize;
            break;
        case 'ArrowLeft':
        case 'a':
            character.x -= tileSize;
            break;
        case 'ArrowRight':
        case 'd':
            character.x += tileSize;
            break;
        case ' ':
            plantSeed();
            break;
    }
});

function plantSeed() {
    seeds.push({
        x: character.x,
        y: character.y,
        countdown: 15
    });
}

function updateSeeds() {
    for (let i = seeds.length - 1; i >= 0; i--) {
        seeds[i].countdown -= 1;
        if (seeds[i].countdown <= 0) {
            seeds.splice(i, 1);
            balance += 10;
            document.getElementById('balance').textContent = `Balance: $${balance}`;
        }
    }
}

function drawCharacter() {
    ctx.drawImage(character.sprite, character.x, character.y, character.width, character.height);
}

function drawSeeds() {
    seeds.forEach(seed => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(seed.x, seed.y, tileSize, tileSize);
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCharacter();
    drawSeeds();
    updateSeeds();

    requestAnimationFrame(gameLoop);
}

character.sprite.onload = () => {
    gameLoop();
};
