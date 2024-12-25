import Component from "../core/Component.js";
import * as game from "../utils/game/game.js";
import { getTranslation } from "../utils/translations.js";
import { pongSocket } from "../utils/ws.js";

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
    };

    // if (!this.props.opponent1 && !this.props.opponent2)
    //   window.location.hash = "#/";
  }

  template() {
    const { opponent1, opponent2 } = this.state;

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

    if (this.props.gameMode == "singleMode" && !finish) {
    } else if (this.props.gameMode != "" && !finish) {
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

// pongSocket.on('onMessage', (event) => {
//   const data = JSON.parse(event.data);
//   handleServerMessage(data);

// socket.onmessage = (event) => {
//   const message = JSON.parse(event.data);
//   handleServerMessage(message);
// };

// socket.onclose = () => {
//   console.log('WebSocket connection closed');
// };

// function handleServerMessage(message) {
//   switch (message.type) {
//     case 'game_start':
//       initializeGame(message.content.players);
//       break;
//     case 'game_state':
//       updateGameState(message.content);
//       break;
//     case 'game_stop':
//       displayWinner(message.content.winner);
//       break;
//     default:
//       console.error('Unknown message type:', message.type);
//   }
// }
// 3. 게임 화면 그리기
// Canvas API를 사용하여 공과 패들을 렌더링합니다.

// HTML:
// html
// 코드 복사
// <canvas id="pongCanvas" width="800" height="400"></canvas>
// JavaScript:
// javascript
// 코드 복사
// const canvas = document.getElementById('pongCanvas');
// const ctx = canvas.getContext('2d');

// let gameState = {
//   ball: { x: 0.5, y: 0.5 },
//   pad_1: { y: 0.4, height: 0.2 },
//   pad_2: { y: 0.6, height: 0.2 },
//   scores: { player1: 0, player2: 0 }
// };

// function initializeGame(players) {
//   console.log('Game started with players:', players);
// }

// function updateGameState(state) {
//   gameState = state;
//   drawGame();
// }

// function drawGame() {
//   // Clear canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw ball
//   ctx.beginPath();
//   ctx.arc(
//     gameState.ball.x * canvas.width,
//     gameState.ball.y * canvas.height,
//     10, 0, Math.PI * 2
//   );
//   ctx.fillStyle = 'red';
//   ctx.fill();
//   ctx.closePath();

//   // Draw paddles
//   ctx.fillStyle = 'blue';
//   ctx.fillRect(10, gameState.pad_1.y * canvas.height, 10, gameState.pad_1.height * canvas.height);
//   ctx.fillRect(
//     canvas.width - 20,
//     gameState.pad_2.y * canvas.height,
//     10,
//     gameState.pad_2.height * canvas.height
//   );

//   // Draw scores
//   ctx.font = '20px Arial';
//   ctx.fillText(`Player 1: ${gameState.scores.player1}`, 20, 20);
//   ctx.fillText(`Player 2: ${gameState.scores.player2}`, canvas.width - 140, 20);
// }

// function displayWinner(winner) {
//   alert(`Game Over! Winner: ${winner}`);
// }
// 4. 키보드 입력 처리
// 플레이어가 패들을 움직일 수 있도록 키보드 이벤트를 처리하고, WebSocket을 통해 백엔드로 패들 이동 데이터를 보냅니다.

// javascript
// 코드 복사
// document.addEventListener('keydown', (event) => {
//   let direction = null;
//   if (event.key === 'ArrowUp') {
//     direction = 'up';
//   } else if (event.key === 'ArrowDown') {
//     direction = 'down';
//   }

//   if (direction) {
//     socket.send(
//       JSON.stringify({
//         type: 'game_move',
//         content: { pad_n: 'pad_1', direction: direction }
//       })
//     );
//   }
// });
