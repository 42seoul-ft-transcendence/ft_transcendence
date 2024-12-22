// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
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
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"9mu7C":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "890e741a975ef6c8";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && ![
        'localhost',
        '127.0.0.1',
        '0.0.0.0'
    ].includes(hostname) ? 'wss' : 'ws';
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        disposedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === 'reload') fullReload();
        else if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
                await hmrApplyUpdates(assets);
                hmrDisposeQueue();
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                let processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ('reload' in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"8lqZg":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _appJs = require("./App.js");
var _appJsDefault = parcelHelpers.interopDefault(_appJs);
const $app = document.querySelector("#app");
new (0, _appJsDefault.default)($app);

},{"./App.js":"2kQhy","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2kQhy":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("./core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _routerJs = require("./Router.js");
var _routerJsDefault = parcelHelpers.interopDefault(_routerJs);
var _loginViewJs = require("./pages/LoginView.js");
var _loginViewJsDefault = parcelHelpers.interopDefault(_loginViewJs);
var _homeViewJs = require("./pages/HomeView.js");
var _homeViewJsDefault = parcelHelpers.interopDefault(_homeViewJs);
var _gameViewJs = require("./pages/GameView.js");
var _gameViewJsDefault = parcelHelpers.interopDefault(_gameViewJs);
var _tournamentViewJs = require("./pages/TournamentView.js");
var _tournamentViewJsDefault = parcelHelpers.interopDefault(_tournamentViewJs);
var _navbarJs = require("./components/Navbar.js");
var _navbarJsDefault = parcelHelpers.interopDefault(_navbarJs);
var _historyViewJs = require("./pages/profile/HistoryView.js");
var _historyViewJsDefault = parcelHelpers.interopDefault(_historyViewJs);
var _friendViewJs = require("./pages/profile/FriendView.js");
var _friendViewJsDefault = parcelHelpers.interopDefault(_friendViewJs);
var _settingViewJs = require("./pages/profile/SettingView.js");
var _settingViewJsDefault = parcelHelpers.interopDefault(_settingViewJs);
var _tournamentJs = require("./utils/tournament.js");
const data = {
    users: [
        {
            id: 1,
            profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
            nickname: "Champion01",
            username: "john_doe",
            winLossRecord: {
                wins: 10,
                losses: 3
            }
        }
    ]
};
class App extends (0, _componentJsDefault.default) {
    setup() {
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
    mounted() {
        const { profile } = this.state;
        const router = new (0, _routerJsDefault.default)();
        const $nav = document.createElement("div");
        const $body = document.createElement("div");
        $nav.setAttribute("id", "nav");
        $body.setAttribute("id", "body");
        this.$target.append($nav, $body);
        router.addRoute("#/", ()=>{
            new (0, _navbarJsDefault.default)($nav, profile);
            new (0, _homeViewJsDefault.default)($body, {
                handleNickModalClick: this.handleNickModalClick.bind(this)
            });
        });
        router.addRoute("#/login", ()=>{
            const $login = document.createElement("div");
            this.$target.append($login);
            new (0, _loginViewJsDefault.default)($login);
        });
        router.addRoute("#/game", ()=>{
            new (0, _navbarJsDefault.default)($nav, profile);
            new (0, _gameViewJsDefault.default)($body, {
                gameMode: this.state.gameMode,
                // matches: this.state.matches,
                opponent1: this.state.opponent1,
                opponent2: this.state.opponent2,
                // matchGame: this.state.matchGame,
                handlePongNextGameClick: this.handlePongNextGameClick.bind(this)
            });
        });
        router.addRoute("#/tournament", ()=>{
            new (0, _navbarJsDefault.default)($nav, profile);
            new (0, _tournamentViewJsDefault.default)($body, {
                playerNames: this.state.playerNames,
                participants: this.state.participants,
                matches: this.state.matches,
                handleTournamentGameStartClick: this.handleTournamentGameStartClick.bind(this)
            });
        });
        router.addRoute("#/profile/history", ()=>{
            new (0, _navbarJsDefault.default)($nav, profile);
            new (0, _historyViewJsDefault.default)($body);
        });
        router.addRoute("#/profile/friends", ()=>{
            new (0, _navbarJsDefault.default)($nav, profile);
            new (0, _friendViewJsDefault.default)($body);
        });
        router.addRoute("#/profile/setting", ()=>{
            new (0, _navbarJsDefault.default)($nav, profile);
            new (0, _settingViewJsDefault.default)($body, {
                handleLangChange: this.handleLangChange.bind(this)
            });
        });
        router.start();
    }
    handleLangChange() {
        this.setState();
    }
    handleNickModalClick(playerNames) {
        playerNames = _tournamentJs.shuffleArray(playerNames);
        let matches = _tournamentJs.generateMatchJson(playerNames);
        let participants = _tournamentJs.generateParticipantJson(playerNames);
        _tournamentJs.insertParticipant(matches, participants);
        this.setState({
            matches: matches,
            participants: participants,
            gameMode: "tournament"
        });
    }
    handleTournamentGameStartClick(match, index) {
        this.setState({
            gameCnt: index,
            matchGame: match,
            opponent1: match.opponent1,
            opponent2: match.opponent2
        });
    }
    handlePongNextGameClick(opponent1, opponent2) {
        let { matches, matchGame, gameCnt, participants } = this.state;
        console.log(matches);
        const nextMatchIdx = matches.findIndex((match)=>matchGame.round_id + 1 === match.round_id && (match.opponent1.id === null || match.opponent2.id === null));
        matchGame.opponent1 = opponent1;
        matchGame.opponent2 = opponent2;
        matches[gameCnt] = matchGame;
        if (nextMatchIdx != -1) {
            let id = opponent1.score > opponent2.score ? opponent1.id : opponent2.id;
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
            matches
        });
    }
}
exports.default = App;
window.onpopstate = (event)=>{
    const path = window.location.hash;
    console.log(path);
    console.log("popstate", event.state);
};

},{"./core/Component.js":"fgpas","./Router.js":"kOSdl","./pages/LoginView.js":"jIiGv","./pages/HomeView.js":"gaf0e","./pages/GameView.js":"dajzD","./pages/TournamentView.js":"ek8YM","./components/Navbar.js":"5EEXV","./pages/profile/HistoryView.js":"cI7eq","./pages/profile/FriendView.js":"cA9ue","./pages/profile/SettingView.js":"1ZoJN","./utils/tournament.js":"ktSL7","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fgpas":[function(require,module,exports,__globalThis) {
/**
 * @brief 모든 컴포넌트의 기본 클래스
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Component {
    $target;
    props;
    state;
    /**
   * @brief Component 생성자
   * @param {HTMLElement} $target - 컴포넌트가 렌더링될 대상 요소
   * @param {Object} props - 컴포넌트의 속성
   */ constructor($target, props){
        this.$target = $target;
        this.props = props;
        this.setup();
        this.render();
        this.setEvent();
    }
    /**
   * @brief 컴포넌트 초기 설정 함수
   */ setup() {}
    /**
   * @brief 컴포넌트가 마운트된 후 호출되는 함수
   */ mounted() {}
    /**
   * @brief 컴포넌트의 HTML 템플릿을 반환하는 함수
   * @return {string} HTML 템플릿 문자열
   */ template() {
        return "";
    }
    /**
   * @brief 컴포넌트를 렌더링하는 함수
   */ render() {
        if (!this.$target) return;
        this.$target.innerHTML = this.template();
        this.mounted();
    }
    /**
   * @brief 컴포넌트의 상태를 업데이트하고 다시 렌더링하는 함수
   * @param {Object} newState - 새로운 상태
   */ setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
        this.render();
    }
    /**
   * @brief 이벤트를 설정하는 함수
   */ setEvent() {}
    /**
   * @brief 이벤트를 추가하는 함수
   * @param {string} eventType - 이벤트 타입
   * @param {string} selector - 이벤트가 적용될 요소의 선택자
   * @param {Function} callback - 이벤트 핸들러 함수
   */ addEvent(eventType, selector, callback) {
        if (this.$target === null) return;
        const children = [
            ...this.$target.querySelectorAll(selector)
        ];
        const isTarget = (target)=>children.includes(target) || target.closest(selector);
        this.$target.addEventListener(eventType, (event)=>{
            if (!isTarget(event.target)) return false;
            callback(event);
        });
    }
    /**
   * @brief 새로운 요소를 추가하는 함수
   * @param {string} selector - 추가할 요소의 태그 이름
   * @return {HTMLElement} 추가된 요소
   */ addElement(selector) {
        const $elem = document.createElement(selector);
        this.$target.append($elem);
        return $elem;
    }
    /**
   * @brief 컴포넌트의 속성을 업데이트하고 다시 렌더링하는 함수
   * @param {Object} newProps - 새로운 속성
   */ updateProps(newProps) {
        this.props = {
            ...this.props,
            ...newProps
        };
        this.render();
    }
} // function shallowEqual(obj1, obj2) {
 //   if (obj1 === obj2) return true;
 //   const keys1 = Object.keys(obj1);
 //   const keys2 = Object.keys(obj2);
 //   if (keys1.length !== keys2.length) return false;
 //   for (let key of keys1) {
 //     if (obj1[key] !== obj2[key]) return false;
 //   }
 //   return true;
 // }
exports.default = Component;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"kOSdl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("./core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
class Router extends (0, _componentJsDefault.default) {
    setup() {
        this.state = {
            routes: []
        };
    }
    addRoute(fragment, component) {
        this.state.routes.push({
            fragment,
            component
        });
    }
    checkRoutes() {
        const currentRoute = this.state.routes.find((route)=>{
            return route.fragment === window.location.hash;
        });
        if (!currentRoute) {
            window.location.href = "#/";
            this.state.routes[0].component();
            return;
        }
        currentRoute.component();
    }
    start() {
        window.onhashchange = (event)=>{
            this.checkRoutes();
        };
        if (!window.location.hash) window.location.hash = "#/";
        this.checkRoutes();
    }
}
exports.default = Router;

},{"./core/Component.js":"fgpas","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jIiGv":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
class Login extends (0, _componentJsDefault.default) {
    template() {
        return /* html */ `
		<div class="d-flex justify-content-center align-items-center vh-100">
			<div class="container h-50 w-50 d-flex flex-column justify-content-center text-center bg-white rounded-4 shadow-lg">
				<p class="h1 fw-bold">LOGIN</p>
				<div class="mt-5">
					<button type="button" class="btn btn-outline-primary py-2">
						<img src="/frontend/src/utils/42logo.png" alt="42Seoul Logo" class="me-2" style="width: 40px; height: 40px;">
						Login with 42Seoul
					</button>	
				</div>
			</div>
		</div>
		`;
    }
    setEvent() {
        this.addEvent("click", "button", async ()=>{
            console.log("42 login button clicked");
            try {
                // 백엔드에 요청
                const response = await fetch("https://localhost:4443/api/login/oauth/redirect/", {
                    method: "GET"
                });
                if (response.ok) {
                    const data = await response.json();
                }
            } catch (error) {
                console.error("Error during OAuth:", error);
            }
        });
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
} // window.onload = function () {
 //   const urlParams = new URLSearchParams(window.location.search);
 //   const accessToken = getCookie("access_token");
 //   const refreshToken = getCookie("refresh_token");
 //   if (accessToken && refreshToken) {
 //     console.log("Access Token:", accessToken);
 //     console.log("Refresh Token:", refreshToken);
 //     // 필요한 추가 작업 수행
 //   }
 // };
exports.default = Login;

},{"../core/Component.js":"fgpas","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gaf0e":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _selectModeJs = require("../components/SelectMode.js");
var _selectModeJsDefault = parcelHelpers.interopDefault(_selectModeJs);
var _pongJs = require("../components/Pong.js");
var _pongJsDefault = parcelHelpers.interopDefault(_pongJs);
var _tournamentModalJs = require("../components/TournamentModal.js");
var _tournamentModalJsDefault = parcelHelpers.interopDefault(_tournamentModalJs);
var _nickModalJs = require("../components/NickModal.js");
var _nickModalJsDefault = parcelHelpers.interopDefault(_nickModalJs);
class Home extends (0, _componentJsDefault.default) {
    setup() {
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
    template() {
        return /* html */ `
      <div id='bodyCtn' class="vh-100 d-flex align-items-center justify-content-center">
        <div id="boardCtn"></div>
        <div id="selectModeCtn" class="position-absolute top-50 start-50 translate-middle" ></div>
      </div>
    `;
    }
    mounted() {
        new (0, _pongJsDefault.default)(document.querySelector("#boardCtn"), {
            gameMode: ""
        });
        new (0, _selectModeJsDefault.default)(document.querySelector("#selectModeCtn"));
        new (0, _tournamentModalJsDefault.default)(document.querySelector("#tournamentModal"), {
            handleTotalPlayerClick: this.handleTotalPlayerClick.bind(this)
        });
        new (0, _nickModalJsDefault.default)(document.querySelector("#nicknameModal"), {
            totalPlayer: this.state.totalPlayer,
            handleNickModalClick: this.props.handleNickModalClick
        });
    }
    setEvent() {
        this.addEvent("click", "#oneToOne", this.handleOneToOneClick.bind(this));
    }
    handleOneToOneClick() {
        window.location.hash = "#/game";
    }
    handleTotalPlayerClick(number) {
        this.setState({
            totalPlayer: number,
            userName: []
        });
    }
}
exports.default = Home;

},{"../core/Component.js":"fgpas","../components/SelectMode.js":"4LWqE","../components/Pong.js":"fLLiZ","../components/TournamentModal.js":"3X0KO","../components/NickModal.js":"bWtX9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4LWqE":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _translationsJs = require("../utils/translations.js");
class Pong extends (0, _componentJsDefault.default) {
    template() {
        return /* html */ `
			<div class="game-screen d-flex flex-column justify-content-center align-items-center gap-3 p-4">
				<button id="oneToOneBtn" class="btn btn-light fw-bold fs-3 py-3 w-75 border-info border-4">1 vs 1</button>
				<button id="tournamentBtn" class="btn btn-light fw-bold fs-3 py-3 w-75 border-info border-4"
				 data-bs-toggle="modal" data-bs-target="#tournamentModal">${(0, _translationsJs.getTranslation)("tournament")}</button>
			</div>
		`;
    }
}
exports.default = Pong;

},{"../core/Component.js":"fgpas","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h56Q9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "translations", ()=>translations);
parcelHelpers.export(exports, "getTranslation", ()=>getTranslation);
const translations = {
    english: {
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
        save: "Save",
        language: "Language",
        oneVsOne: "1 vs 1",
        tournament: "Tournament",
        next: "Next",
        start: "Start",
        startGame: "Start Game",
        win: "WIN",
        twoFactor: "Two-Factor Authentication",
        tournamentDescription: "How many people do you want to play?",
        nickModalDescription: "Please enter your nickname",
        enterNick: "Enter Nickname",
        nickDuplicate: "Nickname already exists",
        nickEmpty: "Nickname cannot be empty",
        gameStart: "Start Game",
        nextGame: "Next Game",
        friendList: "Friend List",
        errorMessage: "Message is too long"
    },
    korean: {
        player: "\uD50C\uB808\uC774\uC5B4",
        edit: "\uD3B8\uC9D1",
        language: "\uC5B8\uC5B4",
        userInfo: "\uC0AC\uC6A9\uC790 \uC815\uBCF4",
        logout: "\uB85C\uADF8\uC544\uC6C3",
        setting: "\uC124\uC815",
        history: "\uD788\uC2A4\uD1A0\uB9AC",
        friends: "\uCE5C\uAD6C",
        email: "\uC774\uBA54\uC77C",
        username: "\uC0AC\uC6A9\uC790 \uC774\uB984",
        message: "\uC0C1\uD0DC \uBA54\uC138\uC9C0",
        save: "\uC800\uC7A5",
        language: "\uC5B8\uC5B4",
        oneVsOne: "1 \uB300 1",
        tournament: "\uD1A0\uB108\uBA3C\uD2B8",
        next: "\uB2E4\uC74C",
        start: "\uC2DC\uC791",
        startGame: "\uAC8C\uC784 \uC2DC\uC791",
        win: "\uC2B9\uB9AC",
        twoFactor: "\uC774\uC911 \uC778\uC99D",
        tournamentDescription: "\uBA87 \uBA85\uC774\uC11C \uAC8C\uC784\uC744 \uD558\uACE0 \uC2F6\uC73C\uC2E0\uAC00\uC694?",
        nickModalDescription: "\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694",
        enterNick: "\uB2C9\uB124\uC784 \uC785\uB825",
        nickDuplicate: "\uB2C9\uB124\uC784\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4",
        nickEmpty: "\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694",
        gameStart: "\uAC8C\uC784 \uC2DC\uC791",
        nextGame: "\uB2E4\uC74C \uAC8C\uC784",
        friendList: "\uCE5C\uAD6C \uBAA9\uB85D",
        errorMessage: "\uBA54\uC138\uC9C0\uAC00 \uB108\uBB34 \uAE41\uB2C8\uB2E4"
    },
    japanese: {
        player: "\u30D7\u30EC\u30A4\u30E4\u30FC",
        edit: "\u7DE8\u96C6",
        language: "\u8A00\u8A9E",
        userInfo: "\u30E6\u30FC\u30B6\u30FC\u60C5\u5831",
        logout: "\u30ED\u30B0\u30A2\u30A6\u30C8",
        setting: "\u8A2D\u5B9A",
        history: "\u5C65\u6B74",
        friends: "\u53CB\u9054",
        email: "\u30E1\u30FC\u30EB",
        username: "\u30E6\u30FC\u30B6\u30FC\u540D",
        message: "\u30E1\u30C3\u30BB\u30FC\u30B8",
        save: "\u4FDD\u5B58",
        language: "\u8A00\u8A9E",
        oneVsOne: "1 \u5BFE 1",
        tournament: "\u30C8\u30FC\u30CA\u30E1\u30F3\u30C8",
        next: "\u6B21\u3078",
        start: "\u30B9\u30BF\u30FC\u30C8",
        startGame: "\u30B2\u30FC\u30E0\u3092\u958B\u59CB",
        win: "\u52DD\u5229",
        twoFactor: "\u4E8C\u8981\u7D20\u8A8D\u8A3C",
        tournamentDescription: "\u4F55\u4EBA\u3067\u30B2\u30FC\u30E0\u3092\u3057\u305F\u3044\u3067\u3059\u304B\uFF1F",
        nickModalDescription: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
        enterNick: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u5165\u529B",
        nickDuplicate: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u306F\u65E2\u306B\u5B58\u5728\u3057\u307E\u3059",
        nickEmpty: "\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
        gameStart: "\u30B2\u30FC\u30E0\u3092\u958B\u59CB",
        nextGame: "\u6B21\u306E\u30B2\u30FC\u30E0",
        friendList: "\u53CB\u9054\u30EA\u30B9\u30C8",
        errorMessage: "\u30E1\u30C3\u30BB\u30FC\u30B8\u304C\u9577\u3059\u304E\u307E\u3059"
    }
};
const getTranslation = (key)=>{
    const lang = localStorage.getItem("lang") || "english";
    return translations[lang]?.[key] || key;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fLLiZ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _gameJs = require("../utils/game/game.js");
var _translationsJs = require("../utils/translations.js");
class Pong extends (0, _componentJsDefault.default) {
    setup() {
        const board = new _gameJs.Board(700, 500);
        this.state = {
            player1Score: 0,
            player2Score: 0,
            board: board,
            player1: new _gameJs.Player(10, board.height / 2, board),
            player2: new _gameJs.Player(board.width - 20, board.height / 2, board),
            ball: new _gameJs.Ball(board.width / 2, board.height / 2, 10, 10, 3, board),
            animationFrameId: null,
            opponent1: this.props.opponent1,
            opponent2: this.props.opponent2,
            finish: false
        };
        if (!this.props.opponent1 && !this.props.opponent2) window.location.hash = "#/";
    }
    template() {
        const { opponent1, opponent2 } = this.state;
        return /* html */ `
      <div class="canvas-container position-relative">
        <canvas id="board"></canvas>
        <div id="gameCtn" class="border bg-dark"></div>
        <div class="container-fluid position-absolute bottom-0 px-5">
          <div class="row w-100">
            <div class="col text-start">
              <span id="nickname-left" class="nickName fs-1 fw-bold" style="${!opponent1 ? "display:none;" : ""}">${opponent1?.name || ""}</span>
            </div>
            <div class="col text-end">
              <span id="nickname-right" class="nickName fs-1 fw-bold" style="${!opponent2 ? "display:none;" : ""}">${opponent2?.name || ""}</span>
            </div>
          </div>
        </div>
        <button id="nextBtn" class="btn btn-light fw-bold fs-3 py-3 border-info border-4 d-none">
         ${(0, _translationsJs.getTranslation)("nextGame")}
        </button>
      </div>
  
    `;
    }
    mounted() {
        const { board, player1, player2, player1Score, player2Score, finish } = this.state;
        board.init();
        player1.draw();
        player2.draw();
        board.draw(player1Score, player2Score);
        if (this.props.gameMode != "" && !finish) {
            if (this.props.opponent2.id == null) this.state.player1Score = 3;
            this.state.animationFrameId = requestAnimationFrame(this.update.bind(this));
        }
    }
    update() {
        let { board, player1, player2, ball, finish } = this.state;
        if (finish) return;
        board.clear();
        board.draw(this.state.player1Score, this.state.player2Score);
        player1.update();
        player1.draw();
        player2.update();
        player2.draw();
        if (this.state.player1Score == 3 || this.state.player2Score == 3) {
            let winWidth;
            if (this.state.animationFrameId) {
                let { opponent1, opponent2 } = this.state;
                this.state.finish = true;
                if (this.state.player1Score == 3) winWidth = board.width / 5 - 20;
                else winWidth = board.width * 4 / 5 - 60;
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
    setEvent() {
        document.addEventListener("keydown", (e)=>{
            if (e.code == "KeyW") this.state.player1.velocityY = -3;
            else if (e.code == "KeyS") this.state.player1.velocityY = 3;
            if (e.code == "ArrowUp") this.state.player2.velocityY = -3;
            else if (e.code == "ArrowDown") this.state.player2.velocityY = 3;
        });
        this.addEvent("click", "#nextBtn", ()=>{
            const { opponent1, opponent2, player1Score, player2Score } = this.state;
            if (player1Score == 3) {
                opponent1["result"] = "win";
                opponent2["result"] = "loss";
            } else {
                opponent2["result"] = "win";
                opponent1["result"] = "loss";
            }
            opponent1["score"] = player1Score;
            opponent2["score"] = player2Score;
            this.props.handlePongNextGameClick(opponent1, opponent2);
            window.location.hash = "#/tournament";
        });
    }
}
exports.default = Pong;

},{"../core/Component.js":"fgpas","../utils/game/game.js":"4Zvrk","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4Zvrk":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Board", ()=>Board);
parcelHelpers.export(exports, "Player", ()=>Player);
parcelHelpers.export(exports, "Ball", ()=>Ball);
class Player {
    constructor(x, y, board1){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 50;
        this.velocityY = 0;
        this.board = board1;
    }
    draw() {
        const { context } = this.board;
        context.fillStyle = "skyblue";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        let nextPlayerY = this.y + this.velocityY;
        if (!(nextPlayerY < 0 || nextPlayerY + this.height > this.board.height)) this.y += this.velocityY;
    }
}
class Ball {
    constructor(x, y, width, height, velocity, board1){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.velocityX = (Math.random() > 0.5 ? 1 : -1) * velocity; // 속도는 동일, 방향만 랜덤
        this.velocityY = (Math.random() > 0.5 ? 1 : -1) * velocity; // 속도는 동일, 방향만 랜
        this.board = board1;
        this.isResetting = false;
    }
    init() {
        try {
            this.x = board.width / 2;
            this.y = board.height / 2;
            this.velocityX = (Math.random() > 0.5 ? 1 : -1) * this.velocity; // 속도는 동일, 방향만 랜덤
            this.velocityY = (Math.random() > 0.5 ? 1 : -1) * this.velocity; // 속도는 동일, 방향만 랜
        } catch (err) {
            console.log(err);
        }
    }
    draw() {
        const { context } = this.board;
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(player1, player2) {
        this.x += this.velocityX;
        this.y += this.velocityY;
        if (this.y <= 0 || this.y + this.height >= this.board.height) this.velocityY *= -1; //reverse direction
        if (detectCollision(this, player1)) {
            if (this.x <= player1.x + player1.width) this.velocityX *= -1;
        } else if (detectCollision(this, player2)) {
            if (this.x + this.width >= player2.x) this.velocityX *= -1;
        }
    }
}
class Board {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.context = null;
    }
    init() {
        const board1 = document.getElementById("board");
        board1.height = this.height;
        board1.width = this.width;
        this.context = board1.getContext("2d");
    }
    draw(player1Score, player2Score) {
        this.context.fillStyle = "white";
        this.context.font = "45px sans-serif";
        this.context.fillText(player1Score, this.width / 5 + 10, 45);
        this.context.fillText(player2Score, this.width * 4 / 5 - 45, 45);
        this.context.fillStyle = "skyblue";
        for(let i = 10; i < this.height; i += 25)this.context.fillRect(this.width / 2, i, 5, 5);
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
}
const detectCollision = (ball, player)=>{
    return ball.x < player.x + player.width && //a's top left corner doesn't reach b's top right corner
    ball.x + ball.width > player.x && //a's top right corner passes b's top left corner
    ball.y < player.y + player.height && //a's top left corner doesn't reach b's bottom left corner
    ball.y + ball.height > player.y; //a's bottom left corner passes b's top left corner
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3X0KO":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _translationsJs = require("../utils/translations.js");
class TournamentModal extends (0, _componentJsDefault.default) {
    setup() {
        this.$target.classList = "modal fade";
        this.$target.setAttribute("tabindex", "-1");
        this.$target.setAttribute("aria-labelledby", "tournamentModalLabel");
        this.$target.setAttribute("aria-hidden", "true");
        this.$target.setAttribute("data-bs-backdrop", "static");
        this.$target.setAttribute("data-bs-keyboard", "false");
    }
    template() {
        return /* html */ `
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="tournamentModalLabel">${(0, _translationsJs.getTranslation)("tournament")}</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>${(0, _translationsJs.getTranslation)("tournamentDescription")}</p>
						<select id="playerCount" class="form-select w-50 mx-auto">
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
						</select>
					</div>

					<div class="modal-footer">
						<button id="nextButton" class="btn btn-outline-info" data-bs-target="#nicknameModal" data-bs-toggle="modal">${(0, _translationsJs.getTranslation)("next")}</button>
					</div>
				</div>
			</div>
		`;
    }
    setEvent() {
        this.addEvent("click", "#nextButton", ()=>{
            const totalNum = parseInt(this.$target.querySelector("#playerCount").value);
            this.props.handleTotalPlayerClick(totalNum);
        });
    }
}
exports.default = TournamentModal;

},{"../core/Component.js":"fgpas","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bWtX9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _translationsJs = require("../utils/translations.js");
class NickModal extends (0, _componentJsDefault.default) {
    setup() {
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
    template() {
        const { currentPlayer } = this.state;
        const { totalPlayer } = this.props;
        return /* html */ `
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="nicknameModalLabel">${(0, _translationsJs.getTranslation)("nickModalDescription")}</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>${(0, _translationsJs.getTranslation)("player")} ${currentPlayer} ${(0, _translationsJs.getTranslation)("nickname")}</p>
						<input type="text" class="form-control w-75 mx-auto" id="playerNicknameInput" placeholder="${(0, _translationsJs.getTranslation)("enterNick")}">
						<div id="errorMessage" class="text-danger mt-2" style="display: none;"></div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-outline-info" id="nextPlayerButton">
              ${currentPlayer == totalPlayer ? (0, _translationsJs.getTranslation)("start") : (0, _translationsJs.getTranslation)("next")}
            </button>
					</div>
				</div>
			</div>
		`;
    }
    mounted() {
        this.$target.querySelector("#nextPlayerButton").onclick = this.handleNextPlayerButtonClick.bind(this);
    }
    handleNextPlayerButtonClick() {
        let { currentPlayer, playerName } = this.state;
        let { totalPlayer } = this.props;
        const $nicknameInput = this.$target.querySelector("#playerNicknameInput");
        const nickname = $nicknameInput.value.trim();
        const $error = this.$target.querySelector("#errorMessage");
        if (nickname == "") {
            $nicknameInput.classList.add("is-invalid");
            $error.style.display = "block";
            $error.textContent = (0, _translationsJs.getTranslation)("nickEmpty");
        } else if (this.validateNickName(nickname)) {
            $nicknameInput.classList.add("is-invalid");
            $error.style.display = "block";
            $error.textContent = (0, _translationsJs.getTranslation)("nickDuplicate");
        } else if (currentPlayer < totalPlayer) {
            currentPlayer++;
            playerName.push(nickname);
            this.setState({
                currentPlayer,
                playerName
            });
        } else if (currentPlayer == totalPlayer) {
            playerName.push(nickname);
            this.props.handleNickModalClick(playerName);
            bootstrap.Modal.getOrCreateInstance(this.$target).hide();
            this.$target.remove();
            window.location.hash = "#/tournament";
        }
    }
    validateNickName(name) {
        return this.state.playerName.some((existingName)=>existingName === name);
    }
}
exports.default = NickModal;

},{"../core/Component.js":"fgpas","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dajzD":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
// import Pong from "/frontend/src/components/Pong.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _pongJs = require("../components/Pong.js");
var _pongJsDefault = parcelHelpers.interopDefault(_pongJs);
class Game extends (0, _componentJsDefault.default) {
    template() {
        return /* html */ `
    <div class="vh-100 d-flex align-items-center justify-content-center">
      <div id="gameCtn"></div>
    </div>
		`;
    }
    mounted() {
        // this.pongInstance = this.initComponent(
        //   this.pongInstance,
        //   Pong,
        //   "#gameCtn",
        //   {
        //     isGameMode: true,
        //     ...this.props,
        //   },
        // );
        new (0, _pongJsDefault.default)(this.$target.querySelector("#gameCtn"), {
            isGameMode: true,
            ...this.props
        });
    }
}
exports.default = Game;

},{"../core/Component.js":"fgpas","../components/Pong.js":"fLLiZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ek8YM":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
// import * as brackets from "/frontend/src/utils/tournament.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _tournamentJs = require("../utils/tournament.js");
var _translationsJs = require("../utils/translations.js");
class Tournament extends (0, _componentJsDefault.default) {
    setup() {
        this.state = {
            playNames: this.props.playerNames,
            participants: this.props.participants,
            matches: this.props.matches,
            currentMatch: 0
        };
        console.log(this.props.matches);
        if (this.props.matches.length === 0) window.location.hash = "#/";
    }
    template() {
        return /* html */ `
    <div class="bracket-wrapper">
  		<div id="brackets" class="container brackets-viewer"></div>
      <div id="gameStartBtn">
      <button id="gameStartBtn" class="btn btn-info mt-3 btn-lg">${(0, _translationsJs.getTranslation)("gameStart")}</button>
      </div>
    </div>
  	`;
    }
    async mounted() {
        const { participants, matches } = this.state;
        try {
            await window.bracketsViewer.render({
                stages: _tournamentJs.stage,
                matches: matches,
                matchGames: [],
                participants: participants
            });
        } catch (e) {
            console.log(e);
        }
    }
    setEvent() {
        this.addEvent("click", "#gameStartBtn", ()=>{
            const startMatchIdx = this.state.matches.findIndex((match)=>(!("result" in match.opponent1) || !("result" in match.opponent2)) && !match.empty);
            if (startMatchIdx !== -1) {
                const startMatch = this.state.matches[startMatchIdx];
                this.props.handleTournamentGameStartClick(startMatch, startMatchIdx);
                // window.history.pushState({ isManual: true }, "", "/game");
                window.location.hash = "#/game";
            } else // window.history.pushState({ isManual: true }, "", "/");
            window.location.hash = "#/";
        });
    }
}
exports.default = Tournament;

},{"../core/Component.js":"fgpas","../utils/tournament.js":"ktSL7","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ktSL7":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "insertParticipant", ()=>insertParticipant);
parcelHelpers.export(exports, "shuffleArray", ()=>shuffleArray);
parcelHelpers.export(exports, "generateMatchJson", ()=>generateMatchJson);
parcelHelpers.export(exports, "generateParticipantJson", ()=>generateParticipantJson);
parcelHelpers.export(exports, "stage", ()=>stage);
const stage = [
    {
        id: 0,
        tournament_id: 0,
        name: "Tournament",
        type: "single_elimination",
        number: 1,
        settings: {}
    }
];
const shuffleArray = (array)=>{
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [
            array[j],
            array[i]
        ];
    }
    return array;
};
const generateParticipantJson = (playerName)=>{
    return playerName.map((name, index)=>{
        return {
            id: index,
            name: name,
            tournament_id: 0
        };
    });
};
const generateMatchJson = (participantJson)=>{
    let tournaments = [];
    let round_id = 0;
    let id = 0; // 각 경기의 고유 ID
    let totalPlayer = participantJson.length;
    while(totalPlayer > 1){
        let matches = Math.floor(totalPlayer / 2); // 현재 라운드 경기 수
        let isBye = totalPlayer % 2 === 1; // 부전승 여부
        let matchCount = isBye ? matches + 1 : matches; // 부전승 포함한 경기 수
        // let matchCount = matches;
        for(let number = 1; number <= matchCount; number++)tournaments.push({
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
        round_id++; // 다음 라운드로 이동
        totalPlayer = matches + (isBye ? 1 : 0); // 부전승 포함한 다음 라운드 참가자 수
    }
    return tournaments;
};
const insertParticipant = (matchJson, participantJson)=>{
    const matchCount = Math.floor(participantJson.length / 2);
    let i;
    for(i = 0; i < matchCount; i++){
        matchJson[i].opponent1.id = 2 * i;
        matchJson[i].opponent1.name = participantJson[2 * i].name;
        matchJson[i].opponent1.position = 2 * i + 1;
        matchJson[i].opponent2.id = 2 * i + 1;
        matchJson[i].opponent2.name = participantJson[2 * i + 1].name;
        matchJson[i].opponent2.position = 2 * i + 2;
        matchJson[i].empty = false;
    }
    if (participantJson.length % 2 != 0) {
        matchJson[matchCount].opponent1.id = 2 * i;
        matchJson[matchCount].opponent1["result"] = "win";
        matchJson[matchCount].opponent1.name = participantJson[2 * i].name;
        matchJson[matchCount].empty = false;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5EEXV":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
class Navbar extends (0, _componentJsDefault.default) {
    template() {
        const { profileImage } = this.props;
        return /* html */ `
			<nav class="pong-nav navbar navbar-expand bg-warning navbar-dark px-4 py-3">
				<div class="container-fluid">
					<a class="navbar-brand fw-bold" href="#/">PONG!</a>
					<ul class="navbar-nav ms-auto">
						<li class="nav-item">
							<div class="icon" id="profileIcon">
								<img src=${profileImage} alt="Profile Image">
							</div>
						</li>
					</ul>
				</div>
			</nav>
		`;
    }
    setEvent() {
        this.addEvent('click', '#profileIcon', ()=>window.location.href = '#/profile/history');
    // this.addEvent("click", "#profileIcon", () =>
    //   window.history.pushState({ isManual: true }, "", "/profile/history"),
    // );
    }
}
exports.default = Navbar;

},{"../core/Component.js":"fgpas","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cI7eq":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import HistoryCard from "/frontend/src/components/HistoryCard.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _profileNavJs = require("../../components/ProfileNav.js");
var _profileNavJsDefault = parcelHelpers.interopDefault(_profileNavJs);
var _historyCardJs = require("../../components/HistoryCard.js");
var _historyCardJsDefault = parcelHelpers.interopDefault(_historyCardJs);
const test = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    }
];
const data = {
    users: [
        {
            id: 1,
            profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
            nickname: "Champion01",
            username: "john_doe",
            winLossRecord: {
                wins: 10,
                losses: 3
            }
        }
    ]
};
class HistoryView extends (0, _componentJsDefault.default) {
    setup() {
        this.state = {
            matchCount: test.length,
            history: test,
            profile: data.users[0]
        };
    }
    template() {
        const { matchCount } = this.state;
        const { profile } = this.state;
        let temp = /* html */ `
            <div class="container nav-section"></div>
            <div class="container" id="historySection">
                <div class="profile-section">
                    <div>
                        <img id="profileImg" class="profile-pic" src=${profile.profileImage} alt="Profile Picture">
                    </div>
                    <p class="fw-bold fs-4 mb-1" id="userName">${profile.username}</p>
                    <p class="fs-6" id="nickName">${profile.nickname}</p>
                    <div class="record-box fw-bold fs-3 my-5">
                        <span class="match-card blue">${profile.winLossRecord.wins}</span> /
                        <span class="match-card pink">${profile.winLossRecord.losses}</span>
                    </div>
                </div>
                <div class="row gy-4">
                `;
        for(let i = 0; i < matchCount; ++i)temp += /* html */ `<div id="historyCard${i}" class="col-md-6"></div>`;
        temp += /* html */ `
                </div>
            </div>`;
        return temp;
    }
    mounted() {
        const { history } = this.state;
        new (0, _profileNavJsDefault.default)(this.$target.querySelector(".nav-section"));
        // for (let i = 0; i < matchCount; ++i)
        //     new HistoryCard(this.$target.querySelector(`#historyCard${i}`));
        history.forEach((match, index)=>{
            new (0, _historyCardJsDefault.default)(this.$target.querySelector(`#historyCard${index}`), match);
        });
    }
}
exports.default = HistoryView;

},{"../../core/Component.js":"fgpas","../../components/ProfileNav.js":"kGnp3","../../components/HistoryCard.js":"kDv3l","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kGnp3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _translationsJs = require("../utils/translations.js");
class ProfileNav extends (0, _componentJsDefault.default) {
    template() {
        return /* html */ `
          <!-- Internal Navigation -->        
            <ul class="nav nav-underline">
                <li class="nav-item">
                    <a class="nav-link" data-name="history">${(0, _translationsJs.getTranslation)("history")}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-name="friends">${(0, _translationsJs.getTranslation)("friends")}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-name="setting">${(0, _translationsJs.getTranslation)("setting")}</a>
                </li>
            </ul>
        `;
    }
    mounted() {
        const hash = window.location.hash || "#/profile/history"; // 기본값 설정
        const navLinks = this.$target.querySelectorAll(".nav-link");
        navLinks.forEach((link)=>{
            const targetHash = "#/profile/" + link.dataset.name;
            if (targetHash === hash) link.classList.add("active");
            else link.classList.remove("active");
        });
    }
    setEvent() {
        this.addEvent("click", ".nav-item", (event)=>{
            event.preventDefault();
            window.location.hash = "#/profile/" + event.target.dataset.name;
        });
    }
}
exports.default = ProfileNav;

},{"../core/Component.js":"fgpas","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kDv3l":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
class HistoryCard extends (0, _componentJsDefault.default) {
    template() {
        const { me, oppenent, date } = this.props;
        return /* html */ `
        <!-- Match History Section -->
        <div class="match-card ${this.isWinner(me, oppenent)}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <div>
                        <img class="player-profile me-2" src=${me.profileImage} alt="Profile Picture">
                    </div>
                    <span>${me.name}</span>
                </div>
                <div class="d-flex align-items-center">
                    <span>${oppenent.name}</span>
                    <div>
                        <img class="player-profile ms-2" src=${oppenent.profileImage} alt="Profile Picture">
                    </div>
                </div>
            </div>
            <!-- Centered Score -->
            <div class="score-container">
                <div class="score">${me.score} - ${oppenent.score}</div>
            </div>
            <div class="d-flex justify-content-end">
                <div class="date">${date}</div>
            </div>
        </div>
        `;
    }
    isWinner(me, oppenent) {
        return me.score > oppenent.score ? "blue" : "pink";
    }
}
exports.default = HistoryCard;

},{"../core/Component.js":"fgpas","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cA9ue":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import FriendCard from "/frontend/src/components/FriendCard.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _profileNavJs = require("../../components/ProfileNav.js");
var _profileNavJsDefault = parcelHelpers.interopDefault(_profileNavJs);
var _friendCardJs = require("../../components/FriendCard.js");
var _friendCardJsDefault = parcelHelpers.interopDefault(_friendCardJs);
var _translationsJs = require("../../utils/translations.js");
const data = {
    users: [
        {
            id: 1,
            profileImage: "https://ui-avatars.com/api/?name=John+Doe&size=150",
            message: "",
            username: "john_doe",
            winLossRecord: {
                wins: 10,
                losses: 3
            }
        },
        {
            id: 2,
            profileImage: "https://via.placeholder.com/150",
            message: "ProGamer77 hihddddddddddddddddd dddddddddddihiiihhhhhhhhhhhhhhhh",
            username: "jane_smith",
            winLossRecord: {
                wins: 8,
                losses: 5
            }
        },
        {
            id: 3,
            profileImage: "https://via.placeholder.com/150",
            message: "\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147",
            username: "max_king",
            winLossRecord: {
                wins: 3,
                losses: 9
            }
        },
        {
            id: 4,
            profileImage: "https://via.placeholder.com/150",
            message: "dddddddddddihiiihh hh hh hh hh hh",
            username: "sara_connor",
            winLossRecord: {
                wins: 12,
                losses: 0
            }
        },
        {
            id: 5,
            profileImage: "https://via.placeholder.com/150",
            message: "\u30D7\u30EC\u30A4\u30E4\u30FC\u30D7\u30EC\u30A4\u30E4\u30FC\u30D7\u30EC\u30A4\u30E4\u30FC\u30D7\u30EC\u30A4",
            username: "tony_stark",
            winLossRecord: {
                wins: 7,
                losses: 2
            }
        }
    ]
};
class FriendView extends (0, _componentJsDefault.default) {
    setup() {
        this.state = {
            friendCount: data.users.length,
            friendData: data.users
        };
    }
    template() {
        const { friendCount } = this.state;
        let temp = /* html */ `
			<div class="container nav-section"></div>
			<div class="container friends" id="friendSection">
				<h3 class="mb-4 fw-bold">${(0, _translationsJs.getTranslation)("friendList")}</h3>
				<div class="row gy-4">
		`;
        for(let i = 0; i < friendCount; ++i)temp += /* html */ `<div id="friendCard${i}" class="col-md-6"></div>`;
        temp += /* html */ `
				</div>
			</div>`;
        return temp;
    }
    mounted() {
        const { friendData } = this.state;
        new (0, _profileNavJsDefault.default)(this.$target.querySelector(".nav-section"));
        friendData.forEach((list, index)=>{
            new (0, _friendCardJsDefault.default)(this.$target.querySelector(`#friendCard${index}`), list);
        });
    }
}
exports.default = FriendView;

},{"../../core/Component.js":"fgpas","../../components/ProfileNav.js":"kGnp3","../../components/FriendCard.js":"8NqYt","../../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8NqYt":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
class FriendCard extends (0, _componentJsDefault.default) {
    template() {
        const { profileImage, message, username } = this.props;
        return /* html */ `
		<!-- Friend Card -->
		<div class="friend-card d-flex align-items-center">
			<div class="friend-profile-pic-wrapper online me-3">
				<img class="friend-profile-pic" src=${profileImage} alt="Profile Picture">
			</div>
			<div>
				<p class="friend-name mb-1">${username}</p>
				<p class="friend-username mb-0">${message}</p>
			</div>
		</div>
		`;
    }
}
exports.default = FriendCard;

},{"../core/Component.js":"fgpas","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1ZoJN":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
// import ProfileNav from "/frontend/src/components/ProfileNav.js";
// import UserInfo from "/frontend/src/components/UserInfo.js";
// import SettingInfo from "/frontend/src/components/SettingInfo.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _profileNavJs = require("../../components/ProfileNav.js");
var _profileNavJsDefault = parcelHelpers.interopDefault(_profileNavJs);
var _userInfoJs = require("../../components/UserInfo.js");
var _userInfoJsDefault = parcelHelpers.interopDefault(_userInfoJs);
var _settingInfoJs = require("../../components/SettingInfo.js");
var _settingInfoJsDefault = parcelHelpers.interopDefault(_settingInfoJs);
var _translationsJs = require("../../utils/translations.js");
const data = {
    users: [
        {
            profileImage: "https://robohash.org/JohnDoe.png?size=150x150",
            message: "Champion01",
            username: "john_doe",
            email: "abc@abc.com"
        }
    ]
};
class SettingView extends (0, _componentJsDefault.default) {
    setup() {
        this.state = {
            profile: data.users[0]
        };
    }
    template() {
        const { profile } = this.state;
        const lang = localStorage.getItem("lang");
        return /* html */ `
		<div class="container nav-section"></div>
		<!-- Profile Section -->
<<<<<<< HEAD
    <div class="setting-profile-section" id="settingSection">
    <div>
      <img class="setting-profile-pic" src=${profile.profileImage} alt="Profile Picture">
      <input type="file" id="fileInput" style="display: none;">
    </div>
      <button class="edit-button">${(0, _translationsJs.getTranslation)("edit", lang)}</button>
    </div>
    <div id="userInfo" class="container settings-section"></div>
    <div id="settingInfo" class="container settings-section"></div>
=======
        <div class="setting-profile-section" id="settingSection">
			<div>
				<img class="setting-profile-pic" src=${profile.profileImage} alt="Profile Picture">
			</div>
            <button class="edit-button">${(0, _translationsJs.getTranslation)("edit", lang)}</button>
        </div>
        <div id="userInfo" class="container settings-section"></div>
        <div id="settingInfo" class="container settings-section"></div>
>>>>>>> 8ced16848eaae800f9646ca763c1bfdb01f9556c
		`;
    }
    mounted() {
        const { profile } = this.state;
        new (0, _profileNavJsDefault.default)(this.$target.querySelector(".nav-section"));
        new (0, _userInfoJsDefault.default)(this.$target.querySelector("#userInfo"), profile);
        new (0, _settingInfoJsDefault.default)(this.$target.querySelector("#settingInfo"), {
            handleLangChange: this.props.handleLangChange
        });
    }
    setEvent() {
        this.addEvent("click", ".edit-button", ()=>{
            const fileInput = document.getElementById("fileInput");
            fileInput.click();
        });
        this.addEvent("change", "#fileInput", (e)=>{
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e)=>{
                const profileImage = e.target.result;
                this.setState({
                    profile: {
                        ...this.state.profile,
                        profileImage
                    }
                });
            };
            reader.readAsDataURL(file);
        });
    }
}
exports.default = SettingView;

},{"../../core/Component.js":"fgpas","../../components/ProfileNav.js":"kGnp3","../../components/UserInfo.js":"45liE","../../components/SettingInfo.js":"7YiBT","../../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"45liE":[function(require,module,exports,__globalThis) {
// import Component from "/frontend/src/core/Component.js";
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _translationsJs = require("../utils/translations.js");
class UserInfo extends (0, _componentJsDefault.default) {
    template() {
        const { username, message, email } = this.props;
        return /* html */ `
        <!-- User Info Section -->
			<h2 class="section-title mb-3 fs-4">${(0, _translationsJs.getTranslation)("userInfo")}</h2>
			<table class="table shadow">
				<tbody style="opacity: 0.8;">
					<tr>
						<th scope="row" class="text-start align-middle px-3">${(0, _translationsJs.getTranslation)("email")}</th>
						<td class="d-flex justify-content-start align-items-center">
							${email}
						</td>
					</tr>
					<tr>
						<th scope="row" class="text-start align-middle px-3">${(0, _translationsJs.getTranslation)("username")}</th>
						<td class="d-flex justify-content-start align-items-center">${username}</td>
					</tr>
					<tr>
						<th scope="row" class="text-start align-middle px-3">${(0, _translationsJs.getTranslation)("message")}</th>
						<td>
							<div class="d-flex justify-content-start align-items-center">
								<div class="col-9">
  									<input type="text" id="messageInput" class="form-control" value="${message}">
								</div>
								<div class="col-3">
									<button id="saveButton" class="btn btn-outline-info ms-2">${(0, _translationsJs.getTranslation)("save")}</button>
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
        this.addEvent("click", "#saveButton", ()=>{
            const messageInput = this.$target.querySelector("#messageInput");
            const errorMessage = this.$target.querySelector("#errorMessage");
            if (messageInput.value.length > 18) {
                // 메시지가 너무 긴 경우
                errorMessage.style.display = "block"; // 에러 메시지 표시
                errorMessage.textContent = (0, _translationsJs.getTranslation)("errorMessage");
            } else {
                // 메시지가 적절한 경우
                errorMessage.style.display = "none"; // 에러 메시지 숨김
                console.log("\uBA54\uC2DC\uC9C0\uAC00 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4:", messageInput.value); // 메시지 저장 로직 추가
            }
        });
    }
}
exports.default = UserInfo;

},{"../core/Component.js":"fgpas","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7YiBT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _componentJs = require("../core/Component.js");
var _componentJsDefault = parcelHelpers.interopDefault(_componentJs);
var _translationsJs = require("../utils/translations.js");
class SettingInfo extends (0, _componentJsDefault.default) {
    template() {
        const language = localStorage.getItem("lang") || "english";
        return /* html */ `
		  <h2 class="section-title mb-3 fs-4">${(0, _translationsJs.getTranslation)("setting", language)}</h2>
      <table class="table shadow">
        <tbody style="opacity: 0.9;">
          <!-- Language Row -->
          <tr>
            <th scope="row" class="text-start align-middle px-3">${(0, _translationsJs.getTranslation)("language")}</th>
            <td>
              <select class="form-select">
                <option value="english">\u{1F1FA}\u{1F1F8} English</option>
                <option value="korean">\u{1F1F0}\u{1F1F7} \u{D55C}\u{AD6D}\u{C5B4}</option>
                <option value="japanese">\u{1F1EF}\u{1F1F5} \u{65E5}\u{672C}\u{8A9E}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th scope="row" class="text-start align-middle px-3">${(0, _translationsJs.getTranslation)("twoFactor")}</th>
            <td class="d-flex justify-content-end align-items-center">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="2faSwitch"
                    style="transform: scale(1.8);">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        <!-- Logout Button -->
      <div class="d-flex justify-content-end mt-4">
        <button type="button" class="btn btn-outline-danger btn-lg px-4 fw-bold" id="logoutBtn">
        ${(0, _translationsJs.getTranslation)("logout")}
        </button>
      </div>	
		`;
    }
    mounted() {
        const language = localStorage.getItem("lang") || "english";
        this.$target.querySelector(".form-select").value = language;
    }
    setEvent() {
        this.addEvent("change", ".form-select", (e)=>this.changeLanguage(e));
    }
    changeLanguage(e) {
        const lang = e.target.value;
        console.log(e);
        localStorage.setItem("lang", lang);
        this.props.handleLangChange();
    }
}
exports.default = SettingInfo;

},{"../core/Component.js":"fgpas","../utils/translations.js":"h56Q9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["9mu7C","8lqZg"], "8lqZg", "parcelRequire94c2")

//# sourceMappingURL=index.975ef6c8.js.map
