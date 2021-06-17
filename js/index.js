
const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");

//IMAGEM INICIAL
const initImg = new Image();
initImg.src = "./images/instructions.png"; 

//PLAYERS OPTION
  const rocketImg = new Image();
  rocketImg.src = "./images/foguete.png";

  const scooterImg = new Image();
  scooterImg.src = "./images/scooter.png";

  const carImg = new Image();
  carImg.src = "./images/car_yellow.png";

  //OBSTÁCULOS
const obsImg = new Image();
obsImg.src = "./images/obs_3cones.png";

const obs2Img = new Image();
obs2Img.src = "./images/obs_cone.png";

// const obs3Img = new Image();
// obs3Img.src = "#";

// const obs4Img = new Image();
// obs4Img.src = "./images/obs_stop.png";

const obs5Img = new Image();
obs5Img.src = "./images/obs_warning.png";

const obs6Img = new Image();
obs6Img.src = "./images/car.png";

const obsArray = [
  {img:obsImg, width:300, heigth: 300}, 
  {img:obs2Img, width:100, heigth: 100}, 
  // {img:obs4Img, width:100, heigth: 200},
  {img:obs5Img, width:150, heigth: 150},
  {img:obs6Img, width:50, heigth: 100}
]

// // 2.SOM
const crashSound = new Audio(); 
crashSound.src = "./sounds/car-crash.wav";
crashSound.volume = 0.1;

// const gameOver = new Audio(); 
// // crashSound.src = "PENDENTE SOM";
// gameOver.volume = 0.1;


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

    // AJUSTAR DE ACORDO COM A MINHA IMAGEM ROAD . IDEAL TER CARRINHOS DO MESMO TAMANHO, SE NÃO IMPACTA AQUI. 
    // 10 e 40 são valores pro carro não sair do asfalto, e parar alguns pixels antes de chegar na grama

    if (this.x <= this.width - 10) { //this.width é a largura do objeto (carrinho)
      this.x = this.width - 10;
    }

    if (this.x >= canvas.width - (this.width + 40)) {
      this.x = canvas.width - (this.width + 40);
    }

    this.y += this.speedY;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

//Calcular colisão => preciso dos dados left, right, top e bottom dos objetos e comparar

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

  // ESTEIRA, ONDE A MÁGICA ACONTECE => TEMOS 2 IMG SEMPRE, 
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

// loop principal do jogo. ele que vai fazeR rodar a cada frame, dando a impressão de movimento.
  updateGame = () => {
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition(); // movimenta o carrinho de acordo com a velocidade (somente no eixo x)
    this.player.draw(); // depois de movimentar => redesenho

    this.updateObstacles();

    this.obstacles.forEach((obstacle) => {
      this.player.crashWith(obstacle)
    })

    this.updateScore();

    this.updateHealth();

    this.animationId = requestAnimationFrame(this.updateGame); //se não salvarmos o "id" do loop de animação, a animação vai rodar pra sempre. "requestAnimationFrame" é nativo do js. Chama a callback, qdo a animação terminar de rodar. Chama esse método várias vezes por segundo. 

    this.checkGameOver(); // verifica se o jogo acabou em todos os frames. Se o health (resultado de crashWith) for > 0, apenas atualiza o health na tela.
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
      obstacle.speedY = 8 //(positivo pq quero que desça na tela). ideal mesma velocidade Y da "road"

      this.obstacles.push(obstacle); 
    }

    this.score++;// cada vez que passa por um obstáculo, aumenta o score do player
    }

  updateHealth(){
    ctx.font = "25px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Your Life: ${this.player.health}`, 60, 75); 
  }

  checkGameOver (){ 
    if (this.player.health <= 0) {
      // gameOver.play();

      cancelAnimationFrame(this.animationId);

      this.gameOver();
    }
    else {//se não der gameOver, vai atualizando o health na tela.
      this.updateHealth()
    }
  };

  updateScore() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${this.score}`, 60, 40); 
  }

  gameOver() 
  { //desenhando na tela
    this.clear(); 

    const gameOverImg = new Image();
    gameOverImg.src = "./images/game_over.png"; // outras imagens aparecem

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

function startGame(player) { //ALTEREI

  const bgImg = new Image(); 
  bgImg.src = "./images/road.png";

  // //ALTEREI
  // const carImg = new Image();
  // carImg.src = "./images/foguete.png";//ALTEREI

  // const carImg = new Image();
  // carImg.src = "./images/scooter.png";

  // const carImg = new Image();
  // carImg.src = "./images/car_yellow.png";

  const backgroundImage = new BackgroundImage (0, 0, canvas.width, canvas.height, bgImg);

  //ALTEREI
  // const player = new GameObject (250 - 60, canvas.height - 120, 100, 100, carImg);// ALTEREI
    // novos tipos de players - VERIFICA DIMENSÕES E IMAGEM (TAM IMAGEM - respeitar a proporção da imagem)
//   const player1 = new GameObject(250 - 25, canvas.height - 120, 50, 100, xxxxImg);
//   const player2 = new GameObject(250 - 25, canvas.height - 120, 50, 100, xxxxImg);

  const game = new Game(backgroundImage, player); 
    // novos tipos de players
//   const game = new Game(backgroundImage, player1);
//   const game = new Game(backgroundImage, player2);
     
  game.start(); // chama a primeira vez a função updateGame

  document.addEventListener("keydown", (event) => {// recebe o evento
    if (event.code === "ArrowLeft") { 
      game.player.speedX = -3; 
    } else if (event.code === "ArrowRight") {
      game.player.speedX = 3; 
    }
  });

  // carrinho parar de andar, se pararmos de pressionar a tecla.  
  document.addEventListener("keyup", () => {
    game.player.speedX = 0;
  });
}

window.onload = () => {
  ctx.drawImage(initImg , 0, 0, 500, 700);

  // scooterBtn = document.getElementById("scooter-button")

  // scooterBtn.addEventListener("click", () => {
  // const player = new GameObject (250 - 60, canvas.height - 120, 100, 100, rocketImg);
  // })

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

  //ORIGINAL BOTÃO START
  // document.getElementById("start-button").onclick = () => {
  //   startGame(player);
  // };
}