import Component from '../core/Component.js';

export default class ProfileNav extends Component {
    template() {
        return /* html */ `
          <!-- Internal Navigation -->        
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#/profile/history">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/profile/friends">Friends</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="#/profile/setting">Setting</a>
                </li>
            </ul>
        `;
    }
}