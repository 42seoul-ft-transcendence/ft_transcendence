import Component from "../../core/Component.js";
import Modal from "../../components/Modal.js";

export default class Login extends Component {
	setup() {
		this.state = {
			modalInstance: null,
		}
	}

	template() {
		return /* html */ `
			<div class="container w-75 text-center p-5 bg-white rounded-3 shadow-lg">
				<p class="h1">Login</p>
				<div class="mb-4 text-start">
          <label for="id" class="form-label">ID</label>
          <input type="text" class="form-control" id="id" />
          <label for="password" class="form-label mt-2">Password</label>
          <input type="password" class="form-control" id="password" />
        </div>
				<div class="d-grid gap-2">
      		<button id="loginBtn" type="button" class="btn btn-primary ">Login</button>
					<p class="text-center mb-2 small">
					<button id="openModalBtn" type="button" class="btn btn-link link-underline-primary p-0 border-0 bg-transparent">
						Sign Up
					</button>
					</p>
				</div>
				<hr class="mx-3 my-1 mb-3">
				<div class="container">
					<button type="button" class="btn btn-outline-danger">
       		<img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="42Seoul Logo" class="me-2">
              Login with 42Seoul
          </button>	
				</div>
			</div>
			<div class="modal fade" id="registrationModal" tabindex="-1" aria-labelledby="registrationModalLabel" aria-hidden="true">
			</div>
		`;
	}

	mounted() {
		new Modal(this.$target.querySelector('#registrationModal'));
		if (!this.state.modalInstance)
			this.state.modalInstance = new bootstrap.Modal(this.$target.querySelector('#registrationModal'));
	}

	setEvent() {
		this.addEvent('click', '#openModalBtn', () => {
			this.state.modalInstance.show();
		})

		this.addEvent('submit', '#registrationForm', (event) => {
			event.preventDefault();

			const formData = new FormData(event.target);

			const data = {
				email: formData.get('email'),
				username: formData.get('username'),
				password: formData.get('password'),
				confirmPassword: formData.get('confirmPassword')
			};

			this.state.modalInstance.hide();
		})

		this.addEvent('click', '#loginBtn', () => {
			window.location.hash = "#/home";
		})
	}
}












