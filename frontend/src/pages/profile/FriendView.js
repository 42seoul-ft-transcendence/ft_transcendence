import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import FriendCard from "../../components/FriendCard.js";
import { getTranslation } from "../../utils/translations.js";
import FriendRequest from "../../components/FriendRequest.js";
import { apiCall } from "../../utils/api.js";
import { loginSocket } from "../../utils/ws.js";

export default class FriendView extends Component {
  setup() {
    console.log("FriendView setup");
    this.state = {
      friendCount: 0,
      friendData: [],
      requestCount: 0,
      requestData: [],
    };

    // this.state.requestData = await apiCall("/api/friendship/received/", "get");

    // switch (message.type) {
    //   case "friend_status":
    //     console.log("Friend status updated:", message.content);
    //     this.setState({ friendData: message.content });
    //     break;
    //   default:
    //     console.error("Unknown message type:", message.type);
    // }

    // this.setState({
    //   requestData: requestData,
    //   requestCount: requestData.length,
    // });
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
			</div>`;
    temp += /* html */ `
      <div class="container add-friend">
        <input type="text" class="form-control" id="addFriendInput" placeholder="Add a friend">
        <button id="addFriendBtn" class="btn btn-primary mt-3">test</button>
      </div>
    `;
    return temp;
  }

  mounted() {
    const { friendData, requestData } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"), this.props);
    new FriendRequest(this.$target.querySelector("#friendRequest"));

    requestData.length &&
      requestData.forEach((list, index) => {
        new FriendRequest(
          this.$target.querySelector(`#friendRequest${index}`),
          list,
        );
      });

    friendData.length &&
      friendData.forEach((list, index) => {
        new FriendCard(
          this.$target.querySelector(`#friendCard${index} `),
          list,
        );
      });
  }

  setEvent() {
    this.$target.querySelectorAll(".delete-friend-btn").forEach((card) => {
      card.onclick = (e) => {
        const username = e.target.getAttribute("data-id");
        console.log(username);
        const $card = e.target.closest("[id^=friendCard]");
        if ($card) $card.remove();
      };
    });

    this.$target.querySelectorAll(".accept-btn").forEach((card) => {
      card.onclick = (e) => {
        const request_id = e.target.getAttribute("data-id");
        const $card = e.target.closest("[id^=friendRequest]");
        if ($card) $card.remove();
      };
    });

    this.$target.querySelectorAll(".reject-btn").forEach((card) => {
      card.onclick = async (e) => {
        const request_id = e.target.getAttribute("data-id");

        await apiCall(`/api/friendship/respond/${request_id}`, "post", {});
        const $card = e.target.closest("[id^=friendRequest]");
        if ($card) $card.remove();
      };
    });

    this.$target
      .querySelector("#addFriendBtn")
      .addEventListener("click", async () => {
        const input = this.$target.querySelector("#addFriendInput");
        const username = input.value;

        try {
          const data = await apiCall("/api/friendship/send/", "post", {
            receiver: username,
          });
          console.log(data);
        } catch (e) {
          console.error(e);
        }
      });

    loginSocket.init();
    loginSocket.sendMessage(
      JSON.stringify({ action: "fetch_friend_statuses" }),
    );
    loginSocket.on("onMessage", async (event) => {
      const data = JSON.parse(event.data);
      console.log(data.type);

      switch (data.type) {
        case "friend_statuses":
          const requestData = await apiCall("/api/friendship/received/", "get");

          console.log("requestData", requestData);
          const requestCount = requestData.received_requests.length;

          this.setState({
            requestData: requestData.received_requests,
            requestCount,
          });
          console.log(this.$target.querySelector("#addFriendBtn").onclick);
          break;
      }
    });
  }

  handle;
}

const data = {
  users: [
    {
      id: 1,
      profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
      message: "...................",
      username: "john_doe",
      winLossRecord: {
        wins: 10,
        losses: 3,
      },
    },
    {
      id: 2,
      profileImage: "https://via.placeholder.com/150",
      message: "WWWWWWWWW",
      username: "jane_smith",
      winLossRecord: {
        wins: 8,
        losses: 5,
      },
    },
    {
      id: 3,
      profileImage: "https://via.placeholder.com/150",
      message: "ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
      username: "max_king",
      winLossRecord: {
        wins: 3,
        losses: 9,
      },
    },
    {
      id: 4,
      profileImage: "https://via.placeholder.com/150",
      message: "dddddddddddihi",
      username: "sara_connor",
      winLossRecord: {
        wins: 12,
        losses: 0,
      },
    },
    {
      id: 5,
      profileImage: "https://via.placeholder.com/150",
      message: "プレイヤープレイヤープレイヤープレイ",
      username: "tony_stark",
      winLossRecord: {
        wins: 7,
        losses: 2,
      },
    },
  ],
  requests: [
    {
      id: 1,
      profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
      username: "john_doe",
      message: "let's play a game!",
    },
    {
      id: 2,
      profileImage: "https://via.placeholder.com/150",
      username: "jane_smith",
      message: "let's play a game!",
    },
    {
      id: 3,
      profileImage: "https://via.placeholder.com/150",
      username: "max_king",
      message: "let's play a game!",
    },
  ],
};
