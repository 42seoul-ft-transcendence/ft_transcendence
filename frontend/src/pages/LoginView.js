// import Component from "/frontend/src/core/Component.js";
import Component from "../core/Component.js";
import Loading from "./LoadingView.js";

export default class Login extends Component {
  template() {
    return /* html */ `
		<div class="d-flex justify-content-center align-items-center vh-100">
			<div class="container h-50 w-50 d-flex flex-column justify-content-center text-center bg-white rounded-4 shadow-lg">
				<p class="h1 fw-bold">LOGIN</p>
				<div class="mt-5">
					<button type="button" class="btn btn-outline-primary py-2" id="loginButton">
						<img src="/frontend/src/utils/42logo.png" alt="42Seoul Logo" class="me-2" style="width: 40px; height: 40px;">
						Login with 42Seoul
					</button>
				</div>
			</div>
		</div>
		`;
  }

  setEvent() {
    this.addEvent("click", "#loginButton", async () => {
      console.log("42 login button clicked");
      window.location.href = "/api/login/oauth/redirect/";
      new Loading(this.$target);
    });

    // this.$target.onload = () => {
    // };
  }
}

const loginCode = async (urlParams) => {
  // const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);

  // if (urlParams.has("code")) {
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

    console.log("WebSocket", resJson.websocket_url);
    const socket = wsConnect(
      resJson.websocket_url,
      (event) => {
        const data = JSON.parse(event.data);

        if (data.friends) {
          console.log("Friend statuses:", data.friends);
          // 친구 상태를 UI에 반영
          data.friends.forEach((friend) => {
            console.log(`Friend ID: ${friend.id}, Status: ${friend.status}`);
          });
        }
      },
      (ws) => {
        console.log("WebSocket connected");

        // 친구 상태 요청
        ws.send(JSON.stringify({ action: "fetch_friend_statuses" }));
      },
    );

    window.location.hash = "/#/";
    return socket;
  } catch (error) {
    console.error(error);
  }
  // }
};
