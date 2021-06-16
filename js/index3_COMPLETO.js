// 1. 
const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");

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

// 3.
class GameObject {
    //3.1
  constructor(x, y, width, height, img) {
    this.x = x; // coordenada x
    this.y = y; // coordenada y
    this.width = width; //largura do carrinho = PENDENTE
    this.height = height; // altura do carrinho = PENDENTE
    this.img = img; //imagem do carrinho = PENDENTE
    this.speedX = 0;// velocidade varia tanto no x, qto no y
    this.speedY = 0;
    this.health = 10;// INICIA COM 10 E VAI PERDENDO 
  }
// 3.
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
    return this.x; // lado esquerdo do objeto é a posição no x
  }
  right() {
    return this.x + this.width; // lado direito do objeto é a posição no x + largura do objeto
  }
  top() {
    return this.y; // lado superior do objeto é a posição no y 
  }
  bottom() {
    return this.y + this.height; // lado inferior do objeto é a posição no y + altura do objeto
  }

  // ########################################
  // como eu uso a mesma classe para o carrinho e o obstáculo, ENTENDO que tenho que fazer essa função dentro da class Game
  // crashWith(obstacle) {
  //   return !(
  //     this.bottom() < obstacle.top() ||
  //     this.top() > obstacle.bottom() ||
  //     this.right() < obstacle.left() ||
  //     this.left() > obstacle.right()
  //   );
  // }
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    // velocidade nunca muda, o q muda é a posição no y
    this.speedY = 1; // (-) sobe e o (+) desce, pq o y é invertido. Quero que ela desça então, (+)
  }

  updatePosition() {
    this.y += this.speedY;
    this.y %= canvas.height; // % não deixar a imagem estravar a altura do canvas (y nunca ser maior que o tamanho da tela) e resetar quando chegar no final. Ou seja, qdo o y for 700, 700%700 = 0 e o y vai resetar e iniciar de novo. Poderia fazer com IF tb.
  }

  // ESTEIRA, ONDE A MÁGICA ACONTECE => TEMOS 2 IMG SEMPRE, uma que ta sumindo e outra que ta aparecendo logo abaixo da primeira q ta sumindo.  
  // x = 0, pq a imagem só mexe veritcalmente. 
  draw() {
    ctx.drawImage(this.img, 0, this.y, this.width, this.height); // imagem começando do y
    ctx.drawImage(this.img, 0, this.y - canvas.height, this.width, this.height); // outra vem logo embaixo - descontando o tam da imagem, pra grudar um no outro
  }
}

//######################################## NÃO APLICÁVEL NO MEU CASO. OS OBSTÁCULOS SERÃO IMAGENS COMO O CARRO E PODEM TER A MESMA CLASSE DO GAMEOBJECT
// AQUI FOI CRIADA UMA NOVA CLASSE SOMENTE PQ A FUNÇÃO DRAW SERIA DIFERENTE. O RESTO É TUDO IGUAL 
// class Obstacle extends GameObject {
//   constructor(x, y, width, height) {
//     super(x, y, width, height);
//     this.speedY = 3;
//   }
//   draw() {
//     ctx.fillStyle = "red";
//     ctx.fillRect(this.x, this.y, this.width, this.height);
//   }
// }
//#######################################

class Game {
  constructor(background, player) {
    this.background = background; //background image 
    this.player = player;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.animationId; // salva o loop de animação do jogo, pra conseguirmos cancelar qo mm qdo o jogo acaba
  }

  start = () => { // invocação da função "start" vai acontecer na função "startGame", que será ativada qdo o usuário clicar no botão START
    this.updateGame(); //invocação da função updateGame para que ele ligue o motor. Como a função chama ela mesmo, vai continuar rodando depois. 
  };

// loop principal do jogo. ele que vai fazeR rodar a cada frame, dando a impressão de movimento.
  updateGame = () => {// declaração de função. Ela está sendo invocada acima na função start
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition(); // movimenta o carrinho de acordo com a velocidade (somente no eixo x)
    this.player.draw(); // depois de movimentar => redesenho

    this.updateObstacles();

    this.updateScore();

    this.animationId = requestAnimationFrame(this.updateGame); //se não salvarmos o "id" do loop de animação, a animação vai rodar pra sempre. "requestAnimationFrame" é nativo do js. Chama a callback, qdo a animação terminar de rodar. Chama esse método várias vezes por segundo. 

    this.checkGameOver(); // verifica se o jogo acabou em todos os frames. Se o health (resultado de crashWith) for > 0, apenas atualiza o health na tela.
  };

  updateObstacles = () => {
    this.speedY = 3 //(positivo pq quero que desça na tela). no exemplo a speedY foi incluída direto na classe obstacle. como a pista está sendo atualizada "3px" por vez, o ideal é deixar igual.
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) { // for está percorrendo a array, que está sendo preenchida embaixo: this.obstacles.push(obstacle). Assim, qdo eu percorro a array e chamo o updatePosition, ela sabe que é o update Position da classe GameObject. No exemplo tinha uma classe add para o Obstaculo. Aqui tem apenas 1, confunde menos.
      this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
    }

    if (this.frames % 120 === 0) { // só cria obstáculos a cada 2 segundos. se não, fica impossível de navegar. 
      const originY = 0; // sempre vai começar aparecendo em y = 0 (vindo de cima da tela)
      const minX = 50; // PENSEI EM ALTERAR DE 90 que é a grama até (500 - 90 - 50) => 360 (descontando a grama da direita + tam obs)
      const maxX = 100; //TALVEZ POSSA SER MAIOR AQUI 
      const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    }

// // // ######################################
// // // => NÃO APLICÁVEL NO MEU CASO - NÃO VOU DESENHAR NO PRÓPRIO CANVAS OBSTÁCULO. RANDOWITH é a largura dos obstáculos. minhas imagens vão ter o mesmo tamanho
// // // //FOLGA ENTRE OS OBSTÁCULOS, PODE SER UM PARAMETRO DE DIFICULDADE.
// // //       const minWidth = 50; // Tam mínimo do obstáculo - escolhi ser do tamanho do carro
// // //       const maxWidth = 240; // Tam máx do obstáculo = tam total canvas (width) - 180 da grama = 320 - espaço pro carro passar. Tiramos 80, pq o carro tem 50. Se não ficaria muito apertado. 
      
// // //       const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth; // gerar o tamanho do obstáculo aleatoriamente, considerando os valores máx e mín definidos acima (50 e 240)
// // }
// //       const obstacle = new Obstacle(randomX, originY, randomWidth, 20);
// // // ###########################################

    const obsImg = new Image();
    obsImg.src = "./images/obstacle.png";

    const obstacle = new GameObject (randomX, originY, 50, 100, obsImg); //poderia ter iniciado no escopo global, acima. abaixo, a classe não acessaria. 
        //se eu quiser mudar o tamanho do objeto, eu volto o randonWidth e como ele é quadrado, eu posso, colocar radonWidth e (randonWith * 2)
    this.obstacles.push(obstacle); // aqui eu posso jogar os demais obstáculos e fazer push do obstacle 1, 2, 3 etc

    this.score++;// cada vez que passa por um obstáculo, aumenta o score do player
    }

//########### trouxe pra cá a função verificar COLISÃO. no original estava dentro do Game Object. mas como tanto o player qto o obstacle são Game Objetc, acho que preicsa estar fora.
// mudei o return => se bater, diminui 1 pt do player health e retorna o valor de player health p ser utilizado na GAME OVER
    crashWith = () => {    
      if (!(player.bottom() < obstacle.top() || 
        player.top() > obstacle.bottom() ||  
        player.right() < obstacle.left() || 
        player.left() > obstacle.right() ||//ENTENDO QUE PRECISO DAS CONDIÇÕES ADICIONAIS ABAIXO 
        player.top() < obstacle.bottom() &&  player.right() < obstacle.left() || //FLÁ
        player.bottom() > obstacle.top() &&  player.right() < obstacle.left() || //FLÁ
        player.top() < obstacle.bottom() &&  player.left() > obstacle.right() || //FLÁ
        player.bottom() > obstacle.top() &&  player.right() > obstacle.left() )) //FLÁ
        {
        // crashSound.play(); // PENDENTE acrescentei o aúdio de crash aqui
        return player.health -= 1
        }
  }

  updateHealth(){
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${player.health}`, 80, 40);
  }
// ################################# DIFERENTE - VOU CHECAR O player.health pra dar game over
//   checkGameOver = () => {
//     const crashed = this.obstacles.some((obstacle) => {
//       return this.player.crashWith(obstacle);
//     });

//     if (crashed) {
//       crashSound.play();

//       cancelAnimationFrame(this.animationId);

//       this.gameOver();
//     }
//   };
//############################################

  checkGameOver (){ // coloquei que ela chama a crashWith, e crashWith retorna o valor atualizado do player.health
    if (this.crashWith() <= 0) {
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
  { //desenhando na tela, verificar arquivo Pedro - linha 171
    this.clear(); 

    const gameOverImg = new Image();
    gameOverImg.src = "./images/car.png";

    //posso desenhar direto a imagem, não preciso criar uma classe => TESTE PEDRO OK 
    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Your Final Score: ${this.score}`, canvas.width / 6, 400);
  }

// Limpar a tela toda (antes de desenhar de novo)
  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpar a tela toda
  };
}
// FUNÇÃO PARA AGRUPAR A INSTANCIALIZAÇÃO DAS CLASSES E IMAGENS PRO JOGO COMEÇAR
function startGame() {
  // Instanciando todas as imagens
  const bgImg = new Image(); // const img é literalmente o arquivo imagem
  bgImg.src = "./images/road.png"; // IMAGEM NÃO TÁ FUNCIONANDO NO index.js => verificar se é problema da imagem ou sintaxe, caminho????

  const carImg = new Image();
  carImg.src = "./images/car.png";

// Instanciando as classes 
// aqui é a img com o comportamento no jogo (esteira), por isso uma nova variável e não reaproveita a bgImg
  const backgroundImage = new BackgroundImage (0, 0, canvas.width, canvas.height, bgImg);

// carrinhos - VERIFICA DIMENSÕES DE ACORDO COM AS MINHAS FIGURAS
    // aqui que eu diferencio os players
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
    if (event.code === "ArrowLeft") { //se a tecla for setinha pra esquerda, que significa "ArrowLeft"
      game.player.speedX = -3; //(subtrai está indo pra esquerda na coordenada x)
    } else if (event.code === "ArrowRight") {
      game.player.speedX = 3; //(incrementa, vai pra direita na coordenada X)
    }
  });

  // carrinho parar de andar, se pararmos de pressionar a tecla.  
  document.addEventListener("keyup", () => {
    game.player.speedX = 0;
  });
}

document.addEventListener("click", () => {
    startGame();
  });

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
}
