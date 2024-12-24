// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import FriendCard from "/frontend/src/components/FriendCard.js";
import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import FriendCard from "../../components/FriendCard.js";
import { getTranslation } from "../../utils/translations.js";
import FriendRequest from "../../components/FriendRequest.js";

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

export default class FriendView extends Component {
  async setup() {
    this.state = {
      friendCount: data.users.length,
      friendData: data.users,
    };
    try {
      const res = await fetch("/api/friendship/received/", {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("HTTP status " + res.status);
      }

      const data1 = await res.json();
      console.log(data1);
    } catch (e) {
      console.error(e);
    }
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
    <div class="row g-4 mt-1">`;

    for (let i = 0; i < friendCount; ++i)
      temp += /* html */ `<div id="friendCard${i}" class="col-md-6"></div>`;

    temp +=
      /* html */
      `
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

    new ProfileNav(this.$target.querySelector(".nav-section"));
    new FriendRequest(this.$target.querySelector("#friendRequest"));

    requestData.forEach((list, index) => {
      new FriendRequest(
        this.$target.querySelector(`#friendRequest${index} `),
        list,
      );
    });
    friendData.forEach((list, index) => {
      new FriendCard(this.$target.querySelector(`#friendCard${index} `), list);
    });
  }

  setEvent() {
    this.addEvent("click", ".delete-friend-btn", (e) => {
      const username = e.target.getAttribute("data-id");
      console.log(username);
      const card = e.target.closest("[id^=friendCard]");
      if (card) card.remove();
    });

    this.addEvent("click", ".accept-btn", (e) => {
      const username = e.target.getAttribute("data-id");
      console.log(username);

      const card = e.target.closest("[id^=friendRequest]");
      if (card) card.remove();
    });

    this.addEvent("click", ".reject-btn", (e) => {
      const username = e.target.getAttribute("data-id");
      console.log(username);
      const card = e.target.closest("[id^=friendRequest]");
      if (card) card.remove();
    });

    this.addEvent("click", "#addFriendBtn", async () => {
      const input = this.$target.querySelector("#addFriendInput");
      const username = input.value;
      const csrfToken = getCSRFToken();

      try {
        const res = await fetch("/api/friendship/send/", {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            receiver: username,
          }),
        });

        if (!res.ok) {
          console.log(res);
          throw new Error("HTTP status " + res.status);
        }

        const data = await res.json();
        console.log(data);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

function getCSRFToken() {
  let cookieValue = null; // 기본값
  const cookies = document.cookie.split(";"); // 쿠키 문자열을 ';'로 분리
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // 공백 제거

    // 'csrftoken='으로 시작하는 쿠키를 찾음
    if (cookie.startsWith("csrftoken=")) {
      cookieValue = cookie.substring("csrftoken=".length);
      break;
    }
  }

  return cookieValue;
}
