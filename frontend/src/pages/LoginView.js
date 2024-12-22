// import Component from "/frontend/src/core/Component.js";
import Component from "../core/Component.js";

export default class Login extends Component {
  template() {
    return /* html */ `
		<div class="d-flex justify-content-center align-items-center vh-100">
			<div class="container h-50 w-50 d-flex flex-column justify-content-center text-center bg-white rounded-4 shadow-lg">
				<p class="h1 fw-bold">LOGIN</p>
				<div class="mt-5">
					<button type="button" class="btn btn-outline-primary py-2">
						<img src="/frontend/src/utils/42logo.png" alt="42Seoul Logo" class="me-2" style="width: 40px; height: 40px;">
						Login with 42Seoul
					</button>	
				</div>
			</div>
		</div>
		`;
  }

  setEvent() {
    this.addEvent("click", "button", async () => {
      console.log("42 login button clicked");
      try {
        // 백엔드에 요청
        const response = await fetch("/api/login/oauth/redirect/", {
          method: "GET", // 백엔드에서 OAuth 제공자와 통신
          credentials: "include",
          // mode: "cors",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        console.error("Error during OAuth:", error);
      }
    });

    // window.addEventListener("load", async () => {
    //   const params = new URLSearchParams(window.location.search);
    //   const authorizationCode = params.get("code");
    //   const state = params.get("state");

    //   if (authorizationCode && state === sessionStorage.getItem("oauthState")) {
    //     try {
    //       const tokenResponse = await fetch(
    //         `/oauth/callback?code=${authorizationCode}`,
    //       );
    //       if (tokenResponse.ok) {
    //         const tokenData = await tokenResponse.json();
    //         console.log("Access Token:", tokenData.access_token);
    //         sessionStorage.setItem("accessToken", tokenData.access_token);
    //       } else {
    //         console.error(
    //           "Failed to obtain access token:",
    //           tokenResponse.status,
    //         );
    //       }
    //     } catch (error) {
    //       console.error("Error during token exchange:", error);
    //     }
    //   } else {
    //     console.error("Authorization code or state token not found or invalid");
    //   }
    // });
  }
}

// window.onload = function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const accessToken = getCookie("access_token");
//   const refreshToken = getCookie("refresh_token");

//   if (accessToken && refreshToken) {
//     console.log("Access Token:", accessToken);
//     console.log("Refresh Token:", refreshToken);
//     // 필요한 추가 작업 수행
//   }
// };
