import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import FriendCard from "../../components/FriendCard.js";
import FriendRequest from "../../components/FriendRequest.js";

import { getTranslation } from "../../utils/translations.js";
import { apiCall } from "../../utils/api.js";
import { loginSocket } from "../../utils/ws.js";

export default class FriendView extends Component {
  async setup() {
    this.state = {
      friendCount: 0,
      friendData: [],
      requestCount: 0,
      requestData: [],
    };

    const requestData = await apiCall("/api/friendship/received/", "get");
    const requestCount = requestData.received_requests.length;

    loginSocket.on("onOpen", () => {
      loginSocket.sendMessage(
        JSON.stringify({ action: "fetch_friend_statuses" }),
      );
    });

    loginSocket.on("onMessage", (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "friend_statuses":
          this.setState({
            friendCount: data.friends.length,
            friendData: data.friends,
          });
          break;
      }
    });

    loginSocket.sendMessage(
      JSON.stringify({ action: "fetch_friend_statuses" }),
    );

    this.setState({
      requestData: requestData.received_requests,
      requestCount,
    });
  }

  template() {
    const { friendCount, requestCount } = this.state;

    let temp = /* html */ `
			<div class="container nav-section"></div>
			<div class="container friends" id="friendSection">
				<h3 class="mb-4 fw-bold">${getTranslation("friendList")}</h3>
        <div class="row g-3 px-3">`;

    for (let i = 0; i < requestCount; ++i)
      temp += /* html */ `<div id="friendRequest${i}" class="col-md-4"></div>`;
    temp += /* html */ `</div>
    <div id="friendCard" class="row g-4 mt-1">`;

    for (let i = 0; i < friendCount; ++i)
      temp += /* html */ `<div id="friendCard${i}" class="col-md-6"></div>`;
    temp += /* html */ `
        </div>
      </div>
    `;
    return temp;
  }

  mounted() {
    const { friendData, requestData } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"), this.props);

    requestData.length &&
      requestData.forEach((list, index) => {
        new FriendRequest(
          this.$target.querySelector(`#friendRequest${index}`),
          {
            list,
            handleFriendRequestFinish:
              this.handleFriendRequestFinish.bind(this),
          },
        );
      });

    friendData.length &&
      friendData.forEach((list, index) => {
        new FriendCard(this.$target.querySelector(`#friendCard${index}`), {
          list,
          handleFriendRequestFinish: this.handleFriendRequestFinish.bind(this),
        });
      });
  }

  async setEvent() {
    // this.$target.querySelectorAll(".delete-friend-btn").forEach((card) => {
    //   card.onclick = (e) => {
    //     const username = e.target.getAttribute("data-id");
    //     console.log(username);
    //     const $card = e.target.closest("[id^=friendCard]");
    //     if ($card) $card.remove();
    //   };
    // });

    this.addEvent("click", "#addFriendBtn", async () => {
      const input = this.$target.querySelector("#addFriendInput");
      const username = input.value;

      try {
        const data = await apiCall(
          "/api/friendship/send/",
          "post",
          JSON.stringify({
            receiver: username,
          }),
        );
      } catch (e) {
        console.warn(e);
      }
    });
  }

  handleFriendRequestFinish(target_id) {
    this.setState({
      requestData: this.state.requestData.filter(
        (request) => request.requester_id !== target_id,
      ),
      requestCount: this.state.requestCount - 1,
    });
  }
}
