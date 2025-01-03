import Component from "../core/Component.js";
import TwoFAView from "./TwoFAView.js";

export default class Loading extends Component {
	template() {
		return /* html */ `
			<div class="loading d-flex justify-content-center align-items-center">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`;
	}
}
