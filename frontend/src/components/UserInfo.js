import Component from "/frontend/src/core/Component.js";

export default class UserInfo extends Component {
    template() {
        const { username, nickname, email } = this.props;

        return /* html */ `
        <!-- User Info Section -->
		<h2 class="section-title mb-3 fs-4">User Info</h2>
            <table class="table shadow">
                <tbody style="opacity: 0.8;">
                    <tr>
                        <th scope="row" class="text-start align-middle px-3">EMAIL</th>
                        <td class="d-flex justify-content-start align-items-center">
                            ${email}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="text-start align-middle px-3">USERNAME</th>
                        <td class="d-flex justify-content-start align-items-center">
                            ${username}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="text-start align-middle px-3">NICKNAME</th>
                        <td>
                            <div class="d-flex justify-content-start align-items-center">
                                <input type="text" class="form-control" value=${nickname}>
                                <button class="btn btn-outline-primary ms-2">save</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
		`;
    }
}
