import Component from "../core/Component.js";

export default class Navbar extends Component {
  template() {
    const { profileImage } = this.props;

    return /* html */ `
			<nav class="pong-nav navbar navbar-expand bg-primary navbar-dark px-4 py-3">
				<div class="container-fluid">
					<a class="navbar-brand fw-bold" href="#/">PONG!</a>
					<ul class="navbar-nav ms-auto">
						<li class="nav-item">
							<div class="icon" id="profileIcon">
								<img src=${profileImage} alt="Profile Image">
							</div>
						</li>
					</ul>
				</div>
			</nav>
		`;
  }

  setEvent() {
    this.addEvent('click', '#profileIcon', () => window.location.href = '#/profile/history')
    // this.addEvent("click", "#profileIcon", () =>
    //   window.history.pushState({ isManual: true }, "", "/profile/history"),
    // );
  }
}
