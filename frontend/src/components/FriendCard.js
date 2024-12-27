import Component from "../core/Component.js";
import { getTranslation } from "../utils/translations.js";

export default class FriendCard extends Component {
  template() {
    const { status_message, username, avatar, id, status } = this.props;

    return /* html */ `
		<!-- Friend Card -->
		<div class="friend-card d-flex align-items-center justify-content-between">
			<div class="d-flex align-items-center">
				<div class="friend-profile-pic-wrapper ${status} me-3">
					<img class="friend-profile-pic" src=${avatar} alt="Profile Picture">
				</div>
				<div class="message-wrapper">
					<p class="friend-name mb-1">${username}</p>
					<p class="friend-message mb-0">${status_message}</p>
				</div>
			</div>
			<button id="deleteBtn" class="btn btn-outline-danger btn-sm delete-friend-btn" data-id="${id}">
				${getTranslation("delete")}
			</button>
		</div>
		`;
  }
}
