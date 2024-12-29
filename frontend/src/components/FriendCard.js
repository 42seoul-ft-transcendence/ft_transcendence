import Component from "../core/Component.js";

import { getTranslation } from "../utils/translations.js";
import { apiCall } from "../utils/api.js";

export default class FriendCard extends Component {
  template() {
    const { status_message, username, avatar, id, status } = this.props.list;

    return /* html */ `
		<!-- Friend Card -->
		<div class="friend-card d-flex align-items-center justify-content-between">
			<div class="d-flex align-items-center">
				<div class="friend-profile-pic-wrapper ${status} me-3">
					<img class="friend-profile-pic" id=${id} src=${avatar} alt="Profile Picture">
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

  setEvent() {
    this.addEvent("click", ".friend-profile-pic", () => {
      window.location.hash = `#/profile/history?id=${this.props.list.id}`;
    });

    // this.addEvent("click", "#deleteBtn", (e) => this.deleteFriendRequest(e));
  }

  async deleteFriendRequest(e) {
    const request_id = e.target.dataset.id;
    const data = await apiCall(
      `/api/friendship/respond/${request_id}/`,
      "post",
      JSON.stringify({
        action: "delete",
      }),
    );
    this.$target.remove();
  }
}
