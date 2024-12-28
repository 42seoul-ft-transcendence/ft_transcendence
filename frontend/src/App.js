import Component from "./core/Component.js";
import Router from "./Router.js";

import Login from "./pages/LoginView.js";
import Home from "./pages/HomeView.js";
import Game from "./pages/GameView.js";
import Tournament from "./pages/TournamentView.js";
import Navbar from "./components/Navbar.js";
import HistoryView from "./pages/profile/HistoryView.js";
import FriendView from "./pages/profile/FriendView.js";
import SettingView from "./pages/profile/SettingView.js";

import * as brackets from "./utils/tournament.js";

const data = {
  avatar: "https://robohash.org/JohnDoe.png?size=150x150",
};

export default class App extends Component {
  async setup() {
    this.state = {
      gameCnt: 0,
      gameMode: "",
      matches: [],
      participants: [],
      matchGame: null,
      opponent1: null,
      opponent2: null,
      profile: data,
    };
  }

  template() {
    return /* html */ `
      <div id="nav"></div>
      <div id="body"></div>
    `;
  }

  mounted() {
    const { profile } = this.state;
    const router = new Router();

    const $nav = this.$target.querySelector("#nav");
    const $body = this.$target.querySelector("#body");

    router.addRoute("#/", () => {
      new Navbar($nav, profile);
      new Home($body, {
        handleNickModalClick: this.handleNickModalClick.bind(this),
        handleOneToOneClick: () => {
          this.setState({ gameMode: "singleMode" });
          window.location.hash = "#/game";
        },
      });
    });

    router.addRoute("#/login", () => {
      $nav.innerHTML = "";
      new Login($body, { appRender: this.render.bind(this) });
    });

    router.addRoute("#/game", () => {
      new Navbar($nav, profile);
      new Game($body, {
        gameMode: this.state.gameMode,
        opponent1: this.state.opponent1,
        opponent2: this.state.opponent2,
        handlePongNextGameClick: this.handlePongNextGameClick.bind(this),
      });
      // }
    });

    router.addRoute("#/tournament", () => {
      new Navbar($nav, profile);
      new Tournament($body, {
        playerNames: this.state.playerNames,
        participants: this.state.participants,
        matches: this.state.matches,
        handleTournamentGameStartClick:
          this.handleTournamentGameStartClick.bind(this),
      });
    });

    router.addRoute("#/profile/history", () => {
      new Navbar($nav, profile);
      new HistoryView($body);
    });

    router.addRoute("#/profile/friends", () => {
      new Navbar($nav, profile);
      new FriendView($body);
    });

    router.addRoute("#/profile/setting", () => {
      new Navbar($nav, profile);
      new SettingView($body);
    });

    router.start();
  }

  handleNickModalClick(playerNames) {
    playerNames = brackets.shuffleArray(playerNames);
    let matches = brackets.generateMatchJson(playerNames);
    let participants = brackets.generateParticipantJson(playerNames);

    brackets.insertParticipant(matches, participants);

    this.setState({
      matches: matches,
      participants: participants,
      gameMode: "tournament",
    });
  }

  handleTournamentGameStartClick(match, index) {
    this.setState({
      gameCnt: index,
      matchGame: match,
      opponent1: match.opponent1,
      opponent2: match.opponent2,
    });
  }

  handlePongNextGameClick(opponent1, opponent2) {
    let { matches, matchGame, gameCnt, participants } = this.state;

    console.log(matches);

    const nextMatchIdx = matches.findIndex(
      (match) =>
        matchGame.round_id + 1 === match.round_id &&
        (match.opponent1.id === null || match.opponent2.id === null),
    );

    matchGame.opponent1 = opponent1;
    matchGame.opponent2 = opponent2;

    matches[gameCnt] = matchGame;
    if (nextMatchIdx != -1) {
      let id = opponent1.score > opponent2.score ? opponent1.id : opponent2.id;

      if (matches[nextMatchIdx].opponent1.id === null) {
        matches[nextMatchIdx].opponent1.id = id;
        matches[nextMatchIdx].opponent1.name = participants[id].name;
      } else {
        matches[nextMatchIdx].opponent2.id = id;
        matches[nextMatchIdx].opponent2.name = participants[id].name;
      }
      matches[nextMatchIdx].empty = false;
    }

    this.setState({ matches });
  }
}
