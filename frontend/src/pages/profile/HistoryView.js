import Component from "/frontend/src/core/Component.js";
import ProfileNav from "/frontend/src/components/ProfileNav.js";
import HistoryCard from "/frontend/src/components/HistoryCard.js";

export default class HistoryView extends Component {
    setup() {
        this.state = {
            matchCount : 2
        }
    }

    template() {
        const { matchCount } = this.state;
        let temp = /* html */`
            <div class="container nav-section"></div>
            <div class="container mt-4" id="historySection">
                <div class="profile-section">
                    <div class="profile-pic"></div>
                    <p class="fw-bold">nickname / username</p>
                    <div class="record-box">
                        3승 1패
                    </div>
                </div>
                <div class="row gy-4">
                `;
        for (let i = 0; i < matchCount; ++i)
            temp += /* html */
                `<div id="historyCard${i}" class="col-md-6"></div>`;

        temp += /* html */
            `
                </div>
            </div>`;

        return temp;
    }

    mounted() {
        const { matchCount } = this.state;

        new ProfileNav(this.$target.querySelector('.nav-section'));
        for (let i = 0; i < matchCount; ++i)
            new HistoryCard(this.$target.querySelector(`#historyCard${i}`));

    }
}
