import Component from "/frontend/src/core/Component.js";
import ProfileNav from "/frontend/src/components/ProfileNav.js";
import UserInfo from "/frontend/src/components/UserInfo.js";
import SettingInfo from "/frontend/src/components/SettingInfo.js";

export default class SettingView extends Component {
	template() {
		return /* html */`
		<div class="container nav-section"></div>
		<!-- Profile Section -->
        <div class="setting-profile-section">
            <div class="setting-profile-pic"></div>
            <button class="edit-button">edit</button>
        </div>
        <div id="userInfo" class="container settings-section"></div>
        <div id="settingInfo" class="container settings-section"></div>
		`;
	}

	mounted() {
		new ProfileNav(this.$target.querySelector('.nav-section'));
		new UserInfo(this.$target.querySelector('#userInfo'));
		new SettingInfo(this.$target.querySelector('#settingInfo'));
	}
}

