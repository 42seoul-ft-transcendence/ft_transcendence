import Component from "/frontend/src/core/Component.js";

export default class Login extends Component {
  template() {
    return /* html */ `
			<div class="container vw-100 py-5 text-center bg-white rounded-4 shadow-lg">
				<p class="h1">Login</p>
				<div class="container mt-5">
					<button type="button" class="btn btn-outline-primary py-2">
       		<img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="42Seoul Logo" class="me-2">
              Login with 42Seoul
          </button>
				</div>
			</div>
		`;
  }
}
