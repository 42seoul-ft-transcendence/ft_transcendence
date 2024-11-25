export default class Component {
  $target;
  props;
  state;
  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {}
  mounted() {}

  template() {
    return "";
  }

  render() {
    if (!this.$target) return;
    this.$target.innerHTML = this.template();
    this.mounted();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  setEvent() {}

  addEvent(eventType, selector, callback) {
    const children = [...this.$target.querySelectorAll(selector)];
    const isTarget = (target) =>
      children.includes(target) || target.closest(selector);

    this.$target.removeEventListener(eventType, this.eventHandler);

    this.eventHandler = (event) => {
      if (!isTarget(event.target)) return false;
      callback(event);
    };
    this.$target.addEventListener(eventType, this.eventHandler);
  }

  addElement(selector) {
    const $elem = document.createElement(selector);

    this.$target.append($elem);
    return $elem;
  }

  updateProps(newProps) {
    this.props = { ...this.props, ...newProps };
    this.render();
  }
}
