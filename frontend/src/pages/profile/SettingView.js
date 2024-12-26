import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import UserInfo from "../../components/UserInfo.js";
import SettingInfo from "../../components/SettingInfo.js";
import { getTranslation } from "../../utils/translations.js";
import { apiCall } from "../../utils/api.js";

const data = {
  users: [
    {
      profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
      message: "Champion01",
      username: "john_doe",
      email: "abc@abc.com",
    },
  ],
};

export default class SettingView extends Component {
  setup() {
    this.state = {
      profile: data.users[0],
    };
  }

  template() {
    const { profile } = this.state;
    const lang = localStorage.getItem("lang");

    return /* html */ `
		<div class="container nav-section"></div>
		<!-- Profile Section -->
    <div class="setting-profile-section" id="settingSection">
    <div>
      <img class="setting-profile-pic mb-1" src=${
        profile.profileImage
      } alt="Profile Picture">
      <input type="file" id="fileInput" style="display: none;">
    </div>
      <button class="edit-button">${getTranslation("edit", lang)}</button>
    </div>
    <div id="userInfo" class="container settings-section"></div>
    <div id="settingInfo" class="container settings-section"></div>
		`;
  }

  mounted() {
    const { profile } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"), this.props);
    new UserInfo(this.$target.querySelector("#userInfo"), profile);
    new SettingInfo(this.$target.querySelector("#settingInfo"), {
      handleLangChange: this.props.handleLangChange,
    });
  }

  setEvent() {
    this.$target.querySelector(".edit-button").onclick = () => {
      const fileInput = document.getElementById("fileInput");

      fileInput.click();
    };

    this.$target.querySelector("#fileInput").onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const profileImage = e.target.result;

        this.setState({
          profile: {
            ...this.state.profile,
            profileImage,
          },
        });
      };

      reader.readAsDataURL(file);
    };
  }
}
