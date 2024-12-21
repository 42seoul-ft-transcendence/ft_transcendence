// import Component from "/frontend/src/core/Component.js";
// import Pong from "/frontend/src/components/Pong.js";
import Component from "../core/Component.js";
import Pong from "../components/Pong.js";

export default class Game extends Component {
  template() {
    return /* html */ `
    <div class="vh-100 d-flex align-items-center justify-content-center">
      <div id="gameCtn"></div>
    </div>
		`;
  }

  mounted() {
    // this.pongInstance = this.initComponent(
    //   this.pongInstance,
    //   Pong,
    //   "#gameCtn",
    //   {
    //     isGameMode: true,
    //     ...this.props,
    //   },
    // );
    new Pong(this.$target.querySelector("#gameCtn"), {
      isGameMode: true,
      ...this.props,
    });
  }
}
