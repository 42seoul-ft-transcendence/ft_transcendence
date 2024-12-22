class Player {
  constructor(x, y, board) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 50;
    this.velocityY = 0;
    this.board = board;
  }

  draw() {
    const { context } = this.board;
    context.fillStyle = "skyblue";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    let nextPlayerY = this.y + this.velocityY;
    if (!(nextPlayerY < 0 || nextPlayerY + this.height > this.board.height))
      this.y += this.velocityY;
  }
}

class Ball {
  constructor(x, y, width, height, velocity, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.velocityX = (Math.random() > 0.5 ? 1 : -1) * velocity; // 속도는 동일, 방향만 랜덤
    this.velocityY = (Math.random() > 0.5 ? 1 : -1) * velocity; // 속도는 동일, 방향만 랜
    this.board = board;
    this.isResetting = false;
  }

  init() {
    try {
      this.x = board.width / 2;
      this.y = board.height / 2;
      this.velocityX = (Math.random() > 0.5 ? 1 : -1) * this.velocity; // 속도는 동일, 방향만 랜덤
      this.velocityY = (Math.random() > 0.5 ? 1 : -1) * this.velocity; // 속도는 동일, 방향만 랜
    } catch (err) {
      console.log(err);
    }
  }

  draw() {
    const { context } = this.board;

    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update(player1, player2) {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.y <= 0 || this.y + this.height >= this.board.height) {
      this.velocityY *= -1; //reverse direction
    }

    if (detectCollision(this, player1)) {
      if (this.x <= player1.x + player1.width) this.velocityX *= -1;
    } else if (detectCollision(this, player2)) {
      if (this.x + this.width >= player2.x) this.velocityX *= -1;
    }
  }
}

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.context = null;
  }

  init() {
    const board = document.getElementById("board");
    board.height = this.height;
    board.width = this.width;
    this.context = board.getContext("2d");
  }

  draw(player1Score, player2Score) {
    this.context.fillStyle = "white";
    this.context.font = "45px sans-serif";
    this.context.fillText(player1Score, this.width / 5 + 10, 45);
    this.context.fillText(player2Score, (this.width * 4) / 5 - 45, 45);

    this.context.fillStyle = "skyblue";
    for (let i = 10; i < this.height; i += 25)
      this.context.fillRect(this.width / 2, i, 5, 5);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

const detectCollision = (ball, player) => {
  return (
    ball.x < player.x + player.width && //a's top left corner doesn't reach b's top right corner
    ball.x + ball.width > player.x && //a's top right corner passes b's top left corner
    ball.y < player.y + player.height && //a's top left corner doesn't reach b's bottom left corner
    ball.y + ball.height > player.y
  ); //a's bottom left corner passes b's top left corner
};

export { Board, Player, Ball };
