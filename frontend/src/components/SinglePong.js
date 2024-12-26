import Component from "../core/Component.js";
import GameRenderer from "../utils/game_render.js";
import GameManager from "../utils/game_manager.js";
import { pongSocket } from "../utils/ws.js";
import { apiCall } from "../utils/api.js";

export default class PongComponent extends Component {
  async setup() {
    this.state = {
      gameState: {
        ball: { x: 0.5, y: 0.5 },
        pad_1: { y: 0.4, height: 0.2 },
        pad_2: { y: 0.6, height: 0.2 },
        scores: { player1: 0, player2: 0 },
      },
    };
    this.renderer = null;
    this.gameManager = null;

    const data = await apiCall("/api/game/start/", "post");

    console.log(data);
  }

  mounted() {
    this.renderer = new GameRenderer("pongCanvas");
    this.gameManager = new GameManager(this.renderer);
  }

  template() {
    return /* html */ `
      <div class="pong-container">
        <canvas id="pongCanvas" width="800" height="400"></canvas>
      </div>
    `;
  }

  setEvent() {
    document.addEventListener("keydown", (event) => {
      const direction =
        event.key === "ArrowUp"
          ? "up"
          : event.key === "ArrowDown"
          ? "down"
          : null;

      if (direction) {
        pongSocket.sendMessage({
          type: "game_move",
          content: { pad_n: "pad_1", direction },
        });
      }
    });
  }
}

// pongSocket.init();
// pongSocket.on("onMessage", (message) => {
//   console.log("onMessage", message);
//   switch (message.type) {
//     case "game_start":
//       console.log("Game started with players:", message.content.players);
//       break;
//     case "game_state":
//       console.log("Game state updated:", message.content);
//       this.gameManager.updateState(message.content);
//       break;
//     case "game_stop":
//       console.log("Game Over! Winner:", message.content.winner);
//       this.gameManager.displayWinner(message.content.winner);
//       break;
//     default:
//       console.error("Unknown message type:", message.type);
//   }
// });
