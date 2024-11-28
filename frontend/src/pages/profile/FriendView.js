import Component from "/frontend/src/core/Component.js";
import ProfileNav from "/frontend/src/components/ProfileNav.js";
import FriendCard from "/frontend/src/components/FriendCard.js";

export default class FriendView extends Component {
	setup() {
		this.state = {
			friendCount: 4
		}
	}

	template() {
		const { friendCount } = this.state;
		let temp = /* html */`
			<div class="container nav-section"></div>
			<div class="container mt-4" id="friendSection">
				<h3 class="mb-4">Friends List</h3>
				<div class="row gy-4">
		`;
		for (let i = 0; i < friendCount; ++i)
			temp += /* html */
				`<div id="friendCard${i}" class="col-md-4"></div>`;
		temp += /* html */
			`
				</div>
			</div>`;
		return temp;
	}

	mounted() {
		const { friendCount } = this.state;

		new ProfileNav(this.$target.querySelector('.nav-section'));
		for (let i = 0; i < friendCount; ++i)
			new FriendCard(this.$target.querySelector(`#friendCard${i}`));
	}
}
