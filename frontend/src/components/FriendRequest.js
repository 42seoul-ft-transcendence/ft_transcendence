import Component from "../core/Component.js";
import { getTranslation } from "../utils/translations.js";
import { apiCall } from "../utils/api.js";
import { loginSocket } from "../utils/ws.js";

export default class FriendRequest extends Component {
  template() {
    const {
      id,
      requester_id,
      requester_avatar,
      requester_state_message,
      requester_username,
    } = this.props?.list;

    return /* html */ `
		<!-- Friend Request Card -->
		<div class="request-card shadow-sm p-3 d-flex flex-column align-items-start">
			<div class="d-flex align-items-center mb-3">
				<img class="request-pic rounded-circle me-3" src=${requester_avatar} alt="Profile Picture">
				<div>
				<p class="card-title mb-1">${requester_username}</h5>
				<p class="card-text text-muted mb-0">${requester_state_message}</p>
				</div>
			</div>
			<div class="d-flex justify-content-end w-100">
				<button class="btn btn-success btn-sm me-2 accept-btn" data-id="${requester_id}" data-name="${requester_username}">${getTranslation(
      "accept",
    )}</button>
				<button class="btn btn-danger btn-sm reject-btn" data-id="${requester_id}" data-name="${requester_username}">${getTranslation(
      "reject",
    )}</button>
			</div>
		</div>
		`;
  }

  setEvent() {
    this.addEvent("click", ".accept-btn", (e) => this.acceptFriendRequest(e));
    this.addEvent("click", ".reject-btn", (e) => this.rejectFriendRequest(e));
  }

  async acceptFriendRequest(e) {
    const request_id = e.target.dataset.id;
    const data = await apiCall(
      `/api/friendship/respond/${request_id}/`,
      "post",
      JSON.stringify({
        action: "accept",
      }),
    );
    this.$target.remove();
    // this.props.handleFriendRequestFinish(request_id);
  }

  async rejectFriendRequest(e) {
    const request_id = e.target.dataset.id;
    const data = await apiCall(
      `/api/friendship/respond/${request_id}/`,
      "post",
      JSON.stringify({
        action: "deny",
      }),
    );
    this.$target.remove();
    // this.props.handleFriendRequestFinish(request_id);
  }
}
