import Component from "../core/Component.js";
import * as game from "../utils/game/game.js";

export default class Pong extends Component {
  setup() {
    const board = new game.Board(700, 500);

    this.state = {
      player1Score: 0,
      player2Score: 0,
      board: board,
      player1: new game.Player(10, board.height / 2, board),
      player2: new game.Player(board.width - 10, board.height / 2, board),
      ball: new game.Ball(board.width / 2, board.height / 2, 10, 10, 3, board),
      animationFrameId: null,
    };
  }

  template() {
    return /* html */ `
      <canvas id="board">
    `;
  }

  mounted() {
    const { board, player1, player2, player1Score, player2Score } = this.state;

    board.init();

    player1.draw();
    player2.draw();

    board.draw(player1Score, player2Score);

    if (this.props.gameMode != "")
      this.state.animationFrameId = requestAnimationFrame(
        this.update.bind(this),
      );
  }

  update() {
    let { board, player1, player2, ball } = this.state;

    this.state.animationFrameId = requestAnimationFrame(this.update.bind(this));

    board.clear();
    board.draw(this.state.player1Score, this.state.player2Score);
    player1.update();
    player1.draw();

    player2.update();
    player2.draw();
    if (this.state.player1Score == 3 || this.state.player2Score == 3) {
      let winWidth;

      if (this.state.animationFrameId) {
        if (this.state.player1Score == 3) winWidth = board.width / 5 - 20;
        else winWidth = (board.width * 4) / 5 - 60;

        board.context.fillStyle = "White";
        board.context.fillText("WIN", winWidth, 125);

        cancelAnimationFrame(this.state.animationFrameId);
        this.state.animationFrameId = null;
      }
    }

    ball.update(player1, player2);
    ball.draw();

    if (ball.x < 0) {
      this.state.player2Score++;
      ball.init();
    } else if (ball.x + ball.width > board.width) {
      this.state.player1Score++;
      ball.init();
    }
  }

  setEvent() {
    document.addEventListener("keydown", (e) => {
      if (e.code == "KeyW") this.state.player1.velocityY = -3;
      else if (e.code == "KeyS") this.state.player1.velocityY = 3;

      if (e.code == "ArrowUp") this.state.player2.velocityY = -3;
      else if (e.code == "ArrowDown") this.state.player2.velocityY = 3;
    });
  }
}
