import Component from "../core/Component.js";

export default class Modal extends Component {
	template() {
		return /* html */ `
		<div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="registrationModalLabel">Register</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <!-- Modal Body -->
          <div class="modal-body">
            <form id="registrationForm">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text">@</span>
                  <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" class="form-control" id="username" name="username" placeholder="Enter your username" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" class="form-control" id="registerPassword" name="password" placeholder="Enter your password" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                </div>
              </div>
            </form>
          </div>
          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" form="registrationForm" class="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
		`;
	}
}