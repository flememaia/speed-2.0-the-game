
const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");

//Initial image 
const initImg = new Image();
initImg.src = "./images/instructions.png"; 

//Players Option
const rocketImg = new Image();
rocketImg.src = "./images/foguete.png";

const scooterImg = new Image();
scooterImg.src = "./images/scooter.png";

const carImg = new Image();
carImg.src = "./images/car_yellow.png";

//Obstacles
const obsImg = new Image();
obsImg.src = "./images/obs_3cones.png";

const obs2Img = new Image();
obs2Img.src = "./images/obs_cone.png";

const obs5Img = new Image();
obs5Img.src = "./images/obs_warning.png";

const obs6Img = new Image();
obs6Img.src = "./images/car.png";

const obsArray = [
  {img:obsImg, width:300, heigth: 300}, 
  {img:obs2Img, width:100, heigth: 100}, 
  {img:obs5Img, width:150, heigth: 150},
  {img:obs6Img, width:50, heigth: 100}
]

// AUDIO
const crashSound = new Audio(); 
crashSound.src = "./sounds/car-crash.wav";
crashSound.volume = 0.1;

const gameOver = new Audio(); 
gameOver.src = "./sounds/game_over.mp3";
gameOver.volume = 0.1;


class GameObject {
  constructor(x, y, width, height, img) {
    this.x = x; 
    this.y = y;
    this.width = width; 
    this.height = height; 
    this.img = img; 
    this.speedX = 0;
    this.speedY = 0;
    this.health = 500;
  }

  updatePosition() {
    this.x += this.speedX;

    if (this.x <= this.width - 10) { // descontando valores pro carro não sair do asfalto
      this.x = this.width - 10;
    }

    if (this.x >= canvas.width - (this.width + 40)) { // descontando valores pro carro não sair do asfalto
      this.x = canvas.width - (this.width + 40);
    }

    this.y += this.speedY;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith = (obstacle) => {    
    if (!(this.bottom() < obstacle.top() || 
      this.top() > obstacle.bottom() ||  
      this.right() < obstacle.left() || 
      this.left() > obstacle.right() ))
      {
      crashSound.play(); 
      this.health -= 1
      return true
      }
      return false
}
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedY = 3; 
  }

  updatePosition() {
    this.y += this.speedY;
    this.y %= canvas.height; 
  }

  // ESTEIRA 
  draw() {
    ctx.drawImage(this.img, 0, this.y, this.width, this.height); 
    ctx.drawImage(this.img, 0, this.y - canvas.height, this.width, this.height); 
  }
}

class Game {
  constructor(background, player) {
    this.background = background; 
    this.player = player;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.animationId; 
  }

  start = () => { 
    this.updateGame(); 
  };

// loop principal do jogo. 
  updateGame = () => {
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition(); 
    this.player.draw(); 

    this.updateObstacles();

    this.obstacles.forEach((obstacle) => {
      this.player.crashWith(obstacle)
    })

    this.updateScore();

    this.updateHealth();

    this.animationId = requestAnimationFrame(this.updateGame); 

    this.checkGameOver(); 
  };

  updateObstacles = () => {
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) { 
      this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
    }

    if (this.frames % 60 === 0) { 
      const originY = 0; 
      const minX = 90; 
      const maxX = 300; 
      const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

      const randomIndex = Math.floor(Math.random() * (obsArray.length));

      const obstacle = new GameObject (randomX, originY, obsArray[randomIndex].width, obsArray[randomIndex].heigth, obsArray[randomIndex].img); 
      obstacle.speedY = 8 

      this.obstacles.push(obstacle); 
    }

    this.score++;
    }

  updateHealth(){
    ctx.font = "25px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Your Life: ${this.player.health}`, 60, 75); 
  }

  checkGameOver (){ 
    if (this.player.health <= 0) {
      gameOver.play();

      cancelAnimationFrame(this.animationId);

      this.gameOver();
    }
    else {
      this.updateHealth()
    }
  };

  updateScore() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${this.score}`, 60, 40); 
  }

  gameOver() 
  { 
    this.clear(); 

    const gameOverImg = new Image();
    gameOverImg.src = "./images/game_over.png";

    ctx.drawImage(gameOverImg, 0, 0, 500, 700);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Your Final`, 225, 550);
    ctx.fillText(`Score: ${this.score}`, 225, 600);
  }

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
  };
}

function startGame(player) { 

  const bgImg = new Image(); 
  bgImg.src = "./images/road.png";

  const backgroundImage = new BackgroundImage (0, 0, canvas.width, canvas.height, bgImg);

  const game = new Game(backgroundImage, player); 
     
  game.start(); 

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") { 
      game.player.speedX = -3; 
    } else if (event.code === "ArrowRight") {
      game.player.speedX = 3; 
    }
  });

  document.addEventListener("keyup", () => {
    game.player.speedX = 0;
  });
}

window.onload = () => {
  ctx.drawImage(initImg , 0, 0, 500, 700);

  document.getElementById("scooter-button").onclick = () => {
    const player = new GameObject (250 - 60, canvas.height - 120, 100, 100, scooterImg); 
    startGame(player);
  };

  document.getElementById("car-button").onclick = () => {
    const player = new GameObject (250 - 60, canvas.height - 120, 100, 100, carImg); 
    startGame(player);
  };

  document.getElementById("rocket-button").onclick = () => {
    const player = new GameObject (250 - 60, canvas.height - 120, 100, 100, rocketImg); 
    startGame(player);
  };
}