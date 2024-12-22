// import Component from "../../core/Component.js";
import Component from "/frontend/src/core/Component.js";
import Navbar from "/frontend/src/components/Navbar.js";
import Pong from "/frontend/src/components/Pong.js";

export default class Game extends Component {
  template() {
    return /* html */ `
			<div></div>
		`;
  }
  mounted() {
    new Pong(this.$target.querySelector("div"), {
      isGameMode: true,
    });
  }
}
