import Component from "./core/Component.js";
import TwoFAView from "./pages/TwoFAView.js";
import { apiCall } from "./utils/api.js";
import { loginSocket, pongSocket } from "./utils/ws.js";

export default class Router extends Component {
  setup() {
    this.state = {
      routes: [],
      authenticated: false,
    };
    this.alreadyRoute = false;
  }

  addRoute(fragment, component) {
    this.state.routes.push({ fragment, component });
  }

  async checkRoutes() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("code") || this.alreadyRoute) return;

    const data = await apiCall("/api/login/", "get");

    if (!data.authenticated) {
      window.location.hash = "#/login";
      this.state.routes[1].component();
      return;
    }

    this.state.authenticated = true;
    loginSocket.init("login_status/");

    const currentRoute = this.state.routes.find((route) => {
      return route.fragment === window.location.hash;
    });
    if (
      !currentRoute ||
      (this.state.authenticated && window.location.hash === "#/login")
    ) {
      window.location.hash = "#/";
      this.state.routes[0].component();
      return;
    }

    currentRoute.component();
  }

  start() {
    window.onhashchange = () => {
      const $modalElement = document.querySelector(".modal.show");
      pongSocket.close();

      if ($modalElement) {
        const modal = bootstrap.Modal.getInstance($modalElement);
        modal.hide(); // 모달 닫기
      }
      this.checkRoutes();
    };

    window.onload = async () => {
      const urlParams = new URLSearchParams(window.location.search);

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

          const resJson = await res.json();

          if (resJson.qr_url) {
            new TwoFAView(document.querySelector("#body"), {
              qr_url: resJson.qr_image,
              username: resJson.username,
            });
            return;
          }

          window.location.hash = "/#/";
        } catch (error) {
          console.error(error);
        }
      }

      if (!window.location.hash) {
        window.location.hash = "#/";
      }

      this.checkRoutes();
    };
  }
}
