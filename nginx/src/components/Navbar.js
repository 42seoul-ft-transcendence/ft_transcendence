import Component from '../core/Component.js';

export default class Navbar extends Component {
	template() {
		return /* html */ `
		<nav class="navbar navbar-expand bg-primary navbar-dark fixed-top px-4 py-3">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">PONG</a>
				<ul class="navbar-nav ms-auto">
					<li class="nav-item">
						<div class="icon">
							<!-- 프로필 이미지 -->
							<img src="https://via.placeholder.com/40" alt="Profile Icon">
						</div>
					</li>
				</ul>
			</div>
		</nav>
	`;
	}
}
