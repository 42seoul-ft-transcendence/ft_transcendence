import Component from "./core/Component.js";
import Router from "./Router.js";
import Login from "./pages/LoginView.js";

import Home from "./pages/HomeView.js";
import Game from "./pages/GameView.js";
import Tournament from "./pages/TournamentView.js";
import Navbar from "./components/Navbar.js";

export default class App extends Component {
  setup() {
    this.state = {
      gameMode: "",
      playerNames: [],
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
      new Game(this.$target.querySelector("#body"));
    });

    router.addRoute("#/tournament", () => {
      new Navbar(this.$target.querySelector("#nav"));
      new Tournament(this.$target.querySelector("#body"), {
        playerNames: this.state.playerNames,
      });
    });

    router.start();
  }

  handleNickModalClick(playerNames) {
    this.setState({ playerNames, gameMode: "tournament" });
  }
}
