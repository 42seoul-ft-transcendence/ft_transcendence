import Component from "./core/Component.js";
import TwoFAView from "./pages/TwoFAView.js";
import { wsConnect } from "./utils/ws.js";
import { apiCall } from "./utils/api.js";

export default class Router extends Component {
  setup() {
    this.state = {
      routes: [],
      authenticated: false,
    };
  }

  addRoute(fragment, component) {
    this.state.routes.push({ fragment, component });
  }

  async checkRoutes() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("code")) return;

    const data = await apiCall("/api/login/", "get");

    console.log(data);
    if (!data.authenticated) {
      window.location.hash = "#/login";
      this.state.routes[1].component();
      return;
    }

    this.state.authenticated = true;

    const currentRoute = this.state.routes.find((route) => {
      return route.fragment === window.location.hash;
    });

    if (
      !currentRoute ||
      (this.state.authenticated && window.location.hash === "#/login")
    ) {
      window.location.hash = "#/";
      // history.pushState(null, "", "#/");
      this.state.routes[0].component();
      return;
    }

    currentRoute.component();
  }

  start() {
    window.onhashchange = () => {
      this.checkRoutes();
    };

    window.onload = () => {
      this.checkRoutes();
    };

    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    // this.checkRoutes();
  }
}

// window.onload = async () => {
//   await loginCode();
// };
