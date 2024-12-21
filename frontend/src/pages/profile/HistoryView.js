// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import HistoryCard from "/frontend/src/components/HistoryCard.js";
import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import HistoryCard from "../../components/HistoryCard.js";

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
];

const data = {
  users: [
    {
      id: 1,
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
      nickname: "Champion01",
      username: "john_doe",
      winLossRecord: {
        wins: 10,
        losses: 3,
      },
    },
  ],
};

export default class HistoryView extends Component {
  setup() {
    this.state = {
      matchCount: test.length,
      history: test,
      profile: data.users[0],
    };
  }

  template() {
    const { matchCount } = this.state;
    const { profile } = this.state;

    let temp = /* html */ `
            <div class="container nav-section"></div>
            <div class="container" id="historySection">
                <div class="profile-section">
                    <div>
                        <img id="profileImg" class="profile-pic" src=${profile.profileImage} alt="Profile Picture">
                    </div>
                    <p class="fw-bold fs-4 mb-1" id="userName">${profile.username}</p>
                    <p class="fs-6" id="nickName">${profile.nickname}</p>
                    <div class="record-box fw-bold fs-3 my-5">
                        <span class="match-card blue">${profile.winLossRecord.wins}</span> /
                        <span class="match-card pink">${profile.winLossRecord.losses}</span>
                    </div>
                </div>
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

    new ProfileNav(this.$target.querySelector(".nav-section"));
    // for (let i = 0; i < matchCount; ++i)
    //     new HistoryCard(this.$target.querySelector(`#historyCard${i}`));

    history.forEach((match, index) => {
      new HistoryCard(
        this.$target.querySelector(`#historyCard${index}`),
        match,
      );
    });
  }
}
