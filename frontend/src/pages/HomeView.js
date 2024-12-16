import Component from "/frontend/src/core/Component.js";
import SelectMode from "/frontend/src/components/SelectMode.js";
import Pong from "/frontend/src/components/Pong.js";
import TournamentModal from "/frontend/src/components/TournamentModal.js";
import NickModal from "/frontend/src/components/NickModal.js";

export default class Home extends Component {
  setup() {
    this.state = {
      totalPlayer: 0,
      userName: [],
    };
    if ((this.$nickModal = document.querySelector("#nicknameModal")))
      this.$nickModal.remove();
    if ((this.$tournamentModal = document.querySelector("#tournamentModal")))
      this.$tournamentModal.remove();
    this.$tournamentModal = document.createElement("div");
    this.$tournamentModal.setAttribute("id", "tournamentModal");
    this.$nickModal = document.createElement("div");
    this.$nickModal.setAttribute("id", "nicknameModal");
    document.body.append(this.$nickModal, this.$tournamentModal);
  }

  template() {
    return /* html */ `
      <div id='bodyCtn' class="vh-100 d-flex align-items-center justify-content-center">
        <div id="boardCtn"></div>
        <div id="selectModeCtn" class="position-absolute top-50 start-50 translate-middle" ></div>
      </div>
    `;
  }

  mounted() {
    this.pongInstance = this.initComponent(
      this.pongInstance,
      Pong,
      "#boardCtn",
      {
        gameMode: "",
      },
    );
    this.selectModeInstance = this.initComponent(
      this.selectModeInstance,
      SelectMode,
      "#selectModeCtn",
    );

    this.tournamentModalInstance = this.initComponent(
      this.tournamentModalInstance,
      TournamentModal,
      "#tournamentModal",
      {
        handleTotalPlayerClick: this.handleTotalPlayerClick.bind(this),
      },
    );

    this.nickModalInstance = this.initComponent(
      this.nickModalInstance,
      NickModal,
      "#nicknameModal",
      {
        totalPlayer: this.state.totalPlayer,
        handleNickModalClick: this.props.handleNickModalClick,
      },
    );
  }

  setEvent() {
    this.addEvent("click", "#oneToOne", this.handleOneToOneClick.bind(this));
  }

  handleOneToOneClick() {
    window.location.hash = "#/game";
  }

  handleTotalPlayerClick(number) {
    this.setState({ totalPlayer: number });
  }
}
