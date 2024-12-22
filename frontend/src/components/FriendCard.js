import Component from "../core/Component.js";

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
				<div>
					<p class="friend-name mb-1">${username}</p>
					<p class="friend-username mb-0">${message}</p>
				</div>
			</div>
			<button id="deleteBtn" class="btn btn-outline-danger btn-sm delete-friend-btn" data-id="${username}">
				Delete
			</button>
		</div>
		`;
	}

	// isOnline(userName) {
	// 	// user is online
	// }

	// setEvent() {
	// 	this.addEvent("click", "#deleteBtn", () => {

	// 			const username = this.$target.getAttribute("data-id");
	// 			console.log(this.$target.getAttribute("data-id"));

	// 			this.deleteFriend(username);
	// 	});
	// }

	// deleteFriend(username) {
	// 	console.log(`${username} 삭제`);
	// 	const card = this.$target.querySelector(`[data-id="${username}"]`).closest(".friend-card");
	// 	if (card)
	// 		card.remove();
	// }
}
