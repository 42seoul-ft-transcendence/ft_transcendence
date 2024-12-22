import Component from "../core/Component.js";
import { getTranslation } from "../utils/translations.js";

export default class FriendCard extends Component {
	template() {
		const { profileImage, message, username } = this.props;

		return /* html */ `
		<!-- Friend Card -->
		<div class="friend-card d-flex align-items-center justify-content-between">
			<div class="d-flex align-items-center">
				<div class="friend-profile-pic-wrapper online me-3">
					<img class="friend-profile-pic" src=${profileImage} alt="Profile Picture">
				</div>
				<div class="message-wrapper">
					<p class="friend-name mb-1">${username}</p>
					<p class="friend-message mb-0">${message}</p>
				</div>
			</div>
			<button id="deleteBtn" class="btn btn-outline-danger btn-sm delete-friend-btn" data-id="${username}">
				${getTranslation("delete")}
			</button>
		</div>
		`;
	}

	// isOnline(userName) {
	// 	// user is online
	// }
}
