import Component from "../core/Component.js";
export default class HistoryCard extends Component {
  template() {
    const { me, oppenent, date } = this.props;

    return /* html */ `
        <!-- Match History Section -->
        <div class="match-card ${this.isWinner(me, oppenent)}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <div>
                        <img class="player-profile me-2" src=${
                          me.profileImage
                        } alt="Profile Picture">
                    </div>
                    <span>${me.name}</span>
                </div>
                <div class="d-flex align-items-center">
                    <span>${oppenent.name}</span>
                    <div>
                        <img id="history-oppenent" class="player-profile ms-2" src=${
                          oppenent.profileImage
                        } alt="Profile Picture">
                    </div>
                </div>
            </div>
            <!-- Centered Score -->
            <div class="score-container">
                <div class="score">${me.score} - ${oppenent.score}</div>
            </div>
            <div class="d-flex justify-content-end">
                <div class="date">${date}</div>
            </div>
        </div>
        `;
  }

  isWinner(me, oppenent) {
    return me.score > oppenent.score ? "blue" : "pink";
  }

  setEvent() {
    this.addEvent("click", "#history-oppenent", async () => {
      window.location.hash = `#/profile/history?id=${this.props.oppenent.id}`;
    });
  }
}
