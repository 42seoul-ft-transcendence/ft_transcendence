// import Component from "../../core/Component.js";
import Component from "/frontend/src/core/Component.js";
import * as brackets from "/frontend/src/utils/tournament.js";

export default class Tournament extends Component {
  setup() {
    this.state = {
      playNames: this.props.playerNames,
      participants: brackets.generateParticipantJson(this.props.playerNames),
      matches: brackets.generateMatchJson(this.props.playerNames),
    };

    console.log(this.state);
    console.log(brackets.stage);
  }

  template() {
    return /* html */ `
  		<div class="brackets-viewer"></div>
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
}
