import Component from "/frontend/src/core/Component.js";

export default class FriendCard extends Component {

	template() {
		const { profileImage, nickname, username } = this.props;

		return /* html */ `
		<!-- Friend Card -->
		<div class="friend-card d-flex align-items-center">
			<div class="friend-profile-pic-wrapper online me-3">
				<img class="friend-profile-pic" src=${profileImage} alt="Profile Picture">
			</div>
			<div>
				<p class="friend-name mb-1">${username}</p>
				<p class="friend-username mb-0">${nickname}</p>
			</div>
		</div>
		`;
	}

	// isOnline(userName) {
	// 	// user is online
	// }
}