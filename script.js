<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flippy Bird 🐥</title>
<style>
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    background: linear-gradient(to bottom, #87ceeb, #e0f7fa);
    font-family: 'Arial', sans-serif;
  }

  #gameCanvas {
    display: block;
    background: transparent;
  }

  #startScreen, #gameOverScreen {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 2rem;
    z-index: 2;
  }

  button {
    padding: 15px 30px;
    font-size: 1.5rem;
    border: none;
    border-radius: 12px;
    background: #ffca28;
    color: #222;
    cursor: pointer;
    margin-top: 20px;
    transition: 0.2s;
  }

  button:hover {
    background: #ffc107;
    transform: scale(1.05);
  }
</style>
</head>
<body>

<canvas id="gameCanvas"></canvas>

<div id="startScreen">
  <div>🐥 <b>Flippy Bird</b> 🕹️</div>
  <button id="startBtn">Start Game</button>
</div>

<div id="gameOverScreen" style="display:none;">
  <div>💀 Game Over 💀</div>
  <button id="restartBtn">Play Again</button>
</div>

<script>
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const gravity = 0.6;
  const jump = -10;
  const pipeWidth = 80;
  const pipeGap = 220;
  const birdSize = 40;
  let birdY, birdVY, pipes, score, gameRunning;

  // Sounds
  const startSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.wav");
  const jumpSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.wav");
  const hitSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.wav");

  function resetGame() {
    birdY = height / 2;
    birdVY = 0;
    score = 0;
    pipes = [];
    gameRunning = true;
  }

  function addPipe() {
    const topHeight = Math.random() * (height - pipeGap - 200) + 50;
    pipes.push({ x: width, top: topHeight });
  }

  function drawBird() {
    ctx.font = `${birdSize}px Arial`;
    ctx.fillText("🐥", 80, birdY);
  }

  function drawPipes() {
    ctx.font = "50px Arial";
    pipes.forEach(p => {
      for (let y = 0; y < p.top; y += 50) ctx.fillText("🟩", p.x, y);
      for (let y = p.top + pipeGap; y < height; y += 50) ctx.fillText("🟩", p.x, y);
    });
  }

  function drawScore() {
    ctx.fillStyle = "#222";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 20, 40);
  }

  function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, width, height);

    birdVY += gravity;
    birdY += birdVY;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 350) {
      addPipe();
    }

    pipes.forEach(p => p.x -= 4);
    if (pipes[0].x + pipeWidth < 0) {
      pipes.shift();
      score++;
    }

    drawPipes();
    drawBird();
    drawScore();

    // Collision
    const birdTop = birdY - birdSize / 2;
    const birdBottom = birdY + birdSize / 2;
    if (birdTop < 0 || birdBottom > height) endGame();

    for (let p of pipes) {
      if (80 + birdSize > p.x && 80 < p.x + pipeWidth &&
        (birdY < p.top || birdY > p.top + pipeGap)) {
        endGame();
      }
    }

    requestAnimationFrame(updateGame);
  }

  function endGame() {
    if (!gameRunning) return;
    gameRunning = false;
    hitSound.play();
    document.getElementById("gameOverScreen").style.display = "flex";
  }

  function jumpBird() {
    if (gameRunning) {
      birdVY = jump;
      jumpSound.play();
    }
  }

  document.getElementById("startBtn").onclick = () => {
    startSound.play();
    document.getElementById("startScreen").style.display = "none";
    resetGame();
    updateGame();
  };

  document.getElementById("restartBtn").onclick = () => {
    startSound.play();
    document.getElementById("gameOverScreen").style.display = "none";
    resetGame();
    updateGame();
  };

  document.addEventListener("keydown", e => {
    if (e.code === "Space") jumpBird();
  });
  document.addEventListener("click", jumpBird);
</script>
</body>
</html>
