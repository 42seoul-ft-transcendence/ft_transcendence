import Component from "../core/Component.js";
import { apiCall } from "../utils/api.js";

export default class TwoFAView extends Component {
  setup() {
    this.state = {
      qrUrl: this.props.qr_url,
      username: this.props.username,
    };

    console.log("??");
  }

  template() {
    const { qrUrl } = this.state;

    return /*html*/ `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title">2FA</h5>
              </div>
              <div class="card-body text-center">
                ${
                  qrUrl
                    ? `<img src="data:image/png;base64,${qrUrl}" alt="QR Code" style="max-width: 200px; margin-bottom: 20px;">`
                    : `<p>Loading QR code...</p>`
                }
                <div class="mb-3">
                  <label for="twoFA" class="form-label">2FA Code</label>
                  <input type="text" class="form-control" id="twoFA" placeholder="Enter 2FA Code">
                </div>
                <button type="button" class="btn btn-primary" id="twoFABtn">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setEvent() {
    this.addEvent("click", "#twoFABtn", async () => {
      const twoFA = this.$target.querySelector("#twoFA").value;

      if (twoFA.length !== 6) {
        alert("Please enter 2FA code");
        return;
      }

      console.log(this.state.username);
      console.log(twoFA);
      try {
        const data = await apiCall(
          "/api/login/verify-2fa/",
          "post",
          JSON.stringify({
            username: this.state.username,
            otp_code: twoFA,
          }),
        );

        window.location.hash = "/";
      } catch (e) {}
    });
  }
}
