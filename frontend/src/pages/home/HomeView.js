import Component from "../../core/Component.js";
import Navbar from "../../components/Navbar.js";
import SelectMode from "../../components/SelectMode.js";

export default class Home extends Component {
  mounted() {
    new Navbar(this.addElement("div"));
    new SelectMode(this.addElement("div"));
  }
}
