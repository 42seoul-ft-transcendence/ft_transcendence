import Component from "../core/Component.js";
import { apiCall } from "../utils/api.js";
import { getTranslation } from "../utils/translations.js";

export default class SettingInfo extends Component {
  template() {
    const language = localStorage.getItem("lang") || "english";

    return /* html */ `
		  <h2 class="section-title mb-3 fs-4">${getTranslation("setting")}</h2>
      <table class="table shadow">
        <tbody style="opacity: 0.9;">
          <!-- Language Row -->
          <tr>
            <th scope="row" class="text-start align-middle px-3">${getTranslation(
              "language",
            )}</th>
            <td class="text-end">
              <select id="languageSelect" name="language" class="form-select w-100">
                <option value="english" >🇺🇸 English</option>
                <option value="korean">🇰🇷 한국어</option>
                <option value="japanese">🇯🇵 日本語</option>
              </select>
            </td>
          </tr>
          <tr>
            <th scope="row" class="text-start align-middle px-3">${getTranslation(
              "twoFactor",
            )}</th>
            <td class="d-flex justify-content-end align-items-center">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="twoFaSwitch"
                    style="transform: scale(1.8);">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        <!-- Logout Button -->
      <div class="d-flex justify-content-end mt-4">
        <button type="button" class="btn btn-outline-danger px-4 fw-bold" id="logoutBtn">
        ${getTranslation("logout")}
        </button>
      </div>	
		`;
  }

  mounted() {
    const language = localStorage.getItem("lang") || "english";

    this.$target.querySelector(".form-select").value = language;
    this.$target.querySelector("#twoFaSwitch").checked =
      this.props?.two_factor | false;
  }

  setEvent() {
    this.addEvent("change", ".form-select", (e) => this.changeLanguage(e));

    this.addEvent("click", ".form-check-input", async (e) => {
      try {
        const data = await apiCall("/api/login/toggle-2fa/", "post");
        console.log(data);
      } catch (e) {
        console.error(e);
      }
    });

    this.addEvent("click", "#logoutBtn", async (e) => {
      try {
        const data = await apiCall("/api/login/logout/", "get");
        console.log(data);
        window.location.href = "#/login";
      } catch (e) {
        console.error(e);
      }
    });
  }

  changeLanguage(e) {
    const lang = e.target.value;
    console.log(e);

    localStorage.setItem("lang", lang);
    window.location.hash = "";
    window.location.hash = "#/profile/setting";
    this.props.handleLangChange();
  }
}
