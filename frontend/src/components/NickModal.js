import Component from "../core/Component.js";
import { shuffleArray } from "/frontend/src/utils/tournament.js";

export default class NickModal extends Component {
  setup() {
    this.$target.classList = "modal fade";
    this.$target.setAttribute("tabindex", "-1");
    this.$target.setAttribute("aria-labelledby", "nicknameModalLabel");
    this.$target.setAttribute("aria-hidden", "true");
    this.$target.setAttribute("id", "nicknameModal");

    this.state = {
      playerName: [],
      currentPlayer: 1,
    };
  }

  template() {
    const { currentPlayer } = this.state;
    const { totalPlayer } = this.props;

    return /* html */ `
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="nicknameModalLabel">Enter Player Nickname</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>Player ${currentPlayer} NickName</p>
						<input type="text" class="form-control w-75 mx-auto" id="playerNicknameInput" placeholder="Enter nickname">
						<div id="errorMessage" class="text-danger mt-2" style="display: none;"></div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" id="nextPlayerButton">
              ${currentPlayer == totalPlayer ? "Start" : "Next"}
            </button>
					</div>
				</div>
			</div>
		`;
  }

  setEvent() {
    this.addEvent(
      "click",
      "#nextPlayerButton",
      this.handleNextPlayerButtonClick.bind(this),
    );
  }

  handleNextPlayerButtonClick(e) {
    let { currentPlayer, playerName } = this.state;
    let { totalPlayer } = this.props;
    const $nicknameInput = this.$target.querySelector("#playerNicknameInput");
    const nickname = $nicknameInput.value.trim();
    const $error = this.$target.querySelector("#errorMessage");

    if (nickname == "") {
      $nicknameInput.classList.add("is-invalid");
      $error.style.display = "block";
      $error.textContent = "Nickname cannot be empty";
    } else if (this.validateNickName(nickname)) {
      $nicknameInput.classList.add("is-invalid");
      $error.style.display = "block";
      $error.textContent = "Nickname already exist";
    } else if (currentPlayer < totalPlayer) {
      currentPlayer++;
      playerName.push(nickname);
      this.setState({ currentPlayer, playerName });
    } else if (currentPlayer == totalPlayer) {
      playerName.push(nickname);
      this.props.handleNickModalClick(shuffleArray(playerName));
      bootstrap.Modal.getOrCreateInstance(this.$target).hide();
      // this.$target.remove();
      window.location.hash = "#/tournament";
    }
  }

  validateNickName(name) {
    return this.state.playerName.some((existingName) => existingName === name);
  }
}
