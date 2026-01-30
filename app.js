console.log("Flappy Bird started");

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },

  scene: {
    preload,
    create,
    update
  }
};


new Phaser.Game(config);

let bird;
let pipes;
let ground;
let isGameOver = false;

let pipeSpeed = 2;
let pipeGap = 160;
let spawnDelay = 1500;

let score = 0;
let scoreText;
let gameOverText;
let finalScoreText;

function preload() {
  this.load.image("bg", "assets/background.png");
  this.load.image("road", "assets/road.png");
  this.load.image("pipe", "assets/column.png");
  this.load.image("bird", "assets/bird.png");
}

function create() {

  isGameOver = false;

  // Background
  const bg = this.add.image(
  this.scale.width / 2,
  this.scale.height / 2,
  "bg"
);
bg.setDisplaySize(this.scale.width, this.scale.height);


    // Score text
  score = 0;
  scoreText = this.add.text(
  this.scale.width / 2,
  40,
  "Score: 0",
  {
    fontSize: "32px",
    fill: "#ffffff",
    fontStyle: "bold"
  }
).setOrigin(0.5);

scoreText.setDepth(10);
  // 🔥 FORCE ON TOP
  scoreText.setDepth(10);

  // Game Over UI (hidden initially)
  gameOverText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 - 40,
  "GAME OVER",
  {
    fontSize: "48px",
    fill: "#ff0000",
    fontStyle: "bold"
  }
).setOrigin(0.5).setVisible(false);

finalScoreText = this.add.text(
  this.scale.width / 2,
  this.scale.height / 2 + 20,
  "",
  {
    fontSize: "28px",
    fill: "#ffffff"
  }
).setOrigin(0.5).setVisible(false);

// Keep them on top
gameOverText.setDepth(20);
finalScoreText.setDepth(20);
  // 🔥 ALWAYS ABOVE PIPES
  gameOverText.setDepth(20);
  finalScoreText.setDepth(20);

  // Bird
  bird = this.physics.add.sprite(150, 300, "bird");
  bird.setScale(1.5);
  bird.setCollideWorldBounds(true);

  // Ground
  ground = this.physics.add.staticImage(
  this.scale.width / 2,
  this.scale.height - 20,
  "road"
);
ground.setScale(2).refreshBody();


  // Pipes
  pipes = this.physics.add.group();

  // Spawn pipes infinitely
  this.pipeTimer = this.time.addEvent({
    delay: spawnDelay,
    callback: () => spawnPipePair(this),
    loop: true
  });

  // Increase difficulty over time
  this.time.addEvent({
  delay: 8000, // every 8 seconds
  loop: true,
  callback: () => {

    // Gradually increase pipe speed
    if (pipeSpeed < 4) {
      pipeSpeed += 0.3;
    }

    // Gradually reduce gap (not too aggressive)
    if (pipeGap > 120) {
      pipeGap -= 5;
    }

    // Slightly increase spawn rate
    if (spawnDelay > 1000) {
      spawnDelay -= 100;

      this.pipeTimer.remove(false);
      this.pipeTimer = this.time.addEvent({
        delay: spawnDelay,
        callback: () => spawnPipePair(this),
        loop: true
      });
    }
  }
});


  // Collisions
  this.physics.add.collider(bird, ground, gameOver, null, this);
  this.physics.add.collider(bird, pipes, gameOver, null, this);

  // Controls
  this.input.keyboard.on("keydown-SPACE", flap);
  this.input.on("pointerdown", flap);

  // Restart game on SPACE or click (only after game over)
this.input.keyboard.on("keydown-SPACE", () => {
  if (isGameOver) {
    this.scene.restart();
  }
});

this.input.on("pointerdown", () => {
  if (isGameOver) {
    this.scene.restart();
  }
});
}

function update() {
  if (isGameOver) return;

  pipes.children.iterate((pipe) => {

    // 🔥 CRITICAL SAFETY CHECK
    if (!pipe || !pipe.active) return;

    pipe.x -= pipeSpeed;

    // Score when bird passes bottom pipe
    if (
      !pipe.isTop &&
      !pipe.scored &&
      pipe.x + pipe.width < bird.x
    ) {
      pipe.scored = true;
      score++;
      scoreText.setText("Score: " + score);
    }

    // Recycle pipes safely
    if (pipe.x < -100) {
      pipe.disableBody(true, true);
    }
  });
}


function flap() {
  if (isGameOver) return;
  bird.setVelocityY(-300);
}

function spawnPipePair(scene) {
  if (isGameOver) return;

  const centerY = Phaser.Math.Between(
    scene.scale.height * 0.35,
    scene.scale.height * 0.65
  );

  const startX = scene.scale.width + 60;

  // TOP PIPE
  const topPipe = pipes.get(startX, centerY - pipeGap / 2, "pipe");
  if (!topPipe) return;

  topPipe.setOrigin(0.5, 1);
  topPipe.setDepth(5);
  topPipe.setActive(true).setVisible(true);
  topPipe.body.enable = true;
  topPipe.body.allowGravity = false;
  topPipe.body.immovable = true;
  topPipe.isTop = true;
  topPipe.refreshBody();

  // BOTTOM PIPE
  const bottomPipe = pipes.get(startX, centerY + pipeGap / 2, "pipe");
  if (!bottomPipe) return;

  bottomPipe.setOrigin(0.5, 0);
  bottomPipe.setDepth(5);
  bottomPipe.setActive(true).setVisible(true);
  bottomPipe.body.enable = true;
  bottomPipe.body.allowGravity = false;
  bottomPipe.body.immovable = true;
  bottomPipe.isTop = false;
  bottomPipe.scored = false;
  bottomPipe.refreshBody();
}

  


function gameOver() {
  if (isGameOver) return;

  isGameOver = true;

  // Stop physics
  this.physics.pause();

  // Stop pipe spawning
  this.pipeTimer.remove(false);

  // Visual feedback
  bird.setTint(0xff0000);

  // 🔥 BRING TEXT IN FRONT OF PIPES
  gameOverText.setDepth(20);
  finalScoreText.setDepth(20);

  // Show Game Over UI
  gameOverText.setVisible(true);
  finalScoreText.setText("Final Score: " + score);
  finalScoreText.setVisible(true);
}
