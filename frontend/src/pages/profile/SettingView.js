// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import UserInfo from "/frontend/src/components/UserInfo.js";
// import SettingInfo from "/frontend/src/components/SettingInfo.js";
import Component from "../../core/Component.js";
import ProfileNav from "../../components/ProfileNav.js";
import UserInfo from "../../components/UserInfo.js";
import SettingInfo from "../../components/SettingInfo.js";
import { getTranslation } from "../../utils/translations.js";

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
<<<<<<< HEAD
    <div class="setting-profile-section" id="settingSection">
    <div>
      <img class="setting-profile-pic" src=${
        profile.profileImage
      } alt="Profile Picture">
      <input type="file" id="fileInput" style="display: none;">
    </div>
      <button class="edit-button">${getTranslation("edit", lang)}</button>
    </div>
    <div id="userInfo" class="container settings-section"></div>
    <div id="settingInfo" class="container settings-section"></div>
=======
        <div class="setting-profile-section" id="settingSection">
			<div>
				<img class="setting-profile-pic" src=${profile.profileImage
      } alt="Profile Picture">
			</div>
            <button class="edit-button">${getTranslation("edit", lang)}</button>
        </div>
        <div id="userInfo" class="container settings-section"></div>
        <div id="settingInfo" class="container settings-section"></div>
>>>>>>> 8ced16848eaae800f9646ca763c1bfdb01f9556c
		`;
  }

  mounted() {
    const { profile } = this.state;

    new ProfileNav(this.$target.querySelector(".nav-section"));
    new UserInfo(this.$target.querySelector("#userInfo"), profile);
    new SettingInfo(this.$target.querySelector("#settingInfo"), {
      handleLangChange: this.props.handleLangChange,
    });
  }

  setEvent() {
    this.addEvent("click", ".edit-button", () => {
      const fileInput = document.getElementById("fileInput");

      fileInput.click();
    });

    this.addEvent("change", "#fileInput", (e) => {
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
    });
  }
}