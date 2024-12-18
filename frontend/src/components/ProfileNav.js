import Component from '../core/Component.js';

export default class ProfileNav extends Component {
    template() {
        return /* html */ `
          <!-- Internal Navigation -->        
            <ul class="nav nav-underline">
                <li class="nav-item">
                    <a class="nav-link" data-name="history">History</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-name="friends">Friends</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-name="setting">Setting</a>
                </li>
            </ul>
        `;
    }

    mounted() {
        const hash = window.location.hash || '#/profile/history'; // 기본값 설정
        const navLinks = this.$target.querySelectorAll('.nav-link');

        navLinks.forEach((link) => {
            const targetHash = '#/profile/' + link.dataset.name;
            if (targetHash === hash)
                link.classList.add('active');
            else
                link.classList.remove('active');
        });
    }

    setEvent() {
        this.addEvent('click', '.nav', (event) => {
            event.preventDefault();

            // 선택한 페이지의 hash를 업데이트 (라우팅용)
            window.location.hash = '#/profile/' + event.target.dataset.name;
        });
    }
}