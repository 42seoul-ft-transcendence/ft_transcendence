import Component from '/frontend/src/core/Component.js';

export default class HistoryCard extends Component {
    template() {
        return /* html */`
        <!-- Match History Section -->
        <div class="match-card blue">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <div class="player-profile me-2"></div>
                    <span>You</span>
                </div>
                <div class="d-flex align-items-center">
                    <span>Opponent</span>
                    <div class="player-profile ms-2"></div>
                </div>
            </div>
            <!-- Centered Score -->
            <div class="score-container">
                <div class="score">3 - 2</div>
            </div>
            <div class="d-flex justify-content-end">
                <div class="date">2024-11-25</div>
            </div>
        </div>
        `;
    }
}
