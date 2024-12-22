// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/core/Component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @brief 모든 컴포넌트의 기본 클래스
 */
var Component = exports.default = /*#__PURE__*/function () {
  /**
   * @brief Component 생성자
   * @param {HTMLElement} $target - 컴포넌트가 렌더링될 대상 요소
   * @param {Object} props - 컴포넌트의 속성
   */
  function Component($target, props) {
    _classCallCheck(this, Component);
    _defineProperty(this, "$target", void 0);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "state", void 0);
    this.$target = $target;
    this.props = props;
    this.setup();
    this.render();
    this.setEvent();
  }

  /**
   * @brief 컴포넌트 초기 설정 함수
   */
  return _createClass(Component, [{
    key: "setup",
    value: function setup() {}

    /**
     * @brief 컴포넌트가 마운트된 후 호출되는 함수
     */
  }, {
    key: "mounted",
    value: function mounted() {}

    /**
     * @brief 컴포넌트의 HTML 템플릿을 반환하는 함수
     * @return {string} HTML 템플릿 문자열
     */
  }, {
    key: "template",
    value: function template() {
      return "";
    }

    /**
     * @brief 컴포넌트를 렌더링하는 함수
     */
  }, {
    key: "render",
    value: function render() {
      if (!this.$target) return;
      this.$target.innerHTML = this.template();
      this.mounted();
    }

    /**
     * @brief 컴포넌트의 상태를 업데이트하고 다시 렌더링하는 함수
     * @param {Object} newState - 새로운 상태
     */
  }, {
    key: "setState",
    value: function setState(newState) {
      this.state = _objectSpread(_objectSpread({}, this.state), newState);
      this.render();
    }

    /**
     * @brief 이벤트를 설정하는 함수
     */
  }, {
    key: "setEvent",
    value: function setEvent() {}

    /**
     * @brief 이벤트를 추가하는 함수
     * @param {string} eventType - 이벤트 타입
     * @param {string} selector - 이벤트가 적용될 요소의 선택자
     * @param {Function} callback - 이벤트 핸들러 함수
     */
  }, {
    key: "addEvent",
    value: function addEvent(eventType, selector, callback) {
      if (this.$target === null) return;
      var children = _toConsumableArray(this.$target.querySelectorAll(selector));
      var isTarget = function isTarget(target) {
        return children.includes(target) || target.closest(selector);
      };
      this.$target.addEventListener(eventType, function (event) {
        if (!isTarget(event.target)) return false;
        callback(event);
      });
    }

    /**
     * @brief 새로운 요소를 추가하는 함수
     * @param {string} selector - 추가할 요소의 태그 이름
     * @return {HTMLElement} 추가된 요소
     */
  }, {
    key: "addElement",
    value: function addElement(selector) {
      var $elem = document.createElement(selector);
      this.$target.append($elem);
      return $elem;
    }

    /**
     * @brief 컴포넌트의 속성을 업데이트하고 다시 렌더링하는 함수
     * @param {Object} newProps - 새로운 속성
     */
  }, {
    key: "updateProps",
    value: function updateProps(newProps) {
      this.props = _objectSpread(_objectSpread({}, this.props), newProps);
      this.render();
    }

    // /**
    //  * @brief 컴포넌트를 초기화하는 함수
    //  * @param {Component} instance - 기존 컴포넌트 인스턴스
    //  * @param {Function} component - 컴포넌트 클래스
    //  * @param {string} selector - 컴포넌트가 렌더링될 요소의 선택자
    //  * @param {Object} props - 컴포넌트의 속성
    //  * @return {Component} 초기화된 컴포넌트 인스턴스
    //  */
    // initComponent(instance, component, selector, props) {
    //   if (instance) {
    //     if (!shallowEqual(instance.props, props)) instance.updateProps(props);
    //   } else {
    //     instance = new component(document.querySelector(selector), props);
    //   }
    //   return instance;
    // }
  }]);
}(); // function shallowEqual(obj1, obj2) {
//   if (obj1 === obj2) return true;
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);
//   if (keys1.length !== keys2.length) return false;
//   for (let key of keys1) {
//     if (obj1[key] !== obj2[key]) return false;
//   }
//   return true;
// }
},{}],"src/Router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("./core/Component.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Router = exports.default = /*#__PURE__*/function (_Component) {
  function Router() {
    _classCallCheck(this, Router);
    return _callSuper(this, Router, arguments);
  }
  _inherits(Router, _Component);
  return _createClass(Router, [{
    key: "setup",
    value: function setup() {
      this.state = {
        routes: []
      };
    }
  }, {
    key: "addRoute",
    value: function addRoute(fragment, component) {
      this.state.routes.push({
        fragment: fragment,
        component: component
      });
    }
  }, {
    key: "checkRoutes",
    value: function checkRoutes() {
      var currentRoute = this.state.routes.find(function (route) {
        return route.fragment === window.location.hash;
      });
      if (!currentRoute) {
        window.location.href = "#/";
        this.state.routes[0].component();
        return;
      }
      currentRoute.component();
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;
      window.onhashchange = function (event) {
        _this.checkRoutes();
      };
      if (!window.location.hash) {
        window.location.hash = "#/";
      }
      this.checkRoutes();
    }
  }]);
}(_Component2.default);
},{"./core/Component.js":"src/core/Component.js"}],"src/pages/LoginView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
var Login = exports.default = /*#__PURE__*/function (_Component) {
  function Login() {
    _classCallCheck(this, Login);
    return _callSuper(this, Login, arguments);
  }
  _inherits(Login, _Component);
  return _createClass(Login, [{
    key: "template",
    value: function template() {
      return /* html */"\n\t\t<div class=\"d-flex justify-content-center align-items-center vh-100\">\n\t\t\t<div class=\"container h-50 w-50 d-flex flex-column justify-content-center text-center bg-white rounded-4 shadow-lg\">\n\t\t\t\t<p class=\"h1 fw-bold\">LOGIN</p>\n\t\t\t\t<div class=\"mt-5\">\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-outline-primary py-2\">\n\t\t\t\t\t\t<img src=\"/frontend/src/utils/42logo.png\" alt=\"42Seoul Logo\" class=\"me-2\" style=\"width: 40px; height: 40px;\">\n\t\t\t\t\t\tLogin with 42Seoul\n\t\t\t\t\t</button>\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t";
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      this.addEvent("click", "button", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var response, data, test;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              console.log("42 login button clicked");
              _context.prev = 1;
              _context.next = 4;
              return fetch("http://localhost:8000/login/oauth/redirect/", {
                method: "GET" // 백엔드에서 OAuth 제공자와 통신
              });
            case 4:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 15;
                break;
              }
              _context.next = 8;
              return response.json();
            case 8:
              data = _context.sent;
              _context.next = 11;
              return fetch(data.redirect_url);
            case 11:
              test = _context.sent;
              if (response.ok) {
                console.log(response.json());
              }
              _context.next = 16;
              break;
            case 15:
              console.error("OAuth Failed:", response.status);
            case 16:
              _context.next = 21;
              break;
            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](1);
              console.error("Error during OAuth:", _context.t0);
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 18]]);
      })));

      // window.addEventListener("load", async () => {
      //   const params = new URLSearchParams(window.location.search);
      //   const authorizationCode = params.get("code");
      //   const state = params.get("state");

      //   if (authorizationCode && state === sessionStorage.getItem("oauthState")) {
      //     try {
      //       const tokenResponse = await fetch(
      //         `/oauth/callback?code=${authorizationCode}`,
      //       );
      //       if (tokenResponse.ok) {
      //         const tokenData = await tokenResponse.json();
      //         console.log("Access Token:", tokenData.access_token);
      //         sessionStorage.setItem("accessToken", tokenData.access_token);
      //       } else {
      //         console.error(
      //           "Failed to obtain access token:",
      //           tokenResponse.status,
      //         );
      //       }
      //     } catch (error) {
      //       console.error("Error during token exchange:", error);
      //     }
      //   } else {
      //     console.error("Authorization code or state token not found or invalid");
      //   }
      // });
    }
  }]);
}(_Component2.default); // window.onload = function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const accessToken = getCookie("access_token");
//   const refreshToken = getCookie("refresh_token");
//   if (accessToken && refreshToken) {
//     console.log("Access Token:", accessToken);
//     console.log("Refresh Token:", refreshToken);
//     // 필요한 추가 작업 수행
//   }
// };
},{"../core/Component.js":"src/core/Component.js"}],"src/utils/translations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translations = exports.getTranslation = void 0;
var _english, _korean, _japanese;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var translations = exports.translations = {
  english: (_english = {
    player: "Player",
    edit: "Edit",
    language: "Language",
    userInfo: "User Info",
    logout: "Logout",
    setting: "Setting",
    history: "History",
    friends: "Friends",
    email: "Email",
    username: "Username",
    message: "Message",
    save: "Save"
  }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_english, "language", "Language"), "oneVsOne", "1 vs 1"), "tournament", "Tournament"), "next", "Next"), "start", "Start"), "startGame", "Start Game"), "win", "WIN"), "twoFactor", "Two-Factor Authentication"), "tournamentDescription", "How many people do you want to play?"), "nickModalDescription", "Please enter your nickname"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_english, "enterNick", "Enter Nickname"), "nickDuplicate", "Nickname already exists"), "nickEmpty", "Nickname cannot be empty"), "gameStart", "Start Game"), "nextGame", "Next Game"), "friendList", "Friend List"), "errorMessage", "Message is too long")),
  korean: (_korean = {
    player: "플레이어",
    edit: "편집",
    language: "언어",
    userInfo: "사용자 정보",
    logout: "로그아웃",
    setting: "설정",
    history: "히스토리",
    friends: "친구",
    email: "이메일",
    username: "사용자 이름",
    message: "상태 메세지",
    save: "저장"
  }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_korean, "language", "언어"), "oneVsOne", "1 대 1"), "tournament", "토너먼트"), "next", "다음"), "start", "시작"), "startGame", "게임 시작"), "win", "승리"), "twoFactor", "이중 인증"), "tournamentDescription", "몇 명이서 게임을 하고 싶으신가요?"), "nickModalDescription", "닉네임을 입력해주세요"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_korean, "enterNick", "닉네임 입력"), "nickDuplicate", "닉네임이 이미 존재합니다"), "nickEmpty", "닉네임을 입력해주세요"), "gameStart", "게임 시작"), "nextGame", "다음 게임"), "friendList", "친구 목록"), "errorMessage", "메세지가 너무 깁니다")),
  japanese: (_japanese = {
    player: "プレイヤー",
    edit: "編集",
    language: "言語",
    userInfo: "ユーザー情報",
    logout: "ログアウト",
    setting: "設定",
    history: "履歴",
    friends: "友達",
    email: "メール",
    username: "ユーザー名",
    message: "メッセージ",
    save: "保存"
  }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_japanese, "language", "言語"), "oneVsOne", "1 対 1"), "tournament", "トーナメント"), "next", "次へ"), "start", "スタート"), "startGame", "ゲームを開始"), "win", "勝利"), "twoFactor", "二要素認証"), "tournamentDescription", "何人でゲームをしたいですか？"), "nickModalDescription", "ニックネームを入力してください"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_japanese, "enterNick", "ニックネームを入力"), "nickDuplicate", "ニックネームは既に存在します"), "nickEmpty", "ニックネームを入力してください"), "gameStart", "ゲームを開始"), "nextGame", "次のゲーム"), "friendList", "友達リスト"), "errorMessage", "メッセージが長すぎます"))
};
var getTranslation = exports.getTranslation = function getTranslation(key) {
  var _translations$lang;
  var lang = localStorage.getItem("lang") || "english";
  return ((_translations$lang = translations[lang]) === null || _translations$lang === void 0 ? void 0 : _translations$lang[key]) || key;
};
},{}],"src/components/SelectMode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _translations = require("../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Pong = exports.default = /*#__PURE__*/function (_Component) {
  function Pong() {
    _classCallCheck(this, Pong);
    return _callSuper(this, Pong, arguments);
  }
  _inherits(Pong, _Component);
  return _createClass(Pong, [{
    key: "template",
    value: function template() {
      return /* html */"\n\t\t\t<div class=\"game-screen d-flex flex-column justify-content-center align-items-center gap-3 p-4\">\n\t\t\t\t<button id=\"oneToOneBtn\" class=\"btn btn-light fw-bold fs-3 py-3 w-75 border-info border-4\">1 vs 1</button>\n\t\t\t\t<button id=\"tournamentBtn\" class=\"btn btn-light fw-bold fs-3 py-3 w-75 border-info border-4\"\n\t\t\t\t data-bs-toggle=\"modal\" data-bs-target=\"#tournamentModal\">".concat((0, _translations.getTranslation)("tournament"), "</button>\n\t\t\t</div>\n\t\t");
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/translations.js":"src/utils/translations.js"}],"src/utils/game/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = exports.Board = exports.Ball = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Player = exports.Player = /*#__PURE__*/function () {
  function Player(x, y, board) {
    _classCallCheck(this, Player);
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 50;
    this.velocityY = 0;
    this.board = board;
  }
  return _createClass(Player, [{
    key: "draw",
    value: function draw() {
      var context = this.board.context;
      context.fillStyle = "skyblue";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "update",
    value: function update() {
      var nextPlayerY = this.y + this.velocityY;
      if (!(nextPlayerY < 0 || nextPlayerY + this.height > this.board.height)) this.y += this.velocityY;
    }
  }]);
}();
var Ball = exports.Ball = /*#__PURE__*/function () {
  function Ball(x, y, width, height, velocity, board) {
    _classCallCheck(this, Ball);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.velocityX = (Math.random() > 0.5 ? 1 : -1) * velocity; // 속도는 동일, 방향만 랜덤
    this.velocityY = (Math.random() > 0.5 ? 1 : -1) * velocity; // 속도는 동일, 방향만 랜
    this.board = board;
    this.isResetting = false;
  }
  return _createClass(Ball, [{
    key: "init",
    value: function init() {
      try {
        this.x = board.width / 2;
        this.y = board.height / 2;
        this.velocityX = (Math.random() > 0.5 ? 1 : -1) * this.velocity; // 속도는 동일, 방향만 랜덤
        this.velocityY = (Math.random() > 0.5 ? 1 : -1) * this.velocity; // 속도는 동일, 방향만 랜
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var context = this.board.context;
      context.fillStyle = "white";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "update",
    value: function update(player1, player2) {
      this.x += this.velocityX;
      this.y += this.velocityY;
      if (this.y <= 0 || this.y + this.height >= this.board.height) {
        this.velocityY *= -1; //reverse direction
      }
      if (detectCollision(this, player1)) {
        if (this.x <= player1.x + player1.width) this.velocityX *= -1;
      } else if (detectCollision(this, player2)) {
        if (this.x + this.width >= player2.x) this.velocityX *= -1;
      }
    }
  }]);
}();
var Board = exports.Board = /*#__PURE__*/function () {
  function Board(width, height) {
    _classCallCheck(this, Board);
    this.width = width;
    this.height = height;
    this.context = null;
  }
  return _createClass(Board, [{
    key: "init",
    value: function init() {
      var board = document.getElementById("board");
      board.height = this.height;
      board.width = this.width;
      this.context = board.getContext("2d");
    }
  }, {
    key: "draw",
    value: function draw(player1Score, player2Score) {
      this.context.fillStyle = "white";
      this.context.font = "45px sans-serif";
      this.context.fillText(player1Score, this.width / 5 + 10, 45);
      this.context.fillText(player2Score, this.width * 4 / 5 - 45, 45);
      this.context.fillStyle = "skyblue";
      for (var i = 10; i < this.height; i += 25) this.context.fillRect(this.width / 2, i, 5, 5);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }]);
}();
var detectCollision = function detectCollision(ball, player) {
  return ball.x < player.x + player.width &&
  //a's top left corner doesn't reach b's top right corner
  ball.x + ball.width > player.x &&
  //a's top right corner passes b's top left corner
  ball.y < player.y + player.height &&
  //a's top left corner doesn't reach b's bottom left corner
  ball.y + ball.height > player.y; //a's bottom left corner passes b's top left corner
};
},{}],"src/components/Pong.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var game = _interopRequireWildcard(require("../utils/game/game.js"));
var _translations = require("../utils/translations.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Pong = exports.default = /*#__PURE__*/function (_Component) {
  function Pong() {
    _classCallCheck(this, Pong);
    return _callSuper(this, Pong, arguments);
  }
  _inherits(Pong, _Component);
  return _createClass(Pong, [{
    key: "setup",
    value: function setup() {
      var board = new game.Board(700, 500);
      this.state = {
        player1Score: 0,
        player2Score: 0,
        board: board,
        player1: new game.Player(10, board.height / 2, board),
        player2: new game.Player(board.width - 20, board.height / 2, board),
        ball: new game.Ball(board.width / 2, board.height / 2, 10, 10, 3, board),
        animationFrameId: null,
        opponent1: this.props.opponent1,
        opponent2: this.props.opponent2,
        finish: false
      };
      if (!this.props.opponent1 && !this.props.opponent2) window.location.hash = "#/";
    }
  }, {
    key: "template",
    value: function template() {
      var _this$state = this.state,
        opponent1 = _this$state.opponent1,
        opponent2 = _this$state.opponent2;
      return /* html */"\n      <div class=\"canvas-container position-relative\">\n        <canvas id=\"board\"></canvas>\n        <div id=\"gameCtn\" class=\"border bg-dark\"></div>\n        <div class=\"container-fluid position-absolute bottom-0 px-5\">\n          <div class=\"row w-100\">\n            <div class=\"col text-start\">\n              <span id=\"nickname-left\" class=\"nickName fs-1 fw-bold\" style=\"".concat(!opponent1 ? "display:none;" : "", "\">").concat((opponent1 === null || opponent1 === void 0 ? void 0 : opponent1.name) || "", "</span>\n            </div>\n            <div class=\"col text-end\">\n              <span id=\"nickname-right\" class=\"nickName fs-1 fw-bold\" style=\"").concat(!opponent2 ? "display:none;" : "", "\">").concat((opponent2 === null || opponent2 === void 0 ? void 0 : opponent2.name) || "", "</span>\n            </div>\n          </div>\n        </div>\n        <button id=\"nextBtn\" class=\"btn btn-light fw-bold fs-3 py-3 border-info border-4 d-none\">\n         ").concat((0, _translations.getTranslation)("nextGame"), "\n        </button>\n      </div>\n  \n    ");
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var _this$state2 = this.state,
        board = _this$state2.board,
        player1 = _this$state2.player1,
        player2 = _this$state2.player2,
        player1Score = _this$state2.player1Score,
        player2Score = _this$state2.player2Score,
        finish = _this$state2.finish;
      board.init();
      player1.draw();
      player2.draw();
      board.draw(player1Score, player2Score);
      if (this.props.gameMode != "" && !finish) {
        if (this.props.opponent2.id == null) this.state.player1Score = 3;
        this.state.animationFrameId = requestAnimationFrame(this.update.bind(this));
      }
    }
  }, {
    key: "update",
    value: function update() {
      var _this$state3 = this.state,
        board = _this$state3.board,
        player1 = _this$state3.player1,
        player2 = _this$state3.player2,
        ball = _this$state3.ball,
        finish = _this$state3.finish;
      if (finish) return;
      board.clear();
      board.draw(this.state.player1Score, this.state.player2Score);
      player1.update();
      player1.draw();
      player2.update();
      player2.draw();
      if (this.state.player1Score == 3 || this.state.player2Score == 3) {
        var winWidth;
        if (this.state.animationFrameId) {
          var _this$state4 = this.state,
            opponent1 = _this$state4.opponent1,
            opponent2 = _this$state4.opponent2;
          this.state.finish = true;
          if (this.state.player1Score == 3) {
            winWidth = board.width / 5 - 20;
            // opponent1["result"] = "win";
            // opponent2["result"] = "loss";
          } else {
            winWidth = board.width * 4 / 5 - 60;
            // opponent2["result"] = "win";
            // opponent1["result"] = "loss";
          }
          board.context.fillStyle = "White";
          board.context.fillText("WIN", winWidth, 125);
          cancelAnimationFrame(this.state.animationFrameId);
          // opponent1["score"] = this.state.player1Score;
          // opponent2["score"] = this.state.player2Score;

          this.$target.querySelector("#nextBtn").classList.remove("d-none");
          return;
        }
      }
      ball.update(player1, player2);
      ball.draw();
      if (ball.x < 0) {
        ball.init();
        this.state.player2Score++;
      } else if (ball.x + ball.width > board.width) {
        ball.init();
        this.state.player1Score++;
      }
      this.state.animationFrameId = requestAnimationFrame(this.update.bind(this));
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      var _this = this;
      document.addEventListener("keydown", function (e) {
        if (e.code == "KeyW") _this.state.player1.velocityY = -3;else if (e.code == "KeyS") _this.state.player1.velocityY = 3;
        if (e.code == "ArrowUp") _this.state.player2.velocityY = -3;else if (e.code == "ArrowDown") _this.state.player2.velocityY = 3;
      });
      this.addEvent("click", "#nextBtn", function () {
        var _this$state5 = _this.state,
          opponent1 = _this$state5.opponent1,
          opponent2 = _this$state5.opponent2,
          player1Score = _this$state5.player1Score,
          player2Score = _this$state5.player2Score;
        if (player1Score == 3) {
          opponent1["result"] = "win";
          opponent2["result"] = "loss";
        } else {
          opponent2["result"] = "win";
          opponent1["result"] = "loss";
        }
        opponent1["score"] = player1Score;
        opponent2["score"] = player2Score;
        _this.props.handlePongNextGameClick(opponent1, opponent2);
        window.location.hash = "#/tournament";
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/game/game.js":"src/utils/game/game.js","../utils/translations.js":"src/utils/translations.js"}],"src/components/TournamentModal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _translations = require("../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var TournamentModal = exports.default = /*#__PURE__*/function (_Component) {
  function TournamentModal() {
    _classCallCheck(this, TournamentModal);
    return _callSuper(this, TournamentModal, arguments);
  }
  _inherits(TournamentModal, _Component);
  return _createClass(TournamentModal, [{
    key: "setup",
    value: function setup() {
      this.$target.classList = "modal fade";
      this.$target.setAttribute("tabindex", "-1");
      this.$target.setAttribute("aria-labelledby", "tournamentModalLabel");
      this.$target.setAttribute("aria-hidden", "true");
      this.$target.setAttribute("data-bs-backdrop", "static");
      this.$target.setAttribute("data-bs-keyboard", "false");
    }
  }, {
    key: "template",
    value: function template() {
      return /* html */"\n\t\t\t<div class=\"modal-dialog modal-dialog-centered\">\n\t\t\t\t<div class=\"modal-content\">\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t\t<h5 class=\"modal-title\" id=\"tournamentModalLabel\">".concat((0, _translations.getTranslation)("tournament"), "</h5>\n\t\t\t\t\t\t<button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"modal-body\">\n\t\t\t\t\t\t<p>").concat((0, _translations.getTranslation)("tournamentDescription"), "</p>\n\t\t\t\t\t\t<select id=\"playerCount\" class=\"form-select w-50 mx-auto\">\n\t\t\t\t\t\t\t<option value=\"3\">3</option>\n\t\t\t\t\t\t\t<option value=\"4\">4</option>\n\t\t\t\t\t\t\t<option value=\"5\">5</option>\n\t\t\t\t\t\t\t<option value=\"6\">6</option>\n\t\t\t\t\t\t\t<option value=\"7\">7</option>\n\t\t\t\t\t\t\t<option value=\"8\">8</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"modal-footer\">\n\t\t\t\t\t\t<button id=\"nextButton\" class=\"btn btn-outline-info\" data-bs-target=\"#nicknameModal\" data-bs-toggle=\"modal\">").concat((0, _translations.getTranslation)("next"), "</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      var _this = this;
      this.addEvent("click", "#nextButton", function () {
        var totalNum = parseInt(_this.$target.querySelector("#playerCount").value);
        _this.props.handleTotalPlayerClick(totalNum);
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/translations.js":"src/utils/translations.js"}],"src/components/NickModal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _translations = require("../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var NickModal = exports.default = /*#__PURE__*/function (_Component) {
  function NickModal() {
    _classCallCheck(this, NickModal);
    return _callSuper(this, NickModal, arguments);
  }
  _inherits(NickModal, _Component);
  return _createClass(NickModal, [{
    key: "setup",
    value: function setup() {
      this.$target.classList = "modal fade";
      this.$target.setAttribute("tabindex", "-1");
      this.$target.setAttribute("aria-labelledby", "nicknameModalLabel");
      this.$target.setAttribute("aria-hidden", "true");
      this.$target.setAttribute("data-bs-backdrop", "static");
      this.$target.setAttribute("data-bs-keyboard", "false");
      this.state = {
        playerName: [],
        currentPlayer: 1
      };
    }
  }, {
    key: "template",
    value: function template() {
      var currentPlayer = this.state.currentPlayer;
      var totalPlayer = this.props.totalPlayer;
      return /* html */"\n\t\t\t<div class=\"modal-dialog modal-dialog-centered\">\n\t\t\t\t<div class=\"modal-content\">\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t\t<h5 class=\"modal-title\" id=\"nicknameModalLabel\">".concat((0, _translations.getTranslation)("nickModalDescription"), "</h5>\n\t\t\t\t\t\t<button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"modal-body\">\n\t\t\t\t\t\t<p>").concat((0, _translations.getTranslation)("player"), " ").concat(currentPlayer, " ").concat((0, _translations.getTranslation)("nickname"), "</p>\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control w-75 mx-auto\" id=\"playerNicknameInput\" placeholder=\"").concat((0, _translations.getTranslation)("enterNick"), "\">\n\t\t\t\t\t\t<div id=\"errorMessage\" class=\"text-danger mt-2\" style=\"display: none;\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"modal-footer\">\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-outline-info\" id=\"nextPlayerButton\">\n              ").concat(currentPlayer == totalPlayer ? (0, _translations.getTranslation)("start") : (0, _translations.getTranslation)("next"), "\n            </button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    }
  }, {
    key: "mounted",
    value: function mounted() {
      this.$target.querySelector("#nextPlayerButton").onclick = this.handleNextPlayerButtonClick.bind(this);
    }
  }, {
    key: "handleNextPlayerButtonClick",
    value: function handleNextPlayerButtonClick() {
      var _this$state = this.state,
        currentPlayer = _this$state.currentPlayer,
        playerName = _this$state.playerName;
      var totalPlayer = this.props.totalPlayer;
      var $nicknameInput = this.$target.querySelector("#playerNicknameInput");
      var nickname = $nicknameInput.value.trim();
      var $error = this.$target.querySelector("#errorMessage");
      if (nickname == "") {
        $nicknameInput.classList.add("is-invalid");
        $error.style.display = "block";
        $error.textContent = (0, _translations.getTranslation)("nickEmpty");
      } else if (this.validateNickName(nickname)) {
        $nicknameInput.classList.add("is-invalid");
        $error.style.display = "block";
        $error.textContent = (0, _translations.getTranslation)("nickDuplicate");
      } else if (currentPlayer < totalPlayer) {
        currentPlayer++;
        playerName.push(nickname);
        this.setState({
          currentPlayer: currentPlayer,
          playerName: playerName
        });
      } else if (currentPlayer == totalPlayer) {
        playerName.push(nickname);
        this.props.handleNickModalClick(playerName);
        bootstrap.Modal.getOrCreateInstance(this.$target).hide();
        this.$target.remove();
        window.location.hash = "#/tournament";
      }
    }
  }, {
    key: "validateNickName",
    value: function validateNickName(name) {
      return this.state.playerName.some(function (existingName) {
        return existingName === name;
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/translations.js":"src/utils/translations.js"}],"src/pages/HomeView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _SelectMode = _interopRequireDefault(require("../components/SelectMode.js"));
var _Pong = _interopRequireDefault(require("../components/Pong.js"));
var _TournamentModal = _interopRequireDefault(require("../components/TournamentModal.js"));
var _NickModal = _interopRequireDefault(require("../components/NickModal.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Home = exports.default = /*#__PURE__*/function (_Component) {
  function Home() {
    _classCallCheck(this, Home);
    return _callSuper(this, Home, arguments);
  }
  _inherits(Home, _Component);
  return _createClass(Home, [{
    key: "setup",
    value: function setup() {
      this.state = {
        totalPlayer: 0,
        userName: []
      };
      if (this.$nickModal = document.querySelector("#nicknameModal")) this.$nickModal.remove();
      if (this.$tournamentModal = document.querySelector("#tournamentModal")) this.$tournamentModal.remove();
      this.$tournamentModal = document.createElement("div");
      this.$tournamentModal.setAttribute("id", "tournamentModal");
      this.$nickModal = document.createElement("div");
      this.$nickModal.setAttribute("id", "nicknameModal");
      document.body.append(this.$nickModal, this.$tournamentModal);
    }
  }, {
    key: "template",
    value: function template() {
      return /* html */"\n      <div id='bodyCtn' class=\"vh-100 d-flex align-items-center justify-content-center\">\n        <div id=\"boardCtn\"></div>\n        <div id=\"selectModeCtn\" class=\"position-absolute top-50 start-50 translate-middle\" ></div>\n      </div>\n    ";
    }
  }, {
    key: "mounted",
    value: function mounted() {
      new _Pong.default(document.querySelector("#boardCtn"), {
        gameMode: ""
      });
      new _SelectMode.default(document.querySelector("#selectModeCtn"));
      new _TournamentModal.default(document.querySelector("#tournamentModal"), {
        handleTotalPlayerClick: this.handleTotalPlayerClick.bind(this)
      });
      new _NickModal.default(document.querySelector("#nicknameModal"), {
        totalPlayer: this.state.totalPlayer,
        handleNickModalClick: this.props.handleNickModalClick
      });
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      this.addEvent("click", "#oneToOne", this.handleOneToOneClick.bind(this));
    }
  }, {
    key: "handleOneToOneClick",
    value: function handleOneToOneClick() {
      window.location.hash = "#/game";
    }
  }, {
    key: "handleTotalPlayerClick",
    value: function handleTotalPlayerClick(number) {
      this.setState({
        totalPlayer: number,
        userName: []
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../components/SelectMode.js":"src/components/SelectMode.js","../components/Pong.js":"src/components/Pong.js","../components/TournamentModal.js":"src/components/TournamentModal.js","../components/NickModal.js":"src/components/NickModal.js"}],"src/pages/GameView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _Pong = _interopRequireDefault(require("../components/Pong.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
// import Pong from "/frontend/src/components/Pong.js";
var Game = exports.default = /*#__PURE__*/function (_Component) {
  function Game() {
    _classCallCheck(this, Game);
    return _callSuper(this, Game, arguments);
  }
  _inherits(Game, _Component);
  return _createClass(Game, [{
    key: "template",
    value: function template() {
      return /* html */"\n    <div class=\"vh-100 d-flex align-items-center justify-content-center\">\n      <div id=\"gameCtn\"></div>\n    </div>\n\t\t";
    }
  }, {
    key: "mounted",
    value: function mounted() {
      // this.pongInstance = this.initComponent(
      //   this.pongInstance,
      //   Pong,
      //   "#gameCtn",
      //   {
      //     isGameMode: true,
      //     ...this.props,
      //   },
      // );
      new _Pong.default(this.$target.querySelector("#gameCtn"), _objectSpread({
        isGameMode: true
      }, this.props));
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../components/Pong.js":"src/components/Pong.js"}],"src/utils/tournament.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stage = exports.shuffleArray = exports.insertParticipant = exports.generateParticipantJson = exports.generateMatchJson = void 0;
var stage = exports.stage = [{
  id: 0,
  tournament_id: 0,
  name: "Tournament",
  type: "single_elimination",
  number: 1,
  settings: {}
}];
var shuffleArray = exports.shuffleArray = function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [array[j], array[i]];
    array[i] = _ref[0];
    array[j] = _ref[1];
  }
  return array;
};
var generateParticipantJson = exports.generateParticipantJson = function generateParticipantJson(playerName) {
  return playerName.map(function (name, index) {
    return {
      id: index,
      name: name,
      tournament_id: 0
    };
  });
};
var generateMatchJson = exports.generateMatchJson = function generateMatchJson(participantJson) {
  var tournaments = [];
  var round_id = 0;
  var id = 0; // 각 경기의 고유 ID
  var totalPlayer = participantJson.length;
  while (totalPlayer > 1) {
    var matches = Math.floor(totalPlayer / 2); // 현재 라운드 경기 수
    var isBye = totalPlayer % 2 === 1; // 부전승 여부
    var matchCount = isBye ? matches + 1 : matches; // 부전승 포함한 경기 수
    // let matchCount = matches;

    for (var number = 1; number <= matchCount; number++) {
      tournaments.push({
        id: id++,
        number: number,
        stage_id: 0,
        group_id: 0,
        round_id: round_id,
        child_count: 0,
        status: 0,
        opponent1: {
          id: null,
          position: number * 2 - 1
        },
        opponent2: {
          id: null,
          position: number * 2
        },
        empty: true
      });
    }
    round_id++; // 다음 라운드로 이동
    totalPlayer = matches + (isBye ? 1 : 0); // 부전승 포함한 다음 라운드 참가자 수
  }
  return tournaments;
};
var insertParticipant = exports.insertParticipant = function insertParticipant(matchJson, participantJson) {
  var matchCount = Math.floor(participantJson.length / 2);
  var i;
  for (i = 0; i < matchCount; i++) {
    matchJson[i].opponent1.id = 2 * i;
    matchJson[i].opponent1.name = participantJson[2 * i].name;
    matchJson[i].opponent1.position = 2 * i + 1;
    matchJson[i].opponent2.id = 2 * i + 1;
    matchJson[i].opponent1.name = participantJson[2 * i + 1].name;
    matchJson[i].opponent2.position = 2 * i + 2;
    matchJson[i].empty = false;
  }
  if (participantJson.length % 2 != 0) {
    matchJson[matchCount].opponent1.id = 2 * i;
    matchJson[matchCount].opponent1["result"] = "win";
    matchJson[matchCount].empty = false;
  }
};
},{}],"src/pages/TournamentView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var brackets = _interopRequireWildcard(require("../utils/tournament.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
// import * as brackets from "/frontend/src/utils/tournament.js";
var Tournament = exports.default = /*#__PURE__*/function (_Component) {
  function Tournament() {
    _classCallCheck(this, Tournament);
    return _callSuper(this, Tournament, arguments);
  }
  _inherits(Tournament, _Component);
  return _createClass(Tournament, [{
    key: "setup",
    value: function setup() {
      this.state = {
        playNames: this.props.playerNames,
        participants: this.props.participants,
        matches: this.props.matches,
        currentMatch: 0
      };
    }
  }, {
    key: "template",
    value: function template() {
      return /* html */"\n    <div class=\"bracket-wrapper\">\n  \t\t<div id=\"brackets\" class=\"container brackets-viewer\"></div>\n      <div id=\"gameStartBtn\">\n      <button id=\"gameStartBtn\" class=\"btn btn-info mt-3 btn-lg\">Game Start</button>\n      </div>\n    </div>\n  \t";
    }
  }, {
    key: "mounted",
    value: function () {
      var _mounted = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this$state, participants, matches;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this$state = this.state, participants = _this$state.participants, matches = _this$state.matches;
              _context.prev = 1;
              _context.next = 4;
              return window.bracketsViewer.render({
                stages: brackets.stage,
                matches: matches,
                matchGames: [],
                participants: participants
              });
            case 4:
              _context.next = 9;
              break;
            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);
              console.log(_context.t0);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[1, 6]]);
      }));
      function mounted() {
        return _mounted.apply(this, arguments);
      }
      return mounted;
    }()
  }, {
    key: "setEvent",
    value: function setEvent() {
      var _this = this;
      this.addEvent("click", "#gameStartBtn", function () {
        var startMatchIdx = _this.state.matches.findIndex(function (match) {
          return (!("result" in match.opponent1) || !("result" in match.opponent2)) && !match.empty;
        });
        if (startMatchIdx !== -1) {
          var startMatch = _this.state.matches[startMatchIdx];
          _this.props.handleTournamentGameStartClick(startMatch, startMatchIdx);
          window.location.hash = "#/game";
        } else {
          window.location.hash = "#/";
        }
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/tournament.js":"src/utils/tournament.js"}],"src/components/Navbar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Navbar = exports.default = /*#__PURE__*/function (_Component) {
  function Navbar() {
    _classCallCheck(this, Navbar);
    return _callSuper(this, Navbar, arguments);
  }
  _inherits(Navbar, _Component);
  return _createClass(Navbar, [{
    key: "template",
    value: function template() {
      var profileImage = this.props.profileImage;
      return /* html */"\n\t\t\t<nav class=\"pong-nav navbar navbar-expand bg-warning navbar-dark px-4 py-3\">\n\t\t\t\t<div class=\"container-fluid\">\n\t\t\t\t\t<a class=\"navbar-brand fw-bold\" href=\"#/\">PONG!</a>\n\t\t\t\t\t<ul class=\"navbar-nav ms-auto\">\n\t\t\t\t\t\t<li class=\"nav-item\">\n\t\t\t\t\t\t\t<div class=\"icon\" id=\"profileIcon\">\n\t\t\t\t\t\t\t\t<img src=".concat(profileImage, " alt=\"Profile Image\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</nav>\n\t\t");
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      this.addEvent('click', '#profileIcon', function () {
        return window.location.href = '#/profile/history';
      });
      // this.addEvent("click", "#profileIcon", () =>
      //   window.history.pushState({ isManual: true }, "", "/profile/history"),
      // );
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js"}],"src/components/ProfileNav.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _translations = require("../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var ProfileNav = exports.default = /*#__PURE__*/function (_Component) {
  function ProfileNav() {
    _classCallCheck(this, ProfileNav);
    return _callSuper(this, ProfileNav, arguments);
  }
  _inherits(ProfileNav, _Component);
  return _createClass(ProfileNav, [{
    key: "template",
    value: function template() {
      return /* html */"\n          <!-- Internal Navigation -->        \n            <ul class=\"nav nav-underline\">\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" data-name=\"history\">".concat((0, _translations.getTranslation)("history"), "</a>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" data-name=\"friends\">").concat((0, _translations.getTranslation)("friends"), "</a>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" data-name=\"setting\">").concat((0, _translations.getTranslation)("setting"), "</a>\n                </li>\n            </ul>\n        ");
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var hash = window.location.hash || "#/profile/history"; // 기본값 설정
      var navLinks = this.$target.querySelectorAll(".nav-link");
      navLinks.forEach(function (link) {
        var targetHash = "#/profile/" + link.dataset.name;
        if (targetHash === hash) link.classList.add("active");else link.classList.remove("active");
      });
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      this.addEvent("click", ".nav-item", function (event) {
        event.preventDefault();
        window.location.hash = "#/profile/" + event.target.dataset.name;
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/translations.js":"src/utils/translations.js"}],"src/components/HistoryCard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var HistoryCard = exports.default = /*#__PURE__*/function (_Component) {
  function HistoryCard() {
    _classCallCheck(this, HistoryCard);
    return _callSuper(this, HistoryCard, arguments);
  }
  _inherits(HistoryCard, _Component);
  return _createClass(HistoryCard, [{
    key: "template",
    value: function template() {
      var _this$props = this.props,
        me = _this$props.me,
        oppenent = _this$props.oppenent,
        date = _this$props.date;
      return /* html */"\n        <!-- Match History Section -->\n        <div class=\"match-card ".concat(this.isWinner(me, oppenent), "\">\n            <div class=\"d-flex justify-content-between align-items-center mb-2\">\n                <div class=\"d-flex align-items-center\">\n                    <div>\n                        <img class=\"player-profile me-2\" src=").concat(me.profileImage, " alt=\"Profile Picture\">\n                    </div>\n                    <span>").concat(me.name, "</span>\n                </div>\n                <div class=\"d-flex align-items-center\">\n                    <span>").concat(oppenent.name, "</span>\n                    <div>\n                        <img class=\"player-profile ms-2\" src=").concat(oppenent.profileImage, " alt=\"Profile Picture\">\n                    </div>\n                </div>\n            </div>\n            <!-- Centered Score -->\n            <div class=\"score-container\">\n                <div class=\"score\">").concat(me.score, " - ").concat(oppenent.score, "</div>\n            </div>\n            <div class=\"d-flex justify-content-end\">\n                <div class=\"date\">").concat(date, "</div>\n            </div>\n        </div>\n        ");
    }
  }, {
    key: "isWinner",
    value: function isWinner(me, oppenent) {
      return me.score > oppenent.score ? "blue" : "pink";
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js"}],"src/pages/profile/HistoryView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../../core/Component.js"));
var _ProfileNav = _interopRequireDefault(require("../../components/ProfileNav.js"));
var _HistoryCard = _interopRequireDefault(require("../../components/HistoryCard.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import HistoryCard from "/frontend/src/components/HistoryCard.js";
var test = [{
  me: {
    name: "You",
    score: 3,
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150"
  },
  oppenent: {
    name: "are",
    score: 1,
    profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150"
  },
  date: "2024/12/07"
}, {
  me: {
    name: "good",
    score: 2,
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150"
  },
  oppenent: {
    name: "gril",
    score: 3,
    profileImage: "https://api.dicebear.com/7.x/pixel-art/svg?seed=JohnDoe"
  },
  date: "2024/12/17"
}, {
  me: {
    name: "Youasdf",
    score: 1,
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150"
  },
  oppenent: {
    name: "Yosadfdsgu",
    score: 3,
    profileImage: "https://picsum.photos/150"
  },
  date: "2024/10/17"
}, {
  me: {
    name: "u111",
    score: 3,
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150"
  },
  oppenent: {
    name: "You123",
    score: 0,
    profileImage: "https://picsum.photos/150"
  },
  date: "2024/11/17"
}];
var data = {
  users: [{
    id: 1,
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    nickname: "Champion01",
    username: "john_doe",
    winLossRecord: {
      wins: 10,
      losses: 3
    }
  }]
};
var HistoryView = exports.default = /*#__PURE__*/function (_Component) {
  function HistoryView() {
    _classCallCheck(this, HistoryView);
    return _callSuper(this, HistoryView, arguments);
  }
  _inherits(HistoryView, _Component);
  return _createClass(HistoryView, [{
    key: "setup",
    value: function setup() {
      this.state = {
        matchCount: test.length,
        history: test,
        profile: data.users[0]
      };
    }
  }, {
    key: "template",
    value: function template() {
      var matchCount = this.state.matchCount;
      var profile = this.state.profile;
      var temp = /* html */"\n            <div class=\"container nav-section\"></div>\n            <div class=\"container\" id=\"historySection\">\n                <div class=\"profile-section\">\n                    <div>\n                        <img id=\"profileImg\" class=\"profile-pic\" src=".concat(profile.profileImage, " alt=\"Profile Picture\">\n                    </div>\n                    <p class=\"fw-bold fs-4 mb-1\" id=\"userName\">").concat(profile.username, "</p>\n                    <p class=\"fs-6\" id=\"nickName\">").concat(profile.nickname, "</p>\n                    <div class=\"record-box fw-bold fs-3 my-5\">\n                        <span class=\"match-card blue\">").concat(profile.winLossRecord.wins, "</span> /\n                        <span class=\"match-card pink\">").concat(profile.winLossRecord.losses, "</span>\n                    </div>\n                </div>\n                <div class=\"row gy-4\">\n                ");
      for (var i = 0; i < matchCount; ++i) temp += /* html */"<div id=\"historyCard".concat(i, "\" class=\"col-md-6\"></div>");
      temp += /* html */"\n                </div>\n            </div>";
      return temp;
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var _this = this;
      var history = this.state.history;
      new _ProfileNav.default(this.$target.querySelector(".nav-section"));
      // for (let i = 0; i < matchCount; ++i)
      //     new HistoryCard(this.$target.querySelector(`#historyCard${i}`));

      history.forEach(function (match, index) {
        new _HistoryCard.default(_this.$target.querySelector("#historyCard".concat(index)), match);
      });
    }
  }]);
}(_Component2.default);
},{"../../core/Component.js":"src/core/Component.js","../../components/ProfileNav.js":"src/components/ProfileNav.js","../../components/HistoryCard.js":"src/components/HistoryCard.js"}],"src/components/FriendCard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var FriendCard = exports.default = /*#__PURE__*/function (_Component) {
  function FriendCard() {
    _classCallCheck(this, FriendCard);
    return _callSuper(this, FriendCard, arguments);
  }
  _inherits(FriendCard, _Component);
  return _createClass(FriendCard, [{
    key: "template",
    value: function template() {
      var _this$props = this.props,
        profileImage = _this$props.profileImage,
        message = _this$props.message,
        username = _this$props.username;
      return /* html */"\n\t\t<!-- Friend Card -->\n\t\t<div class=\"friend-card d-flex align-items-center\">\n\t\t\t<div class=\"friend-profile-pic-wrapper online me-3\">\n\t\t\t\t<img class=\"friend-profile-pic\" src=".concat(profileImage, " alt=\"Profile Picture\">\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<p class=\"friend-name mb-1\">").concat(username, "</p>\n\t\t\t\t<p class=\"friend-username mb-0\">").concat(message, "</p>\n\t\t\t</div>\n\t\t</div>\n\t\t");
    }

    // isOnline(userName) {
    // 	// user is online
    // }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js"}],"src/pages/profile/FriendView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../../core/Component.js"));
var _ProfileNav = _interopRequireDefault(require("../../components/ProfileNav.js"));
var _FriendCard = _interopRequireDefault(require("../../components/FriendCard.js"));
var _translations = require("../../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import FriendCard from "/frontend/src/components/FriendCard.js";
var data = {
  users: [{
    id: 1,
    profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
    message: "",
    username: "john_doe",
    winLossRecord: {
      wins: 10,
      losses: 3
    }
  }, {
    id: 2,
    profileImage: "https://via.placeholder.com/150",
    message: "ProGamer77 hihddddddddddddddddd dddddddddddihiiihhhhhhhhhhhhhhhh",
    username: "jane_smith",
    winLossRecord: {
      wins: 8,
      losses: 5
    }
  }, {
    id: 3,
    profileImage: "https://via.placeholder.com/150",
    message: "ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
    username: "max_king",
    winLossRecord: {
      wins: 3,
      losses: 9
    }
  }, {
    id: 4,
    profileImage: "https://via.placeholder.com/150",
    message: "dddddddddddihiiihh hh hh hh hh hh",
    username: "sara_connor",
    winLossRecord: {
      wins: 12,
      losses: 0
    }
  }, {
    id: 5,
    profileImage: "https://via.placeholder.com/150",
    message: "プレイヤープレイヤープレイヤープレイ",
    username: "tony_stark",
    winLossRecord: {
      wins: 7,
      losses: 2
    }
  }]
};
var FriendView = exports.default = /*#__PURE__*/function (_Component) {
  function FriendView() {
    _classCallCheck(this, FriendView);
    return _callSuper(this, FriendView, arguments);
  }
  _inherits(FriendView, _Component);
  return _createClass(FriendView, [{
    key: "setup",
    value: function setup() {
      this.state = {
        friendCount: data.users.length,
        friendData: data.users
      };
    }
  }, {
    key: "template",
    value: function template() {
      var friendCount = this.state.friendCount;
      var temp = /* html */"\n\t\t\t<div class=\"container nav-section\"></div>\n\t\t\t<div class=\"container friends\" id=\"friendSection\">\n\t\t\t\t<h3 class=\"mb-4 fw-bold\">".concat((0, _translations.getTranslation)("friendList"), "</h3>\n\t\t\t\t<div class=\"row gy-4\">\n\t\t");
      for (var i = 0; i < friendCount; ++i) temp += /* html */"<div id=\"friendCard".concat(i, "\" class=\"col-md-6\"></div>");
      temp += /* html */"\n\t\t\t\t</div>\n\t\t\t</div>";
      return temp;
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var _this = this;
      var friendData = this.state.friendData;
      new _ProfileNav.default(this.$target.querySelector(".nav-section"));
      friendData.forEach(function (list, index) {
        new _FriendCard.default(_this.$target.querySelector("#friendCard".concat(index)), list);
      });
    }
  }]);
}(_Component2.default);
},{"../../core/Component.js":"src/core/Component.js","../../components/ProfileNav.js":"src/components/ProfileNav.js","../../components/FriendCard.js":"src/components/FriendCard.js","../../utils/translations.js":"src/utils/translations.js"}],"src/components/UserInfo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _translations = require("../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
var UserInfo = exports.default = /*#__PURE__*/function (_Component) {
  function UserInfo() {
    _classCallCheck(this, UserInfo);
    return _callSuper(this, UserInfo, arguments);
  }
  _inherits(UserInfo, _Component);
  return _createClass(UserInfo, [{
    key: "template",
    value: function template() {
      var _this$props = this.props,
        username = _this$props.username,
        message = _this$props.message,
        email = _this$props.email;
      return /* html */"\n        <!-- User Info Section -->\n\t\t\t<h2 class=\"section-title mb-3 fs-4\">".concat((0, _translations.getTranslation)("userInfo"), "</h2>\n\t\t\t<table class=\"table shadow\">\n\t\t\t\t<tbody style=\"opacity: 0.8;\">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th scope=\"row\" class=\"text-start align-middle px-3\">").concat((0, _translations.getTranslation)("email"), "</th>\n\t\t\t\t\t\t<td class=\"d-flex justify-content-start align-items-center\">\n\t\t\t\t\t\t\t").concat(email, "\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th scope=\"row\" class=\"text-start align-middle px-3\">").concat((0, _translations.getTranslation)("username"), "</th>\n\t\t\t\t\t\t<td class=\"d-flex justify-content-start align-items-center\">").concat(username, "</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th scope=\"row\" class=\"text-start align-middle px-3\">").concat((0, _translations.getTranslation)("message"), "</th>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<div class=\"d-flex justify-content-start align-items-center\">\n\t\t\t\t\t\t\t\t<div class=\"col-9\">\n  \t\t\t\t\t\t\t\t\t<input type=\"text\" id=\"messageInput\" class=\"form-control\" value=\"").concat(message, "\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"col-3\">\n\t\t\t\t\t\t\t\t\t<button id=\"saveButton\" class=\"btn btn-outline-info ms-2\">").concat((0, _translations.getTranslation)("save"), "</button>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div id=\"errorMessage\" class=\"text-danger mt-2\" style=\"display: none;\"></div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t");
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      var _this = this;
      var onMessageChange = this.props.onMessageChange;
      this.addEvent("click", "#saveButton", function () {
        var messageInput = _this.$target.querySelector("#messageInput");
        var errorMessage = _this.$target.querySelector("#errorMessage");
        if (messageInput.value.length > 18) {
          // 메시지가 너무 긴 경우
          errorMessage.style.display = "block"; // 에러 메시지 표시
          errorMessage.textContent = (0, _translations.getTranslation)("errorMessage");
        } else {
          // 메시지가 적절한 경우
          errorMessage.style.display = "none"; // 에러 메시지 숨김
          console.log("메시지가 저장되었습니다:", messageInput.value); // 메시지 저장 로직 추가
        }
      });
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/translations.js":"src/utils/translations.js"}],"src/components/SettingInfo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../core/Component.js"));
var _translations = require("../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var SettingInfo = exports.default = /*#__PURE__*/function (_Component) {
  function SettingInfo() {
    _classCallCheck(this, SettingInfo);
    return _callSuper(this, SettingInfo, arguments);
  }
  _inherits(SettingInfo, _Component);
  return _createClass(SettingInfo, [{
    key: "template",
    value: function template() {
      var language = localStorage.getItem("lang") || "english";
      return /* html */"\n\t\t  <h2 class=\"section-title mb-3 fs-4\">".concat((0, _translations.getTranslation)("setting", language), "</h2>\n      <table class=\"table shadow\">\n        <tbody style=\"opacity: 0.9;\">\n          <!-- Language Row -->\n          <tr>\n            <th scope=\"row\" class=\"text-start align-middle px-3\">").concat((0, _translations.getTranslation)("language"), "</th>\n            <td>\n              <select class=\"form-select\">\n                <option value=\"english\">\uD83C\uDDFA\uD83C\uDDF8 English</option>\n                <option value=\"korean\">\uD83C\uDDF0\uD83C\uDDF7 \uD55C\uAD6D\uC5B4</option>\n                <option value=\"japanese\">\uD83C\uDDEF\uD83C\uDDF5 \u65E5\u672C\u8A9E</option>\n              </select>\n            </td>\n          </tr>\n          <tr>\n            <th scope=\"row\" class=\"text-start align-middle px-3\">").concat((0, _translations.getTranslation)("twoFactor"), "</th>\n            <td class=\"d-flex justify-content-end align-items-center\">\n              <div class=\"form-check form-switch\">\n                <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"2faSwitch\"\n                    style=\"transform: scale(1.8);\">\n              </div>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n        <!-- Logout Button -->\n      <div class=\"d-flex justify-content-end mt-4\">\n        <button type=\"button\" class=\"btn btn-outline-danger btn-lg px-4 fw-bold\" id=\"logoutBtn\">\n        ").concat((0, _translations.getTranslation)("logout"), "\n        </button>\n      </div>\t\n\t\t");
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var language = localStorage.getItem("lang") || "english";
      this.$target.querySelector(".form-select").value = language;
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      var _this = this;
      this.addEvent("change", ".form-select", function (e) {
        return _this.changeLanguage(e);
      });
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(e) {
      var lang = e.target.value;
      console.log(e);
      localStorage.setItem("lang", lang);
      this.props.handleLangChange();
    }
  }]);
}(_Component2.default);
},{"../core/Component.js":"src/core/Component.js","../utils/translations.js":"src/utils/translations.js"}],"src/pages/profile/SettingView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("../../core/Component.js"));
var _ProfileNav = _interopRequireDefault(require("../../components/ProfileNav.js"));
var _UserInfo = _interopRequireDefault(require("../../components/UserInfo.js"));
var _SettingInfo = _interopRequireDefault(require("../../components/SettingInfo.js"));
var _translations = require("../../utils/translations.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import UserInfo from "/frontend/src/components/UserInfo.js";
// import SettingInfo from "/frontend/src/components/SettingInfo.js";
var data = {
  users: [{
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    message: "Champion01",
    username: "john_doe",
    email: "abc@abc.com"
  }]
};
var SettingView = exports.default = /*#__PURE__*/function (_Component) {
  function SettingView() {
    _classCallCheck(this, SettingView);
    return _callSuper(this, SettingView, arguments);
  }
  _inherits(SettingView, _Component);
  return _createClass(SettingView, [{
    key: "setup",
    value: function setup() {
      this.state = {
        profile: data.users[0]
      };
    }
  }, {
    key: "template",
    value: function template() {
      var profile = this.state.profile;
      var lang = localStorage.getItem("lang");
      return /* html */"\n\t\t<div class=\"container nav-section\"></div>\n\t\t<!-- Profile Section -->\n<<<<<<< HEAD\n    <div class=\"setting-profile-section\" id=\"settingSection\">\n    <div>\n      <img class=\"setting-profile-pic\" src=".concat(profile.profileImage, " alt=\"Profile Picture\">\n      <input type=\"file\" id=\"fileInput\" style=\"display: none;\">\n    </div>\n      <button class=\"edit-button\">").concat((0, _translations.getTranslation)("edit", lang), "</button>\n    </div>\n    <div id=\"userInfo\" class=\"container settings-section\"></div>\n    <div id=\"settingInfo\" class=\"container settings-section\"></div>\n=======\n        <div class=\"setting-profile-section\" id=\"settingSection\">\n\t\t\t<div>\n\t\t\t\t<img class=\"setting-profile-pic\" src=").concat(profile.profileImage, " alt=\"Profile Picture\">\n\t\t\t</div>\n            <button class=\"edit-button\">").concat((0, _translations.getTranslation)("edit", lang), "</button>\n        </div>\n        <div id=\"userInfo\" class=\"container settings-section\"></div>\n        <div id=\"settingInfo\" class=\"container settings-section\"></div>\n>>>>>>> 8ced16848eaae800f9646ca763c1bfdb01f9556c\n\t\t");
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var profile = this.state.profile;
      new _ProfileNav.default(this.$target.querySelector(".nav-section"));
      new _UserInfo.default(this.$target.querySelector("#userInfo"), profile);
      new _SettingInfo.default(this.$target.querySelector("#settingInfo"), {
        handleLangChange: this.props.handleLangChange
      });
    }
  }, {
    key: "setEvent",
    value: function setEvent() {
      var _this = this;
      this.addEvent("click", ".edit-button", function () {
        var fileInput = document.getElementById("fileInput");
        fileInput.click();
      });
      this.addEvent("change", "#fileInput", function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          var profileImage = e.target.result;
          _this.setState({
            profile: _objectSpread(_objectSpread({}, _this.state.profile), {}, {
              profileImage: profileImage
            })
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }]);
}(_Component2.default);
},{"../../core/Component.js":"src/core/Component.js","../../components/ProfileNav.js":"src/components/ProfileNav.js","../../components/UserInfo.js":"src/components/UserInfo.js","../../components/SettingInfo.js":"src/components/SettingInfo.js","../../utils/translations.js":"src/utils/translations.js"}],"src/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Component2 = _interopRequireDefault(require("./core/Component.js"));
var _Router = _interopRequireDefault(require("./Router.js"));
var _LoginView = _interopRequireDefault(require("./pages/LoginView.js"));
var _HomeView = _interopRequireDefault(require("./pages/HomeView.js"));
var _GameView = _interopRequireDefault(require("./pages/GameView.js"));
var _TournamentView = _interopRequireDefault(require("./pages/TournamentView.js"));
var _Navbar = _interopRequireDefault(require("./components/Navbar.js"));
var _HistoryView = _interopRequireDefault(require("./pages/profile/HistoryView.js"));
var _FriendView = _interopRequireDefault(require("./pages/profile/FriendView.js"));
var _SettingView = _interopRequireDefault(require("./pages/profile/SettingView.js"));
var brackets = _interopRequireWildcard(require("./utils/tournament.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var data = {
  users: [{
    id: 1,
    profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
    nickname: "Champion01",
    username: "john_doe",
    winLossRecord: {
      wins: 10,
      losses: 3
    }
  }]
};
var App = exports.default = /*#__PURE__*/function (_Component) {
  function App() {
    _classCallCheck(this, App);
    return _callSuper(this, App, arguments);
  }
  _inherits(App, _Component);
  return _createClass(App, [{
    key: "setup",
    value: function setup() {
      this.state = {
        gameCnt: 0,
        gameMode: "",
        matches: [],
        participants: [],
        matchGame: null,
        opponent1: null,
        opponent2: null,
        profile: data.users[0]
      };
    }
  }, {
    key: "mounted",
    value: function mounted() {
      var _this = this;
      var profile = this.state.profile;
      var router = new _Router.default();
      var $nav = document.createElement("div");
      var $body = document.createElement("div");
      $nav.setAttribute("id", "nav");
      $body.setAttribute("id", "body");
      this.$target.append($nav, $body);
      router.addRoute("#/", function () {
        new _Navbar.default($nav, profile);
        new _HomeView.default($body, {
          handleNickModalClick: _this.handleNickModalClick.bind(_this)
        });
      });
      router.addRoute("#/login", function () {
        var $login = document.createElement("div");
        _this.$target.append($login);
        new _LoginView.default($login);
      });
      router.addRoute("#/game", function () {
        new _Navbar.default($nav, profile);
        new _GameView.default($body, {
          gameMode: _this.state.gameMode,
          // matches: this.state.matches,
          opponent1: _this.state.opponent1,
          opponent2: _this.state.opponent2,
          // matchGame: this.state.matchGame,
          handlePongNextGameClick: _this.handlePongNextGameClick.bind(_this)
        });
      });
      router.addRoute("#/tournament", function () {
        new _Navbar.default($nav, profile);
        new _TournamentView.default($body, {
          playerNames: _this.state.playerNames,
          participants: _this.state.participants,
          matches: _this.state.matches,
          handleTournamentGameStartClick: _this.handleTournamentGameStartClick.bind(_this)
        });
      });
      router.addRoute("#/profile/history", function () {
        new _Navbar.default($nav, profile);
        new _HistoryView.default($body);
      });
      router.addRoute("#/profile/friends", function () {
        new _Navbar.default($nav, profile);
        new _FriendView.default($body);
      });
      router.addRoute("#/profile/setting", function () {
        new _Navbar.default($nav, profile);
        new _SettingView.default($body, {
          handleLangChange: _this.handleLangChange.bind(_this)
        });
      });
      router.start();
    }
  }, {
    key: "handleLangChange",
    value: function handleLangChange() {
      this.setState();
    }
  }, {
    key: "handleNickModalClick",
    value: function handleNickModalClick(playerNames) {
      playerNames = brackets.shuffleArray(playerNames);
      var matches = brackets.generateMatchJson(playerNames);
      var participants = brackets.generateParticipantJson(playerNames);
      brackets.insertParticipant(matches, participants);
      this.setState({
        matches: matches,
        participants: participants,
        gameMode: "tournament"
      });
    }
  }, {
    key: "handleTournamentGameStartClick",
    value: function handleTournamentGameStartClick(match, index) {
      this.setState({
        gameCnt: index,
        matchGame: match,
        opponent1: match.opponent1,
        opponent2: match.opponent2
      });
    }
  }, {
    key: "handlePongNextGameClick",
    value: function handlePongNextGameClick(opponent1, opponent2) {
      var _this$state = this.state,
        matches = _this$state.matches,
        matchGame = _this$state.matchGame,
        gameCnt = _this$state.gameCnt,
        participants = _this$state.participants;
      console.log(matches);
      var nextMatchIdx = matches.findIndex(function (match) {
        return matchGame.round_id + 1 === match.round_id && (match.opponent1.id === null || match.opponent2.id === null);
      });
      matchGame.opponent1 = opponent1;
      matchGame.opponent2 = opponent2;
      matches[gameCnt] = matchGame;
      if (nextMatchIdx != -1) {
        var id = opponent1.score > opponent2.score ? opponent1.id : opponent2.id;
        if (matches[nextMatchIdx].opponent1.id === null) {
          matches[nextMatchIdx].opponent1.id = id;
          matches[nextMatchIdx].opponent1.name = participants[id].name;
        } else {
          matches[nextMatchIdx].opponent2.id = id;
          matches[nextMatchIdx].opponent2.name = participants[id].name;
        }
        matches[nextMatchIdx].empty = false;
      }
      this.setState({
        matches: matches
      });
    }
  }]);
}(_Component2.default);
window.onpopstate = function (event) {
  var path = window.location.hash;
  console.log(path);
  console.log("popstate", event.state);
};
},{"./core/Component.js":"src/core/Component.js","./Router.js":"src/Router.js","./pages/LoginView.js":"src/pages/LoginView.js","./pages/HomeView.js":"src/pages/HomeView.js","./pages/GameView.js":"src/pages/GameView.js","./pages/TournamentView.js":"src/pages/TournamentView.js","./components/Navbar.js":"src/components/Navbar.js","./pages/profile/HistoryView.js":"src/pages/profile/HistoryView.js","./pages/profile/FriendView.js":"src/pages/profile/FriendView.js","./pages/profile/SettingView.js":"src/pages/profile/SettingView.js","./utils/tournament.js":"src/utils/tournament.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _App = _interopRequireDefault(require("./App.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var $app = document.querySelector("#app");
new _App.default($app);
},{"./App.js":"src/App.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50143" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map