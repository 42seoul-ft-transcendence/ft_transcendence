import Component from "../core/Component.js";

export default class Navbar extends Component {
  setup() {
    this.state = {
      avatar: this.props?.avatar,
    };
    console.log(this.state);
  }

  template() {
    const { avatar } = this.state;

    return /* html */ `
			<nav class="pong-nav navbar navbar-expand bg-warning navbar-dark px-4 py-3">
				<div class="container-fluid">
					<a class="navbar-brand fw-bold" href="#/">PONG!</a>
					<ul class="navbar-nav ms-auto">
						<li class="nav-item">
							<div class="icon" id="profileIcon">
								<img src=${avatar} alt="Profile Image">
							</div>
						</li>
					</ul>
				</div>

			</nav>
		`;
  }

  setEvent() {
    this.addEvent(
      "click",
      "#profileIcon",
      () => (window.location.hash = "#/profile/history"),
    );
  }
}
