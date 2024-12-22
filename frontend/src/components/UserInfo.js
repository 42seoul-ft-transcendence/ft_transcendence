// import Component from "/frontend/src/core/Component.js";
import Component from "../core/Component.js";
import { getTranslation } from "../utils/translations.js";

export default class UserInfo extends Component {
	template() {
		const { username, message, email } = this.props;

		return /* html */ `
        <!-- User Info Section -->
			<h2 class="section-title mb-3 fs-4">${getTranslation("userInfo")}</h2>
			<table class="table shadow">
				<tbody style="opacity: 0.8;">
					<tr>
						<th scope="row" class="text-start align-middle px-3">${getTranslation("email")}</th>
						<td class="d-flex justify-content-start align-items-center">
							${email}
						</td>
					</tr>
					<tr>
						<th scope="row" class="text-start align-middle px-3">${getTranslation("username")}</th>
						<td class="d-flex justify-content-start align-items-center">${username}</td>
					</tr>
					<tr>
						<th scope="row" class="text-start align-middle px-3">${getTranslation("message")}</th>
						<td>
							<div class="d-flex justify-content-start align-items-center">
								<div class="col-10">
  									<input type="text" id="messageInput" class="form-control" value="${message}">
								</div>
								<div class="col-3">
									<button id="saveButton" class="btn btn-outline-info ms-2">${getTranslation("save")}</button>
								</div>

							</div>
							<div id="errorMessage" class="text-danger mt-2" style="display: none;"></div>
						</td>
					</tr>
				</tbody>
			</table>
		`;
	}

	setEvent() {
		const { onMessageChange } = this.props;

		this.addEvent("click", "#saveButton", () => {
			const messageInput = this.$target.querySelector("#messageInput");
			const errorMessage = this.$target.querySelector("#errorMessage");

			if (messageInput.value.length > 18) {
				// 메시지가 너무 긴 경우
				errorMessage.style.display = "block"; // 에러 메시지 표시
				errorMessage.textContent = getTranslation("errorMessage");
			} else {
				// 메시지가 적절한 경우
				errorMessage.style.display = "none"; // 에러 메시지 숨김
				console.log("메시지가 저장되었습니다:", messageInput.value); // 메시지 저장 로직 추가
			}
		});
	}
}
