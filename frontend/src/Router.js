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
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has("code")) {
        loginCode();
        return;
      }

      this.checkRoutes();
    };

    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    // this.checkRoutes();
  }
}

const loginCode = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);

  if (urlParams.has("code")) {
    history.replaceState(null, "", "/");
    const code = urlParams.get("code");

    try {
      const res = await fetch(`/api/login/oauth/callback/?code=${code}`, {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("HTTP status " + res.status);

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("image/png")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        console.log(url);
        new TwoFAView(document.querySelector("#body"), {
          qrUrl: url,
        });

        return;
      }

      const resJson = await res.json();

      wsConnect(resJson.websocket_url, (event) => {
        console.log(event);
      });
      console.log(resJson);

      window.location.hash = "/#/";
    } catch (error) {
      console.error(error);
    }
  }
};
