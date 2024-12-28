import Component from "../core/Component.js";
import * as game from "../utils/game/game.js";

import { getTranslation } from "../utils/translations.js";
import { pongSocket, loginSocket } from "../utils/ws.js";
import { apiCall } from "../utils/api.js";

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
      opponent1: this.props.opponent1,
      opponent2: this.props.opponent2,
      finish: false,
      myId: null,
      myName: null,
      player1Y: null,
      player2Y: null,
      ballX: null,
      ballY: null,
      myRole: null,
    };

    if (
      this.props.gameMode === "" &&
      !this.props.opponent1 &&
      !this.props.opponent2
    )
      window.location.hash = "#/";

    if (!this.state.opponent1)
      this.state.opponent1 = { id: null, name: null, position: 1 };
    if (!this.state.opponent2)
      this.state.opponent2 = { id: null, name: null, position: 2 };

    // pongSocket.on("onOpen", () => {
    //   pongSocket.sendMessage(
    //     JSON.stringify({
    //       type: "game_ready",
    //     }),
    //   );
    // });
  }

  template() {
    const { opponent1, opponent2 } = this.state;

    console.log(opponent1, opponent2);

    return /* html */ `
      <div class="canvas-container position-relative">
        <canvas id="board"></canvas>
        <div id="gameCtn" class="border bg-dark"></div>
        <div class="container-fluid position-absolute bottom-0 px-5">
          <div class="row w-100">
            <div class="col text-start">
              <span id="nickname-left" class="nickName fs-1 fw-bold" style="${
                !opponent1 ? "display:none;" : ""
              }">${opponent1?.name || ""}</span>
            </div>
            <div class="col text-end">
              <span id="nickname-right" class="nickName fs-1 fw-bold" style="${
                !opponent2 ? "display:none;" : ""
              }">${opponent2?.name || ""}</span>
            </div>
          </div>
        </div>
        <button id="nextBtn" class="btn btn-light fw-bold fs-3 py-3 border-info border-4 d-none">
         ${getTranslation("nextGame")}
        </button>
      </div>
    `;
  }

  async mounted() {
    const { board, player1, player2, player1Score, player2Score, finish } =
      this.state;

    board.init();

    player1.draw();
    player2.draw();

    board.draw(player1Score, player2Score);

    if (this.props.gameMode === "singleMode" && !finish) {
      await this.remoteGameMounted();
    } else if (this.props.gameMode !== "" && !finish) {
      if (this.props.opponent2.id == null) this.state.player1Score = 3;
      this.state.animationFrameId = requestAnimationFrame(
        this.update.bind(this),
      );
    }
  }

  async remoteGameMounted() {
    const res = await apiCall("/api/game/start/", "post");
    this.state.finish = true;

    console.log("remoteGameMounted", res);
    loginSocket.on("onMessage", (event) => {
      const data = JSON.parse(event.data);

      console.log("loginSocket onMessage", data);
      switch (data.type) {
        case "user_id":
          this.state.myId = data.user_id;
          this.state.myName = data.username;
          break;
      }
    });
    loginSocket.sendMessage(JSON.stringify({ action: "get_user" }));

    pongSocket.init(`pong/${res.room_id}/`);
    pongSocket.on("onMessage", (event) => {
      const wsData = JSON.parse(event.data);

      switch (wsData.type) {
        case "game_start":
          console.log("Game started:", wsData);
          this.state.finish = false;
          this.state.board.init();
          this.state.ball.init();
          this.state.requestAnimationFrameId = requestAnimationFrame(
            this.remoteUpdate.bind(this),
          );
          break;
        case "assign_role":
          console.log("Role assigned:", wsData);
          this.state.myRole = wsData.content.role;
          break;
        case "game_state":
          const message = wsData.content;
          this.state.ballX = message.ball.x;
          this.state.ballY = message.ball.y;
          this.state.player1Y = message.player1.y;
          this.state.player2Y = message.player2.y;
          this.state.player1Score = message.scores[0];
          this.state.player2Score = message.scores[1];
          this.state.ball.remoteUpdate(message.ball.x, message.ball.y);
          break;
        case "game_stop":
          pongSocket.close();
          cancelAnimationFrame(this.state.animationFrameId);
          console.log(wsData);
          //   pongSocket.sendMessage(JSON.stringify({ type: "game_stop" }));
          //   cancelAnimationFrame(this.state.animationFrameId);
          break;
        default:
          console.error("Unknown message type:", wsData.type);
      }
    });
  }

  remoteUpdate() {
    const { board, player1, player2, ball, player1Y, player2Y, ballX, ballY } =
      this.state;

    board.clear();
    board.draw(this.state.player1Score, this.state.player2Score);
    player1.remoteUpdate(player1Y);
    player1.draw();

    player2.remoteUpdate(player2Y);
    player2.draw();

    ball.remoteUpdate(ballX, ballY);
    ball.draw();
    this.state.animationFrameId = requestAnimationFrame(
      this.remoteUpdate.bind(this),
    );
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
        this.state.finish = true;
        if (this.state.player1Score == 3) winWidth = board.width / 5 - 20;
        else winWidth = (board.width * 4) / 5 - 60;

        board.context.fillStyle = "White";
        board.context.fillText("WIN", winWidth, 125);

        cancelAnimationFrame(this.state.animationFrameId);

        this.$target.querySelector("#nextBtn").classList.remove("d-none");
        return;
      }
    }
    ball.update(player1, player2);
    ball.draw();

    if (ball.x <= 0) {
      ball.init();
      this.state.player2Score++;
    } else if (ball.x + ball.width >= board.width) {
      ball.init();
      this.state.player1Score++;
    }

    this.state.animationFrameId = requestAnimationFrame(this.update.bind(this));
  }

  setEvent() {
    document.addEventListener("keydown", (e) => {
      if (this.props.gameMode === "singleMode") {
        if (pongSocket.getStatus() === "OPEN") {
          if (e.code == "ArrowUp") {
            // const message = {
            //   type: "game_move",
            //   content: {
            //     direction: -3,
            //     player: this.state.myRole,
            //   },
            // };
            pongSocket.sendMessage(
              JSON.stringify({
                type: "game_move",
                content: {
                  direction: -10,
                  player: this.state.myRole,
                },
              }),
            );
          } else if (e.code == "ArrowDown")
            pongSocket.sendMessage(
              JSON.stringify({
                type: "game_move",
                content: {
                  direction: 10,
                  player: this.state.myRole,
                },
              }),
            );
        }
      } else {
        if (e.code == "KeyW") this.state.player1.velocityY = -3;
        else if (e.code == "KeyS") this.state.player1.velocityY = 3;

        if (e.code == "ArrowUp") this.state.player2.velocityY = -3;
        else if (e.code == "ArrowDown") this.state.player2.velocityY = 3;
      }
    });

    this.addEvent("click", "#nextBtn", () => {
      const { opponent1, opponent2, player1Score, player2Score } = this.state;

      if (player1Score == 3) {
        opponent1["result"] = "win";
        opponent2["result"] = "loss";
      } else {
        opponent2["result"] = "win";
        opponent1["result"] = "loss";
      }

      opponent1["score"] = player1Score;
      opponent2["score"] = player2Score;

      this.props.handlePongNextGameClick(opponent1, opponent2);
      window.location.hash = "#/tournament";
    });
  }
}
