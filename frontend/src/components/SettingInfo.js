import Component from "../core/Component.js";
import { getTranslation } from "../utils/translations.js";

export default class SettingInfo extends Component {
  template() {
    const language = localStorage.getItem("lang") || "english";

    return /* html */ `
		  <h2 class="section-title mb-3 fs-4">${getTranslation(
        "setting",
        language,
      )}</h2>
      <table class="table shadow">
        <tbody style="opacity: 0.9;">
          <!-- Language Row -->
          <tr>
            <th scope="row" class="text-start align-middle px-3">${getTranslation(
              "language",
            )}</th>
            <td>
              <select class="form-select">
                <option value="english">🇺🇸 English</option>
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
                <input class="form-check-input" type="checkbox" role="switch" id="2faSwitch"
                    style="transform: scale(1.8);">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        <!-- Logout Button -->
      <div class="d-flex justify-content-end mt-4">
        <button type="button" class="btn btn-outline-danger btn-lg px-4 fw-bold" id="logoutBtn">
        ${getTranslation("logout")}
        </button>
      </div>	
		`;
  }

  mounted() {
    const language = localStorage.getItem("lang") || "english";

    this.$target.querySelector(".form-select").value = language;
  }

  setEvent() {
    this.addEvent("change", ".form-select", (e) => this.changeLanguage(e));
  }

  changeLanguage(e) {
    const lang = e.target.value;
    console.log(e);

    localStorage.setItem("lang", lang);
    this.props.handleLangChange();
  }
}
