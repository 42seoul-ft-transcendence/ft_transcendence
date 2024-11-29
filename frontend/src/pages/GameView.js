import Component from "/frontend/src/core/Component.js";
import Pong from "/frontend/src/components/Pong.js";

export default class Game extends Component {
  template() {
    return /* html */ `
			<div id="gameCtn"></div>
		`;
  }

  mounted() {
    this.pongInstance = this.initComponent(
      this.pongInstance,
      Pong,
      "#gameCtn",
      {
        isGameMode: true,
        ...this.props,
      },
    );
    // new Pong(this.$target.querySelector("div"));
  }
}
