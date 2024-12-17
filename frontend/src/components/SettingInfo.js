import Component from '/frontend/src/core/Component.js';

export default class SettingInfo extends Component {
    template() {
        return /* html */ `
		<h2 class="section-title mb-3 fs-4">Setting</h2>
            <table class="table shadow">
                <tbody style="opacity: 0.9;">
                    <!-- Language Row -->
                    <tr>
                        <th scope="row" class="text-start align-middle px-3">Language</th>
                        <td>
                            <select class="form-select">
                                <option value="korean" selected>🇰🇷 한국어</option>
                                <option value="english">🇺🇸 English</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="text-start align-middle px-3">Two-Factor Authentication</th>
                        <td class="d-flex justify-content-end align-items-center">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="2faSwitch"
                                    style="transform: scale(1.8);">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>		
		`;
    }
}