
const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");

class GameObject {

  constructor(x, y, width, height, img) {
    this.x = x; 
    this.y = y; 
    this.width = width; 
    this.height = height; 
    this.img = img; 
    this.speedX = 0;
    this.speedY = 0;
    this.health = 50;
  }

  updatePosition() {
    this.x += this.speedX;

    // AJUSTAR DE ACORDO COM A MINHA IMAGEM ROAD . IDEAL TER CARRINHOS DO MESMO TAMANHO, SE NÃO IMPACTA AQUI. 
    // 10 e 40 são valores pro carro não sair do asfalto, e parar alguns pixels antes de chegar na grama

    if (this.x <= this.width - 10) { 
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
}

class BackgroundImage extends GameObject 
{
  constructor(x, y, width, height, img) 
  {
    super(x, y, width, height, img);
    // velocidade nunca muda, o q muda é a posição no y
    this.speedY = 1; // (-) sobe e o (+) desce, pq o y é invertido. Quero que ela desça então, (+)
  }

  updatePosition() 
  {
    this.y += this.speedY;
    this.y %= canvas.height; // % não deixar a imagem estravar a altura do canvas (y nunca ser maior que o tamanho da tela) e resetar quando chegar no final. Ou seja, qdo o y for 700, 700%700 = 0 e o y vai resetar e iniciar de novo. Poderia fazer com IF tb.
  }

  // ESTEIRA, ONDE A MÁGICA ACONTECE => TEMOS 2 IMG SEMPRE
  draw() 
  {
    ctx.drawImage(this.img, 0, this.y, this.width, this.height); // imagem começando do y
    ctx.drawImage(this.img, 0, this.y - canvas.height, this.width, this.height); // outra vem logo embaixo - descontando o tam da imagem, pra grudar um no outro
  }
}
//TENTATIVA DE ARRUMAR O OBSTACULO COM A CLASS OBSTACULO - Linha 63 até 68
class Obstacle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.speedY = 3;
  }
}

class Game {
  constructor(background, player) {
    this.background = background; 
    this.player = player;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.animationId; // salva o loop de animação do jogo, pra conseguirmos cancelar o mm qdo o jogo acaba
  }

  start = () => { 
   this.updateGame(); 
  };

// loop principal do jogo. ele que vai fazer rodar a cada frame, dando a impressão de movimento.
  updateGame = () => {// declaração de função. Ela está sendo invocada acima na função start
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition(); // movimenta o carrinho de acordo com a velocidade (somente no eixo x)
    this.player.draw(); // depois de movimentar => redesenho

    this.updateObstacles();

//     this.updateScore();

    this.animationId = requestAnimationFrame(this.updateGame); //se não salvarmos o "id" do loop de animação, a animação vai rodar pra sempre. "requestAnimationFrame" é nativo do js. Chama a callback, qdo a nimação terminar de rodar. Chama esse método várias vezes por segundo. 

//     this.checkGameOver();
  };

  updateObstacles = () => {
    this.speedY = 3 //(positivo pq quero que desça na tela). ideal mesma velocidade Y da "road"
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) { 
      this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
      //console.log(this.obstacles[i].img);
    }

    if (this.frames % 120 === 0) { // só cria obstáculos a cada 2 segundos. se não, fica impossível de navegar. 
      const originY = 0; 
      const minX = 50; // PENSEI EM ALTERAR DE 90 que é a grama até (500 - 90 - 50) => 360 (descontando a grama da direita + tam obs)
      const maxX = 100; //TALVEZ POSSA SER MAIOR AQUI 
      const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      
      const obsImg = new Image();
      obsImg.src = "./images/car.png";
      
      const obstacle = new Obstacle (obsImg, 250, 0, 50, 50); 
      // const obstacle = new GameObject (obsImg, randomX, originY, 50, 100); 
      
      this.obstacles.push(obstacle); // aqui eu posso jogar os demais obstáculos e fazer push do obstacle 1, 2, 3 etc
// //       this.score++;
        }
  }
// Limpar a tela toda (antes de desenhar de novo)
  clear = () => {
    ctx.clearRect (0, 0, canvas.width, canvas.height); // limpar a tela toda
  };
}

// FUNÇÃO PARA AGRUPAR A INSTANCIALIZAÇÃO DAS CLASSES E IMAGENS PRO JOGO COMEÇAR
function startGame() {
  // Instanciando todas as imagens
  const bgImg = new Image(); 
  bgImg.src = "./images/road.png"; 

  const carImg = new Image();
  carImg.src = "./images/car.png";

// Instanciando as classes 
  const backgroundImage = new BackgroundImage (0, 0, canvas.width, canvas.height, bgImg);

// carrinhos - VERIFICAR DIMENSÕES DE ACORDO COM AS MINHAS FIGURAS
  const player = new GameObject (250 - 25, canvas.height - 120, 50, 100, carImg);
    // novos tipos de players - VERIFICA DIMENSÕES E IMAGEM (TAM IMAGEM - respeitar a proporção da imagem)
//   const player1 = new GameObject(250 - 25, canvas.height - 120, 50, 100, xxxxImg);
//   const player2 = new GameObject(250 - 25, canvas.height - 120, 50, 100, xxxxImg);

  //  IF NO BOTÃO QUE A PESSOA ESCOLHEU O PLAYER PRA GERAR O GAME COM O PLAYER CORRETO
  const game = new Game(backgroundImage, player); 
    // novos tipos de players
//   const game = new Game(backgroundImage, player1);
//   const game = new Game(backgroundImage, player2);
     
  game.start(); // chama a primeira vez a função updateGame

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") { 
      game.player.speedX = -3; 
    } else if (event.code === "ArrowRight") {
      game.player.speedX = 3; 
    }
  });

  // carrinho para de andar, se pararmos de pressionar a tecla.  
  document.addEventListener("keyup", () => {
    game.player.speedX = 0;
  });
}

window.onload = () => {
    document.getElementById("start-button").onclick = () => {
      startGame();
    };
}
