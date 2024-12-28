import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import HistoryCard from "../../components/HistoryCard.js";

import { apiCall } from "../../utils/api.js";
import HistoryProfile from "../../components/HistoryProfile.js";

export default class HistoryView extends Component {
  async setup() {
    this.state = {
      history: test,
      profile: null,
      is_friend: true,
    };

    const [hashPath, queryString] = window.location.hash.split("?");
    const urlParams = new URLSearchParams(queryString || "");
    const viewId = urlParams.get("id");
    let profile = null;

    const url = viewId
      ? `/api/login/settings/?id=${viewId}`
      : "/api/login/settings/";

    try {
      const resData = await apiCall(url, "get");

      profile = {
        id: resData.id,
        profileImage: resData.avatar,
        message: resData.status_message,
        username: resData.username,
        winLossRecord: {
          wins: 0,
          losses: 0,
        },
      };
    } catch (e) {
      console.error(e);
      window.location.hash = "#/profile/history";
      return;
    }

    if (viewId && profile.id !== viewId) {
      try {
        const res = await apiCall(
          `/api/friendship/is-friend//?target=${viewId}`,
          "get",
        );
        this.state.is_friend = res.is_friend;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const url = viewId
        ? `/api/game/match-history/?target=${viewId}`
        : "/api/game/match-history/";

      const res = await apiCall(url, "get");
      console.log(res);
      this.state.history = this.transformMatches(res.matches, profile.id);
      console.log(this.state.history);
      profile.winLossRecord = this.calculateStatistics(this.state.history);
    } catch (e) {
      console.error(e);
    }

    this.setState({ profile });
  }

  template() {
    const { history } = this.state;

    let temp = /* html */ `
      <div class="container nav-section"></div>
      <div class="container">
        <div id="historySection"></div>
        <div class="row gy-4">
      `;
    for (let i = 0; i < history.length; ++i)
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

  transformMatches(matches, myId) {
    return matches.map((match) => {
      const isHostMe = match.host.id === myId; // host가 me인지 확인

      return {
        me: {
          id: isHostMe ? match.host.id : match.guest.id,
          name: isHostMe ? match.host.username : match.guest.username,
          score: isHostMe ? match.host.score : match.guest.score,
          profileImage: isHostMe ? match.host.avatar : match.guest.avatar,
        },
        oppenent: {
          id: isHostMe ? match.guest.id : match.host.id,
          name: isHostMe ? match.guest.username : match.host.username,
          score: isHostMe ? match.guest.score : match.host.score,
          profileImage: isHostMe ? match.guest.avatar : match.host.avatar,
        },
        date: new Date(match.date).toISOString().split("T")[0], // 날짜를 YYYY/MM/DD 형식으로 변환
        result:
          match.winner ===
          (isHostMe ? match.host.username : match.guest.username)
            ? "win"
            : "loss",
      };
    });
  }

  calculateStatistics(transformedMatches) {
    const stats = {
      wins: 0,
      losses: 0,
    };

    transformedMatches.forEach((match) => {
      if (match.result === "win") {
        stats.wins += 1;
      } else {
        stats.losses += 1;
      }
    });

    return stats;
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
