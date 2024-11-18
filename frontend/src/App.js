import Component from "./core/Component.js";
import Router from "./Router.js";
import Login from "./pages/login/LoginView.js";

// import { Home, Counter, Fetch } from "./pages/Page.js";
import Home from "./pages/home/HomeView.js";

export default class App extends Component {
  mounted() {
    const router = new Router();

    router.addRoute("#/", () => {
      new Home(this.$target);
    });

    router.addRoute("#/login", () => {
      new Login(this.$target);
    });

    router.start();
  }
}
