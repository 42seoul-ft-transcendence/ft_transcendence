import Component from "../core/Component.js";
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
}

window.onload = async () => {
  await loginCode();
};

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

      console.log(res);
      const resJson = await res.json();
      console.log(resJson);

      if (resJson.qr_url) {
        console.log("2FA");
        new TwoFAView(document.querySelector("#body"), {
          qr_url: resJson.qr_image,
          username: resJson.username,
        });
        return;
      }

      // console.log("WebSocket", resJson.websocket_url);
      // const socket = wsConnect(
      //   resJson.websocket_url,
      //   (event) => {
      //     const data = JSON.parse(event.data);

      //     if (data.friends) {
      //       console.log("Friend statuses:", data.friends);
      //       // 친구 상태를 UI에 반영
      //       data.friends.forEach((friend) => {
      //         console.log(`Friend ID: ${friend.id}, Status: ${friend.status}`);
      //       });
      //     }
      //   },
      //   (ws) => {
      //     console.log("WebSocket connected");

      //     // 친구 상태 요청
      //     ws.send(JSON.stringify({ action: "fetch_friend_statuses" }));
      //   },
      // );

      window.location.hash = "/#/";
      // return socket;
    } catch (error) {
      console.error(error);
    }
  }
};
