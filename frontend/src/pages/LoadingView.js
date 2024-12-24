import Component from "../core/Component.js";

export default class Loading extends Component {
  template() {
    return /* html */ `
			<div class="loading">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`;
  }
}
