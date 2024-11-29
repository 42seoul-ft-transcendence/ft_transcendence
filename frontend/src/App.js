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

import * as brackets from "/frontend/src/utils/tournament.js";

export default class App extends Component {
  setup() {
    this.state = {
      gameMode: "",
      matches: [],
      participants: [],
      matchGame: null,
      opponent1: null,
      opponent2: null,
    };
  }

  template() {
    return /* html */ `
      <div id='nav'></div>
      <div id='body'></div>
    `;
  }

  mounted() {
    const router = new Router();

    router.addRoute("#/", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new Home(this.$target.querySelector("#body"), {
        handleNickModalClick: this.handleNickModalClick.bind(this),
      });
    });

    router.addRoute("#/login", () => {
      new Login(this.$target);
    });

    router.addRoute("#/game", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new Game(this.$target.querySelector("#body"), {
        gameMode: this.state.gameMode,
        // matches: this.state.matches,
        opponent1: this.state.opponent1,
        opponent2: this.state.opponent2,
        // matchGame: this.state.matchGame,
        handlePongNextGameClick: this.handlePongNextGameClick.bind(this),
      });
    });

    router.addRoute("#/tournament", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new Tournament(this.$target.querySelector("#body"), {
        playerNames: this.state.playerNames,
        participants: this.state.participants,
        matches: this.state.matches,
        handleTournamentGameStartClick:
          this.handleTournamentGameStartClick.bind(this),
      });
    });

    router.addRoute("#/profile/history", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new HistoryView(this.$target.querySelector("#body"));
    });

    router.addRoute("#/profile/friends", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new FriendView(this.$target.querySelector("#body"));
    });

    router.addRoute("#/profile/setting", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new SettingView(this.$target.querySelector("#body"));
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

  handleTournamentGameStartClick(match) {
    this.setState({
      matchGame: match,
      opponent1: match.opponent1,
      opponent2: match.opponent2,
    });
  }

  handlePongNextGameClick(opponent1, opponent2) {
    this.state.matchGame.opponent1 = opponent1;
    this.state.matchGame.opponent2 = opponent2;
    this.setState({ matches: this.state.matchGame });
  }
}
