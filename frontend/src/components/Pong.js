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
      player2: new game.Player(board.width - 20, board.height / 2, board),
      ball: new game.Ball(board.width / 2, board.height / 2, 10, 10, 3, board),
      animationFrameId: null,
      // matches: this.props.matches,
      opponent1: this.props.opponent1,
      opponent2: this.props.opponent2,
      finish: false,
    };

    console.log(this.state.opponent1);
  }

  template() {
    return /* html */ `
      <div class="canvas-container position-relative">
        <canvas id="board"></canvas>
        <button id="nextBtn" class="btn btn-light fw-bold fs-3 py-3 border-info border-4 d-none">
         Next Game
        </button>
      </div>
    `;
  }

  mounted() {
    const { board, player1, player2, player1Score, player2Score } = this.state;

    board.init();

    player1.draw();
    player2.draw();

    board.draw(player1Score, player2Score);

    if (this.props.gameMode != "") {
      if (this.props.opponent2.id == null) this.state.player1Score = 3;
      this.state.animationFrameId = requestAnimationFrame(
        this.update.bind(this),
      );
    }
  }

  update() {
    let { board, player1, player2, ball, finish } = this.state;

    if (finish) return;

    board.clear();
    board.draw(this.state.player1Score, this.state.player2Score);
    player1.update();
    player1.draw();

    player2.update();
    player2.draw();

    if (this.state.player1Score == 3 || this.state.player2Score == 3) {
      let winWidth;

      if (this.state.animationFrameId) {
        let { opponent1, opponent2 } = this.state;

        this.state.finish = true;
        if (this.state.player1Score == 3) {
          winWidth = board.width / 5 - 20;
          opponent1["result"] = "win";
          opponent2["result"] = "loss";
        } else {
          winWidth = (board.width * 4) / 5 - 60;
          opponent2["result"] = "win";
          opponent1["result"] = "loss";
        }

        board.context.fillStyle = "White";
        board.context.fillText("WIN", winWidth, 125);

        cancelAnimationFrame(this.state.animationFrameId);
        opponent1["score"] = this.state.player1Score;
        opponent2["score"] = this.state.player2Score;

        console.log(this.state.player1Score);
        console.log(this.state.player2Score);

        this.$target.querySelector("#nextBtn").classList.remove("d-none");
      }
    }
    ball.update(player1, player2);
    ball.draw();

    if (ball.x < 0) {
      ball.init();
      this.state.player2Score++;
    } else if (ball.x + ball.width > board.width) {
      ball.init();
      this.state.player1Score++;
    }

    this.state.animationFrameId = requestAnimationFrame(this.update.bind(this));
  }

  setEvent() {
    document.addEventListener("keydown", (e) => {
      if (e.code == "KeyW") this.state.player1.velocityY = -3;
      else if (e.code == "KeyS") this.state.player1.velocityY = 3;

      if (e.code == "ArrowUp") this.state.player2.velocityY = -3;
      else if (e.code == "ArrowDown") this.state.player2.velocityY = 3;
    });

    this.addEvent("click", "#nextBtn", () => {
      const { opponent1, opponent2 } = this.state;

      this.props.handlePongNextGameClick(opponent1, opponent2);
      window.location.hash = "#/tournament";
    });
  }
}
