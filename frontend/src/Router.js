import Component from "./core/Component.js";

export default class Router extends Component {
  setup() {
    this.state = {
      routes: [],
    };
  }

  addRoute(fragment, component) {
    this.state.routes.push({ fragment, component });
  }

  checkRoutes() {
    const currentRoute = this.state.routes.find((route) => {
      return route.fragment === window.location.hash;
    });

    if (!currentRoute) {
      window.location.href = "#/";
      this.state.routes[0].component();
      return;
    }

    currentRoute.component();
  }

  start() {
    window.onhashchange = (event) => {
      console.log("hash changed:", window.location.hash);
      this.checkRoutes();
    };

    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    this.checkRoutes();
  }
}
