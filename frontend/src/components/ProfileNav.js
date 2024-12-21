import Component from "../core/Component.js";
import { getTranslation } from "../utils/translations.js";

export default class ProfileNav extends Component {
  template() {
    return /* html */ `
          <!-- Internal Navigation -->        
            <ul class="nav nav-underline">
                <li class="nav-item">
                    <a class="nav-link" data-name="history">${getTranslation(
                      "history",
                    )}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-name="friends">${getTranslation(
                      "friends",
                    )}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-name="setting">${getTranslation(
                      "setting",
                    )}</a>
                </li>
            </ul>
        `;
  }

  mounted() {
    const hash = window.location.hash || "#/profile/history"; // 기본값 설정
    const navLinks = this.$target.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const targetHash = "#/profile/" + link.dataset.name;
      if (targetHash === hash) link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  setEvent() {
    this.addEvent("click", ".nav-item", (event) => {
      event.preventDefault();

      window.location.hash = "#/profile/" + event.target.dataset.name;
    });
  }
}
