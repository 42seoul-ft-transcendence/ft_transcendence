import Component from "../core/Component.js";

import { getTranslation } from "../utils/translations.js";
import { apiCall } from "../utils/api.js";

export default class Avatar extends Component {
  setup() {
    this.state = {
      profile: this.props,
    };
  }
  template() {
    const { profile } = this.state;

    return /* html */ `
			<div>
        <img class="setting-profile-pic mb-1" src=${
          profile?.profileImage
        } alt="Profile Picture">
        <input type="file" id="fileInput" style="display: none;">
      </div>
      <button class="edit-button">${getTranslation("edit")}</button>
		`;
  }

  setEvent() {
    this.addEvent("click", ".edit-button", () => {
      const fileInput = document.getElementById("fileInput");

      fileInput.click();
    });

    this.addEvent("change", "#fileInput", async (e) => {
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

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await apiCall(
          "/api/login/avatar/upload/",
          "post",
          formData,
        );

        if (res.ok) {
          console.warn("Avatar upload success");
        } else {
          console.warn("Failed to upload avatar");
        }
      } catch (e) {
        console.warn(e);
      }
    });
  }
}
