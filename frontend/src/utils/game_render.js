export default class GameRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    console.log(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  drawBall(ball) {
    this.ctx.beginPath();
    this.ctx.arc(
      ball.x * this.canvas.width,
      ball.y * this.canvas.height,
      10,
      0,
      Math.PI * 2,
    );
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPaddle(paddle, isLeft) {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(
      isLeft ? 10 : this.canvas.width - 20,
      paddle.y * this.canvas.height,
      10,
      paddle.height * this.canvas.height,
    );
  }

  drawScores(scores) {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Player 1: ${scores.player1}`, 20, 20);
    this.ctx.fillText(
      `Player 2: ${scores.player2}`,
      this.canvas.width - 140,
      20,
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGame(gameState) {
    this.clear();
    this.drawBall(gameState.ball);
    this.drawPaddle(gameState.pad_1, true);
    this.drawPaddle(gameState.pad_2, false);
    this.drawScores(gameState.scores);
  }
}
