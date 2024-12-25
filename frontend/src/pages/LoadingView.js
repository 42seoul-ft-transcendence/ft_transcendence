import Component from "../core/Component.js";
import { wsConnect } from "../utils/ws.js";
import TwoFAView from "./TwoFAView.js";

export default class Loading extends Component {
  template() {
    return /* html */ `
			<div class="loading">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`;
  }

  setEvent() {
    this.$target.onload = async () => {
      console.log("??");
      await loginCode();
    };
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
