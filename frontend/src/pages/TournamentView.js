import Component from "/frontend/src/core/Component.js";
import * as brackets from "/frontend/src/utils/tournament.js";

export default class tournament extends Component {
  setup() {
    this.state = {
      playNames: this.props.playNames,
      participants: brackets.generateParticipantJson(this.props.playNames),
    };
  }
  template() {
    return /* html */ `
			<div class="brackets-viewer"></div>
		`;
  }
}
