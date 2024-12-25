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
    this.addEvent("click", "#loginButton", () => {
      console.log("42 login button clicked");
      window.location.href = "/api/login/oauth/redirect/";
      new Loading(this.$target);
    });
  }
}
