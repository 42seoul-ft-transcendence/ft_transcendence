import Component from "/frontend/src/core/Component.js";
import * as brackets from "/frontend/src/utils/tournament.js";

export default class Tournament extends Component {
  setup() {
    this.state = {
      playNames: this.props.playerNames,
      participants: this.props.participants,
      matches: this.props.matches,
      currentMatch: 0,
    };
  }

  template() {
    return /* html */ `
    <div class="vh-100 d-flex justify-content-center align-items-center">
  		<div class="container brackets-viewer"></div>
      <div id="gameStartBtn">
      <button id="gameStartBtn"class="btn btn-light fw-bold text-decoration-underline
        fs-3 py-3 w-75 border-info border-4">Start Game</button>
      </div>
    </div>
  	`;
  }

  async mounted() {
    const { participants, matches } = this.state;

    await window.bracketsViewer.render({
      stages: brackets.stage,
      matches: matches,
      matchGames: [],
      participants: participants,
    });
  }

  setEvent() {
    this.addEvent("click", "#gameStartBtn", () => {
      const startMatch = this.state.matches.find(
        (match) =>
          !("score" in match.opponent1) || !("score" in match.opponent2),
      );
      this.props.handleTournamentGameStartClick(startMatch);
      window.location.hash = "#/game";
    });
  }
}
