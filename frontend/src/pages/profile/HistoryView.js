import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import HistoryCard from "../../components/HistoryCard.js";

import { getTranslation } from "../../utils/translations.js";
import { apiCall } from "../../utils/api.js";
import HistoryProfile from "../../components/HistoryProfile.js";

export default class HistoryView extends Component {
  async setup() {
    this.state = {
      matchCount: test.length,
      history: test,
      profile: null,
      is_friend: true,
    };

    const [hashPath, queryString] = window.location.hash.split("?");
    const urlParams = new URLSearchParams(queryString || "");
    const viewId = urlParams.get("id");

    const url = viewId
      ? `/api/login/settings/?id=${viewId}`
      : "/api/login/settings/";

    const resData = await apiCall(url, "get");

    const profile = {
      profileImage: resData.avatar,
      message: resData.status_message,
      username: resData.username,
      winLossRecord: {
        wins: 0,
        losses: 0,
      },
    };

    if (viewId) {
      const res = await apiCall(
        `/api/friendship/is-friend//?target=${viewId}`,
        "get",
      );
      this.state.is_friend = res.is_friend;
    }

    this.setState({ profile });
  }

  template() {
    const { matchCount } = this.state;

    let temp = /* html */ `
      <div class="container nav-section"></div>
      <div class="container">
        <div id="historySection"></div>
        <div class="row gy-4">
      `;
    for (let i = 0; i < matchCount; ++i)
      temp += /* html */ `<div id="historyCard${i}" class="col-md-6"></div>`;
    temp +=
      /* html */
      `
          </div>
      </div>`;

    return temp;
  }

  mounted() {
    const { history } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"), this.props);

    new HistoryProfile(this.$target.querySelector("#historySection"), {
      profile: this.state.profile,
      is_friend: this.state.is_friend,
    });

    history.forEach((match, index) => {
      new HistoryCard(
        this.$target.querySelector(`#historyCard${index}`),
        match,
      );
    });
  }
}

const test = [
  {
    me: {
      name: "You",
      score: 3,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "are",
      score: 1,
      profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
    },
    date: "2024/12/07",
  },
  {
    me: {
      name: "good",
      score: 2,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "gril",
      score: 3,
      profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=JohnDoe",
    },
    date: "2024/12/17",
  },
  {
    me: {
      name: "Youasdf",
      score: 1,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "Yosadfdsgu",
      score: 3,
      profileImage: "https://picsum.photos/150",
    },
    date: "2024/10/17",
  },
  {
    me: {
      name: "u111",
      score: 3,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "You123",
      score: 0,
      profileImage: "https://picsum.photos/150",
    },
    date: "2024/11/17",
  },
  {
    me: {
      name: "You",
      score: 3,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "are",
      score: 1,
      profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
    },
    date: "2024/12/07",
  },
  {
    me: {
      name: "good",
      score: 2,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "gril",
      score: 3,
      profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=JohnDoe",
    },
    date: "2024/12/17",
  },
  {
    me: {
      name: "Youasdf",
      score: 1,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "Yosadfdsgu",
      score: 3,
      profileImage: "https://picsum.photos/150",
    },
    date: "2024/10/17",
  },
  {
    me: {
      name: "u111",
      score: 3,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    },
    oppenent: {
      name: "You123",
      score: 0,
      profileImage: "https://picsum.photos/150",
    },
    date: "2024/11/17",
  },
];
