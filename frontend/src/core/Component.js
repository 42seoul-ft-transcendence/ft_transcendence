/**
 * @brief 모든 컴포넌트의 기본 클래스
 */
export default class Component {
  $target;
  props;
  state;

  /**
   * @brief Component 생성자
   * @param {HTMLElement} $target - 컴포넌트가 렌더링될 대상 요소
   * @param {Object} props - 컴포넌트의 속성
   */
  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.render();
    this.setEvent();
  }

  /**
   * @brief 컴포넌트 초기 설정 함수
   */
  setup() {}

  /**
   * @brief 컴포넌트가 마운트된 후 호출되는 함수
   */
  mounted() {}

  /**
   * @brief 컴포넌트의 HTML 템플릿을 반환하는 함수
   * @return {string} HTML 템플릿 문자열
   */
  template() {
    return "";
  }

  /**
   * @brief 컴포넌트를 렌더링하는 함수
   */
  render() {
    if (!this.$target) return;
    this.$target.innerHTML = this.template();
    this.mounted();
  }

  /**
   * @brief 컴포넌트의 상태를 업데이트하고 다시 렌더링하는 함수
   * @param {Object} newState - 새로운 상태
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * @brief 이벤트를 설정하는 함수
   */
  setEvent() {}

  /**
   * @brief 이벤트를 추가하는 함수
   * @param {string} eventType - 이벤트 타입
   * @param {string} selector - 이벤트가 적용될 요소의 선택자
   * @param {Function} callback - 이벤트 핸들러 함수
   */
  addEvent(eventType, selector, callback) {
    const children = [...this.$target.querySelectorAll(selector)];
    const isTarget = (target) =>
      children.includes(target) || target.closest(selector);

    this.$target.addEventListener(eventType, (event) => {
      if (!isTarget(event.target)) return false;
      callback(event);
    });
  }

  /**
   * @brief 새로운 요소를 추가하는 함수
   * @param {string} selector - 추가할 요소의 태그 이름
   * @return {HTMLElement} 추가된 요소
   */
  addElement(selector) {
    const $elem = document.createElement(selector);

    this.$target.append($elem);
    return $elem;
  }

  /**
   * @brief 컴포넌트의 속성을 업데이트하고 다시 렌더링하는 함수
   * @param {Object} newProps - 새로운 속성
   */
  updateProps(newProps) {
    this.props = { ...this.props, ...newProps };
    this.render();
  }

  /**
   * @brief 컴포넌트를 초기화하는 함수
   * @param {Component} instance - 기존 컴포넌트 인스턴스
   * @param {Function} component - 컴포넌트 클래스
   * @param {string} selector - 컴포넌트가 렌더링될 요소의 선택자
   * @param {Object} props - 컴포넌트의 속성
   * @return {Component} 초기화된 컴포넌트 인스턴스
   */
  initComponent(instance, component, selector, props) {
    if (instance) {
      if (!shallowEqual(instance.props, props)) instance.updateProps(props);
    } else {
      instance = new component(document.querySelector(selector), props);
    }
    return instance;
  }
}

function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}
