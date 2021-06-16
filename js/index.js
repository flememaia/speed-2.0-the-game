
const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");

const obsImg = new Image();
obsImg.src = "./images/car.png";

const obs2Img = new Image();
obs2Img.src = "./images/car_yellow.png";

const obs3Img = new Image();
obs3Img.src = "./images/obstacle1.png";

const obsArray = [{img:obsImg, width:50, heigth: 100}, {img:obs2Img, width:50, heigth: 100}, {img:obs3Img, width:100, heigth: 100}]

// pra já ter uma imagem no CANVAS antes de começar o jogo, eu preciso incluir aqui, certo?

// // 2.SOM
// const crashSound = new Audio(); 
// // crashSound.src = "PENDENTE SOM";
// crashSound.volume = 0.1;

// const newLife = new Audio(); 
// // crashSound.src = "PENDENTE SOM";
// newLife.volume = 0.1;

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

    // if (this.x <= this.width - 10) { //this.width é a largura do objeto (carrinho)
    //   this.x = this.width - 10;
    // }

    // if (this.x >= canvas.width - (this.width + 40)) {
    //   this.x = canvas.width - (this.width + 40);
    // }

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
      // crashSound.play(); // PENDENTE acrescentei o aúdio de crash aqui
      this.health -= 1
      console.log(this.health)
      return true
      }
      return false
}
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedY = 1; 
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

    if (this.frames % 120 === 0) { 
      const originY = 0; 
      const minX = 50; // PENSEI EM ALTERAR DE 90 que é a grama até (500 - 90 - 50) => 360 (descontando a grama da direita + tam obs)
      const maxX = 360; //TALVEZ POSSA SER MAIOR AQUI 
      const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

      const randomIndex = Math.floor(Math.random() * (obsArray.length));

      const obstacle = new GameObject (randomX, originY, obsArray[randomIndex].width, obsArray[randomIndex].heigth, obsArray[randomIndex].img); 
      obstacle.speedY = 3 //(positivo pq quero que desça na tela). ideal mesma velocidade Y da "road"

      this.obstacles.push(obstacle); 
    }

    this.score++;// cada vez que passa por um obstáculo, aumenta o score do player
    }

  updateHealth(){
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.player.health}`, 80, 80); //AJUSTAR ONDE APARECER NA TELA
  }

  checkGameOver (){ // coloquei que ela chama a crashWith, e crashWith retorna o valor atualizado do player.health
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
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.score}`, 80, 40); // ARRUMAR POSIÇÃO (80,40) DE ACORDO COM A MINHA ROAD
  }

  gameOver() 
  { //desenhando na tela
    this.clear(); 

    const gameOverImg = new Image();
    gameOverImg.src = "./images/car.png";

    //posso desenhar direto a imagem, não preciso criar uma classe => TESTE PEDRO OK 
    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Your Final Score: ${this.score}`, canvas.width / 6, canvas.height);
  }

// Limpar a tela toda (antes de desenhar de novo)
  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpar a tela toda
  };
}
// FUNÇÃO PARA AGRUPAR A INSTANCIALIZAÇÃO DAS CLASSES E IMAGENS PRO JOGO COMEÇAR
function startGame() {

  const bgImg = new Image(); 
  bgImg.src = "./images/road.png"; // MUDAR

  const carImg = new Image();
  carImg.src = "./images/car_yellow.png";

  const backgroundImage = new BackgroundImage (0, 0, canvas.width, canvas.height, bgImg);

// carrinhos - VERIFICA DIMENSÕES DE ACORDO COM AS MINHAS FIGURAS
  const player = new GameObject (250 - 25, canvas.height - 120, 50, 100, carImg);
    // novos tipos de players - VERIFICA DIMENSÕES E IMAGEM (TAM IMAGEM - respeitar a proporção da imagem)
//   const player1 = new GameObject(250 - 25, canvas.height - 120, 50, 100, xxxxImg);
//   const player2 = new GameObject(250 - 25, canvas.height - 120, 50, 100, xxxxImg);

  // ACREDITO QUE PRECISO COLOCAR UM IF NO BOTÃO QUE A PESSOA ESCOLHEU O PLAYER
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
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
}
