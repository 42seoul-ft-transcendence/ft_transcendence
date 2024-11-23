import Component from "../core/Component.js";

export default class TournamentModal extends Component {
  template() {
    return /* html */ `
		<div class="modal fade" id="tournamentModal" tabindex="-1" aria-labelledby="tournamentModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="tournamentModalLabel">Tournament</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>How many people do you want to play?</p>
						<select id="playerCount" class="form-select w-50 mx-auto">
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
						</select>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-primary" id="nextButton">Next</button>
					</div>
				</div>
			</div>
		</div>
		`;
  }
}
