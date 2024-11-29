import Component from '/frontend/src/core/Component.js';

export default class UserInfo extends Component {
	template() {
		return /* html */ `
        <!-- User Info Section -->
		<h2 class="section-title mb-3">User Info</h2>
            <table class="table">
                <tbody>
                    <tr>
                        <th scope="row" class="text-start align-middle">EMAIL</th>
                        <td class="d-flex justify-content-start align-items-center">
                            abc@abc.com
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="text-start align-middle">USERNAME</th>
                        <td class="d-flex justify-content-start align-items-center">
                            username
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="text-start align-middle">NICKNAME</th>
                        <td>
                            <div class="d-flex justify-content-start align-items-center">
                                <input type="text" class="form-control" value="nickname">
                                <button class="btn btn-outline-primary ms-2">Save</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>	
		`;
	}
}