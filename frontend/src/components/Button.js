import Component from "../core/Component.js";

export default class Button extends Component {
  template() {
    return /* html */ `
			<button class="btn ${this.props.class}">${this.props.text}</button>	
		`;
  }
  mounted() {
    const $btn = this.$target.querySelector('button');

  }
}
