import Component from "/frontend/src/core/Component.js";

export default class FriendCard extends Component {
	template() {
		return /* html */ `
		<!-- Friend Card -->
		<div class="friend-card d-flex align-items-center">
			<div class="friend-profile-pic online me-3"></div>
			<div>
				<p class="friend-name mb-1">Username</p>
				<p class="friend-username mb-0">Nickname</p>
			</div>
		</div>
		`;
	}
}