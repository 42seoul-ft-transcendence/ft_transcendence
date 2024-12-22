import Component from "../core/Component.js";

export default class Pong extends Component {
  template() {
    return /* html */ `
			<div class="game-screen d-flex flex-column justify-content-center align-items-center gap-3 p-4 mb-5">
				<button id="oneToOne" class="btn btn-light fw-bold text-decoration-underline fs-3 py-3 w-75 border-info border-4">1 vs 1</button>
				<button class="btn btn-light fw-bold text-decoration-underline fs-3 py-3 w-75 border-info border-4"
				 data-bs-toggle="modal" data-bs-target="#tournamentModal">tournament</button>
			</div>
		`;
  }
}