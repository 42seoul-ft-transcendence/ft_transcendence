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
  }

  template() {
    return /* html */ `
      <div id='bodyCtn'>
        <div id="selectModeCtn" class="position-absolute top-50 start-50 translate-middle" ></div>
        <div id="boardCtn"></div>
      </div>
    `;
  }

  mounted() {
    // let $nickModal = document.querySelector(
    //   '[aria-labelledby="nicknameModalLabel"]',
    // );
    let $tournamentModal = document.querySelector(
      '[aria-labelledby="tournamentModalLabel"]',
    );

    if (!this.nickModalInstance) {
      let $nickModal = document.createElement("div");
      document.body.append($nickModal);
      this.nickModalInstance = new NickModal($nickModal, {
        totalPlayer: this.state.totalPlayer,
        handleNickModalClick: this.props.handleNickModalClick,
      });
    } else
      this.nickModalInstance.updateProps({
        totalPlayer: this.state.totalPlayer,
      });

    if (!$tournamentModal) {
      $tournamentModal = document.createElement("div");
      document.body.append($tournamentModal);
    }
    new Pong(document.querySelector("#boardCtn"), {
      gameMode: "",
    });
    new SelectMode(document.querySelector("#selectModeCtn"));

    $tournamentModal &&
      new TournamentModal($tournamentModal, {
        handleTotalPlayerClick: this.handleTotalPlayerClick.bind(this),
      });

    // $nickModal &&
    //   new NickModal($nickModal, {
    //     totalPlayer: this.state.totalPlayer,
    //     handleNickModalClick: this.props.handleNickModalClick,
    //   });
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
