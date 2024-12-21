// import Component from "/frontend/src/core/Component.js";
// import * as brackets from "/frontend/src/utils/tournament.js";

import Component from "../core/Component.js";
import * as brackets from "../utils/tournament.js";
import { getTranslation } from "../utils/translations.js";

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
    <div class="bracket-wrapper">
  		<div id="brackets" class="container brackets-viewer"></div>
      <div id="gameStartBtn">
      <button id="gameStartBtn" class="btn btn-info mt-3 btn-lg">${getTranslation("gameStart")}</button>
      </div>
    </div>
  	`;
  }

  async mounted() {
    const { participants, matches } = this.state;

    try {
      await window.bracketsViewer.render({
        stages: brackets.stage,
        matches: matches,
        matchGames: [],
        participants: participants,
      });
    } catch (e) {
      console.log(e);
    }
  }

  setEvent() {
    this.addEvent("click", "#gameStartBtn", () => {
      const startMatchIdx = this.state.matches.findIndex(
        (match) =>
          (!("result" in match.opponent1) || !("result" in match.opponent2)) &&
          !match.empty,
      );

      if (startMatchIdx !== -1) {
        const startMatch = this.state.matches[startMatchIdx];

        this.props.handleTournamentGameStartClick(startMatch, startMatchIdx);
        window.location.hash = "#/game";
      } else {
        window.location.hash = "#/";
      }
    });
  }
}
