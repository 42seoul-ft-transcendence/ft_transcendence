// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import FriendCard from "/frontend/src/components/FriendCard.js";
import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import FriendCard from "../../components/FriendCard.js";
import { getTranslation } from "../../utils/translations.js";

const data = {
  users: [
    {
      id: 1,
      profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
      message: "",
      username: "john_doe",
      winLossRecord: {
        wins: 10,
        losses: 3,
      },
    },
    {
      id: 2,
      profileImage: "https://via.placeholder.com/150",
      message: "ProGamer77 hihddddddddddddddddd dddddddddddihiiihhhhhhhhhhhhhhhh",
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
      message: "dddddddddddihiiihh hh hh hh hh hh",
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
};

export default class FriendView extends Component {
  setup() {
    this.state = {
      friendCount: data.users.length,
      friendData: data.users,
    };
  }

  template() {
    const { friendCount } = this.state;

    let temp = /* html */ `
			<div class="container nav-section"></div>
			<div class="container friends" id="friendSection">
				<h3 class="mb-4 fw-bold">${getTranslation("friendList")}</h3>
				<div class="row gy-4">
		`;
    for (let i = 0; i < friendCount; ++i)
      temp += /* html */ `<div id="friendCard${i}" class="col-md-6"></div>`;
    temp +=
      /* html */
      `
				</div>
			</div>`;
    return temp;
  }

  mounted() {
    const { friendData } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"));

    friendData.forEach((list, index) => {
      new FriendCard(this.$target.querySelector(`#friendCard${index}`), list);
    });
  }
}
