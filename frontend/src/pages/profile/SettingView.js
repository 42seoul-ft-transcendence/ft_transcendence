import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import UserInfo from "../../components/UserInfo.js";
import SettingInfo from "../../components/SettingInfo.js";
import Avatar from "../../components/Avatar.js";

import { apiCall } from "../../utils/api.js";

export default class SettingView extends Component {
  async setup() {
    this.state = {
      profile: {
        profileImage: "",
        message: "",
        username: "",
        email: "",
        two_factor: false,
      },
    };

    const resData = await apiCall("/api/login/settings/", "get");

    const profile = {
      profileImage: resData.avatar,
      message: resData.status_message,
      username: resData.username,
      email: resData.email,
      two_factor: resData.two_factor,
    };

    this.setState({
      profile,
    });
  }

  template() {
    return /* html */ `
		<div class="container nav-section"></div>
		<!-- Profile Section -->
    <div class="setting-profile-section" id="settingSection"></div>
    <div id="userInfo" class="container settings-section"></div>
    <div id="settingInfo" class="container settings-section"></div>
		`;
  }

  mounted() {
    const { profile } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"), this.props);
    new Avatar(this.$target.querySelector("#settingSection"), profile);
    new UserInfo(this.$target.querySelector("#userInfo"), profile);
    new SettingInfo(this.$target.querySelector("#settingInfo"), {
      handleLangChange: this.setState.bind(this),
      two_factor: profile.two_factor,
    });
  }
}
