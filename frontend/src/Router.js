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
      this.checkRoutes();
    };

    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    this.checkRoutes();
  }
}

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("code")) {
    const code = urlParams.get("code");

    try {
      const res = await fetch(`/api/login/oauth/callback/?code=${code}`, {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        console.log(res.json());
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
    console.log(code);
  }
};
