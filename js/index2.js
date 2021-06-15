const canvas = document.getElementById('the-canvas')
const ctx = canvas.getContext("2d")

//SOM
const crashSound = new Audio(); 
// crashSound.src = "PENDENTE SOM";
crashSound.volume = 0.1;

const newLife = new Audio(); 
// crashSound.src = "PENDENTE SOM";
newLife.volume = 0.1;

const gameOver = new Audio(); 
// crashSound.src = "PENDENTE SOM";
gameOver.volume = 0.1;


class CarPlayer {
    constructor(x, y, width, height, img) {
      this.x = x; // coordenada x
      this.y = y; // coordenada y
      this.width = width; //largura do carrinho = PENDENTE
      this.height = height; // altura do carrinho = PENDENTE
      this.img = img; //imagem do carrinho = PENDENTE
      this.speedX = 0;// velocidade varia tanto no x, qto no y
      this.speedY = 0;
      this.health = 50;// INICIA COM 50 E VAI PERDENDO 
    }

    //criar função para atualização a posição do carrinho 

    //draw() para image 

    //função para identificar se bateu no obstáculo (pensando no obstáculo sendo pontual, precisa mudar)
    // left() {
    //     return this.x;
    //   }
    //   right() {
    //     return this.x + this.width;
    //   }
    //   top() {
    //     return this.y;
    //   }
    //   bottom() {
    //     return this.y + this.height;
    //   }
    
    //   crashWith(obstacle) { => COLOCAR TODOS OS TAMANHOS DE OBSTÁCULOS? 
    //     return !(
    //       this.bottom() < obstacle.top() ||
    //       this.top() > obstacle.bottom() ||
    //       this.right() < obstacle.left() ||
    //       this.left() > obstacle.right()
    //     );
    //   }

    
}    

class Road extends Car {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedY = 3; // velocidade que a imagem anda a cada loop. PODE DELETAR E USAR A FUNÇÃO ABAIXO?
  }

    //criar função para atualização a posição da pista 

    //draw() para image => pq precisa limpar toda a tela e aparecer de novo, não?
            // window.addEventListener("load", () => {
            
                
            //     function draw(x){
            //         ctx.clearRect(0, 0, 400, 400); 
            //         img.onload = () => {
            //             ctx.drawImage(img, 0, this.y, ?, ?) 
            //     };
            
            //     setInterval( () => {
            //         draw(this.y);
            //         this.y += 3; 
            // }, 15);
            // });
}

class Obstacle1 extends CarPlayer { //2/3 tipos de obstáculos? - pneu no meio da pista, cone, outros carros... aí aumenta o intervalo de aparecimento de cada obs
    constructor(x, y, width, height, img) {
      super(x, y, width, height, img);
      this.speedY = 3; // mesma velocidade da road 
    }

    // //draw() para image  
}    

//Posso ter apenas 1 classe obstaculo, e altero as imagens...

class Game {
    constructor(background, player) { //BACKGROUN É A ROAD? E PLAYER É O CARRINHO QUE ELE ESCOLHER?
      this.background = background;
      this.player = player;
      this.obstacles = [];
      this.frames = 0;// => ENTENDER MELHOR
      this.score = 0;
      this.animationId;// => ENTENDER MELHOR
    }

    // FUNÇÃO START => CHAMA A FUNÇÃO DE ATUALIZAR O JOGO A SEGUIR

    //ATUALIZANDO O JOGO 

        // ATUALIZAR O CENÁRIO (BACKGROUND E PLAYER) => APAGAR E DESENHAR DE NOVO

        // INCLUIR OS OBSTÁCULOS RANDOMICAMENTE 

        // CHECAR SE BATEU NO OBSTÁCULO E qto de health PERDEU =>
        //  TIPO 1, PERDE 2 PTS, TIPO 3 PERDE 4 PTS....XXXX => para no zero

        // atualizar score => baseado em quanto pixels andou? 
    
        // checar game over => baseado no this.health, if = 0 => game over 
    
    // FIM DO JOGO  => 
    //limpar a tela e aparecer Game Over e o score atualizado

    // voltar pra tela inicial? new game?
}

função startGame{
    //Instanciar as imagens (road, CarPlayer, Obstacles 1, 2, 3)

    //Instanciar as classes (CarPlayer, road, game)

    //invocar a função start (da classe game)

    // addEventListner para as teclas do teclado (keyup and keydown) => impactando na velocidade/direção do carrinho
}

//window.onload => clicar no botão de início e chamar a função startGame

//botão com os diferentes carrinhos? => qdo clica no carrinho, escolhe o player?
//botão nível fácil/médio/difícil => impactando a qtade de obstáculos por intervalo de tempo? 