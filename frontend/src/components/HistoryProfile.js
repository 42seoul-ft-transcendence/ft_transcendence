import Component from "../core/Component.js";

import { getTranslation } from "../utils/translations.js";
import { apiCall } from "../utils/api.js";

export default class HistoryProfile extends Component {
  setup() {
    this.state = {
      profile: this.props?.profile,
      is_friend: this.props?.is_friend,
    };
  }

  template() {
    const { profile, is_friend } = this.state;

    return /* html */ `
			<div class="profile-section">
				<div>
					<img id="profileImg" class="profile-pic" src=${
            profile?.profileImage
          } alt="Profile Picture">
				</div>
				<p class="fw-bold fs-4 mb-1" id="userName">${profile?.username}</p>
				<p class="fs-6 mb-1" id="message">${profile?.message}</p>
				<button class="btn btn-outline-success btn-sm ${
          is_friend ? "d-none" : ""
        }" id="addFriend">${getTranslation("addFriend")}</button>
				<div class="record-box fw-bold fs-3 my-5">
					<span class="match-card blue">${profile?.winLossRecord.wins}</span> /
					<span class="match-card pink">${profile?.winLossRecord.losses}</span>
				</div>
			</div>
		`;
  }

  setEvent() {
    this.addEvent("click", "#addFriend", async () => {
      try {
        const data = await apiCall(
          "/api/friendship/send/",
          "post",
          JSON.stringify({
            receiver: this.state.profile.id,
          }),
        );
      } catch (e) {
        console.warn(e);
      }
    });
  }
}
