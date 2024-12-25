export default class GameManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.gameState = {
      ball: { x: 0.5, y: 0.5 },
      pad_1: { y: 0.4, height: 0.2 },
      pad_2: { y: 0.6, height: 0.2 },
      scores: { player1: 0, player2: 0 },
    };
  }

  updateState(newState) {
    this.gameState = { ...this.gameState, ...newState };
    this.renderer.drawGame(this.gameState);
  }

  displayWinner(winner) {
    alert(`Game Over! Winner: ${winner}`);
  }
}
