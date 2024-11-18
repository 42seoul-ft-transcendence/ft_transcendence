import Component from '../core/Component.js';

export default class Navbar extends Component {
    template() {
        return /* html */ `
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
			<div class="container-fluid">
				<a class="navbar-brand fw-bold" href="#/login">Pong</a>
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a class="nav-link" href="#/chat">Chat</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#/game">Game</a>
						</li>
					</ul>
				</div>
				<ul class="navbar-nav">
          <li class="nav-item">
              <a class="nav-link" href="#/">Logout</a>
          </li>
        </ul>
				<div class="d-flex align-items-center">
						<img src="https://via.placeholder.com/40" alt="User Avatar" class="avatar" onclick="onAvatarClick()">
				</div>
			</div>
		</nav>
	`;
    }
}