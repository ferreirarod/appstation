var appstation =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_engine_1 = __webpack_require__(1);
class Component {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.container = document.createElement("div");
        this.container.id = this.id;
        this.container.innerHTML = this.getInnerHTML();
        this.parent.appendChild(this.container);
        this.afterRendered();
        state_engine_1.default.addListener(this.onStateChange());
    }
    setStyle(style) {
        this.container.style.cssText = style;
    }
    setClass(className) {
        this.container.className = className;
    }
    getId() {
        return this.id;
    }
    getContainer() {
        return this.container;
    }
    getInnerHTML() {
        return '';
    }
    onStateChange() {
        return null;
    }
    afterRendered() {
        // nothing here
    }
}
;
exports.default = Component;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AppStationStateListeners {
    constructor() {
        this.listeners = [];
    }
    addListener(fn) {
        if (fn != null) {
            this.listeners.push(fn);
        }
    }
    removeListener(fn) {
        const listenerIndex = this.listeners.indexOf(fn);
        if (listenerIndex != -1) {
            this.listeners.splice(this.listeners.indexOf(fn), 1);
        }
    }
    getListeners() {
        return this.listeners;
    }
    set(property, value) {
        this[property] = value;
    }
    get(property) {
        return this[property];
    }
}
exports.AppStationStateListeners = AppStationStateListeners;
const AppStationState = new Proxy(new AppStationStateListeners(), {
    set: (obj, property, value) => {
        obj[property] = value;
        obj.getListeners().forEach((fn) => {
            fn(obj, property, value);
        });
        return true;
    }
});
const stateEngine = AppStationState;
exports.default = stateEngine;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firebase = __webpack_require__(2);
const state_engine_1 = __webpack_require__(1);
class AppGridService {
    saveInstalledGrid() {
        const apps = state_engine_1.default.get("installed-apps");
        const userGrid = {
            apps: new Array()
        };
        apps.forEach(app => {
            const gso = app.getGridStackOptions();
            userGrid.apps.push({ x: gso.x, y: gso.y, autoPosition: gso.autoPosition, id: gso.id });
        });
        firebase.database().ref('grid/' + firebase.auth().currentUser.uid).set(userGrid);
    }
    loadGrid() {
        firebase.database().ref('/grid/' + firebase.auth().currentUser.uid).once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                const appsConfig = snapshot.val().apps;
                const newInstalledApps = new Array();
                const availableApps = state_engine_1.default.get("available-apps");
                if (availableApps != null && availableApps.length != 0) {
                    appsConfig.forEach(cfg => {
                        const filtered = availableApps.filter(app => app.getId() == cfg.id);
                        if (filtered.length != 0) {
                            const app = filtered[0];
                            app.setX(cfg.x);
                            app.setY(cfg.y);
                            app.setAutoPosition(cfg.autoPosition);
                            newInstalledApps.push(app);
                        }
                    });
                    state_engine_1.default.set("installed-apps", newInstalledApps);
                    return;
                }
            }
            state_engine_1.default.set("installed-apps", null);
        });
    }
}
exports.AppGridService = AppGridService;
const appGridService = new AppGridService();
exports.default = appGridService;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const firebase = __webpack_require__(2);
const state_engine_1 = __webpack_require__(1);
const component_1 = __webpack_require__(0);
const login_1 = __webpack_require__(16);
const content_1 = __webpack_require__(12);
const loading_1 = __webpack_require__(15);
const app_grid_service_1 = __webpack_require__(3);
class AppStation extends component_1.default {
    constructor(config, apps, loginProviders, appName) {
        super(document.body, "app-station");
        this.firstHashLoad = true;
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                state_engine_1.default.set("user", user);
                state_engine_1.default.set("available-apps", apps);
                app_grid_service_1.default.loadGrid();
            }
            else {
                state_engine_1.default.set("user", null);
            }
        });
        if (appName != null && appName.trim().length != 0) {
            state_engine_1.default.set("app-station-name", appName);
        }
        state_engine_1.default.set("login-providers", loginProviders);
    }
    afterRendered() {
        this.login = new login_1.Login(this.getContainer(), `${this.getId()}-login`);
        this.content = new content_1.default(this.getContainer(), `${this.getId()}-content`);
        this.loading = new loading_1.default(this.getContainer(), `${this.getId()}-loading`);
    }
    onStateChange() {
        return (state, property, value) => {
            if (property == "installed-apps" && this.firstHashLoad) {
                this.firstHashLoad = false;
                const hashChanged = () => {
                    const hash = new String(location.hash);
                    if (hash.trim().length != 0) {
                        const beginIndex = 1;
                        const indexOfSlash = hash.indexOf("\\");
                        const endIndex = indexOfSlash == -1 ? hash.length : indexOfSlash;
                        const appId = hash.substring(beginIndex, endIndex);
                        const installedApps = state_engine_1.default.get("installed-apps");
                        if (installedApps != null) {
                            installedApps.forEach(app => {
                                if (app.getId() == appId && app.isFullScreenApp()) {
                                    state_engine_1.default.set("fullscreen-app", app);
                                }
                            });
                            return;
                        }
                    }
                    state_engine_1.default.set("fullscreen-app", null);
                };
                onhashchange = hashChanged;
                hashChanged();
            }
        };
    }
}
exports.default = AppStation;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, ":root .grid-stack-item > .ui-resizable-handle {\n  filter: none;\n}\n\n.grid-stack {\n  position: relative;\n}\n\n.grid-stack.grid-stack-rtl {\n  direction: ltr;\n}\n\n.grid-stack.grid-stack-rtl > .grid-stack-item {\n  direction: rtl;\n}\n\n.grid-stack .grid-stack-placeholder > .placeholder-content {\n  border: 1px dashed lightgray;\n  margin: 0;\n  position: absolute;\n  top: 0;\n  left: 10px;\n  right: 10px;\n  bottom: 0;\n  width: auto;\n  z-index: 0 !important;\n  text-align: center;\n}\n\n.grid-stack > .grid-stack-item {\n  min-width: 8.3333333333%;\n  position: absolute;\n  padding: 0;\n}\n\n.grid-stack > .grid-stack-item > .grid-stack-item-content {\n  margin: 0;\n  position: absolute;\n  top: 0;\n  left: 10px;\n  right: 10px;\n  bottom: 0;\n  width: auto;\n  z-index: 0 !important;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-handle {\n  position: absolute;\n  font-size: 0.1px;\n  display: block;\n  -ms-touch-action: none;\n  touch-action: none;\n}\n\n.grid-stack > .grid-stack-item.ui-resizable-disabled > .ui-resizable-handle,\n.grid-stack > .grid-stack-item.ui-resizable-autohide > .ui-resizable-handle {\n  display: none;\n}\n\n.grid-stack > .grid-stack-item.ui-draggable-dragging, .grid-stack > .grid-stack-item.ui-resizable-resizing {\n  z-index: 100;\n}\n\n.grid-stack > .grid-stack-item.ui-draggable-dragging > .grid-stack-item-content,\n.grid-stack > .grid-stack-item.ui-draggable-dragging > .grid-stack-item-content, .grid-stack > .grid-stack-item.ui-resizable-resizing > .grid-stack-item-content,\n.grid-stack > .grid-stack-item.ui-resizable-resizing > .grid-stack-item-content {\n  box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.2);\n  opacity: 0.8;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-se,\n.grid-stack > .grid-stack-item > .ui-resizable-sw {\n  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMS42MjYgNTExLjYyNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjYyNiA1MTEuNjI3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTMyOC45MDYsNDAxLjk5NGgtMzYuNTUzVjEwOS42MzZoMzYuNTUzYzQuOTQ4LDAsOS4yMzYtMS44MDksMTIuODQ3LTUuNDI2YzMuNjEzLTMuNjE1LDUuNDIxLTcuODk4LDUuNDIxLTEyLjg0NSAgIGMwLTQuOTQ5LTEuODAxLTkuMjMxLTUuNDI4LTEyLjg1MWwtNzMuMDg3LTczLjA5QzI2NS4wNDQsMS44MDksMjYwLjc2LDAsMjU1LjgxMywwYy00Ljk0OCwwLTkuMjI5LDEuODA5LTEyLjg0Nyw1LjQyNCAgIGwtNzMuMDg4LDczLjA5Yy0zLjYxOCwzLjYxOS01LjQyNCw3LjkwMi01LjQyNCwxMi44NTFjMCw0Ljk0NiwxLjgwNyw5LjIyOSw1LjQyNCwxMi44NDVjMy42MTksMy42MTcsNy45MDEsNS40MjYsMTIuODUsNS40MjYgICBoMzYuNTQ1djI5Mi4zNThoLTM2LjU0MmMtNC45NTIsMC05LjIzNSwxLjgwOC0xMi44NSw1LjQyMWMtMy42MTcsMy42MjEtNS40MjQsNy45MDUtNS40MjQsMTIuODU0ICAgYzAsNC45NDUsMS44MDcsOS4yMjcsNS40MjQsMTIuODQ3bDczLjA4OSw3My4wODhjMy42MTcsMy42MTcsNy44OTgsNS40MjQsMTIuODQ3LDUuNDI0YzQuOTUsMCw5LjIzNC0xLjgwNywxMi44NDktNS40MjQgICBsNzMuMDg3LTczLjA4OGMzLjYxMy0zLjYyLDUuNDIxLTcuOTAxLDUuNDIxLTEyLjg0N2MwLTQuOTQ4LTEuODA4LTkuMjMyLTUuNDIxLTEyLjg1NCAgIEMzMzguMTQyLDQwMy44MDIsMzMzLjg1Nyw0MDEuOTk0LDMyOC45MDYsNDAxLjk5NHoiIGZpbGw9IiM2NjY2NjYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);\n  background-repeat: no-repeat;\n  background-position: center;\n  -webkit-transform: rotate(45deg);\n  -moz-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  -o-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-se {\n  -webkit-transform: rotate(-45deg);\n  -moz-transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -o-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-nw {\n  cursor: nw-resize;\n  width: 20px;\n  height: 20px;\n  left: 10px;\n  top: 0;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-n {\n  cursor: n-resize;\n  height: 10px;\n  top: 0;\n  left: 25px;\n  right: 25px;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-ne {\n  cursor: ne-resize;\n  width: 20px;\n  height: 20px;\n  right: 10px;\n  top: 0;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-e {\n  cursor: e-resize;\n  width: 10px;\n  right: 10px;\n  top: 15px;\n  bottom: 15px;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-se {\n  cursor: se-resize;\n  width: 20px;\n  height: 20px;\n  right: 10px;\n  bottom: 0;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-s {\n  cursor: s-resize;\n  height: 10px;\n  left: 25px;\n  bottom: 0;\n  right: 25px;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-sw {\n  cursor: sw-resize;\n  width: 20px;\n  height: 20px;\n  left: 10px;\n  bottom: 0;\n}\n\n.grid-stack > .grid-stack-item > .ui-resizable-w {\n  cursor: w-resize;\n  width: 10px;\n  left: 10px;\n  top: 15px;\n  bottom: 15px;\n}\n\n.grid-stack > .grid-stack-item.ui-draggable-dragging > .ui-resizable-handle {\n  display: none !important;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='1'] {\n  width: 8.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='1'] {\n  left: 8.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='1'] {\n  min-width: 8.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='1'] {\n  max-width: 8.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='2'] {\n  width: 16.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='2'] {\n  left: 16.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='2'] {\n  min-width: 16.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='2'] {\n  max-width: 16.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='3'] {\n  width: 25%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='3'] {\n  left: 25%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='3'] {\n  min-width: 25%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='3'] {\n  max-width: 25%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='4'] {\n  width: 33.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='4'] {\n  left: 33.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='4'] {\n  min-width: 33.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='4'] {\n  max-width: 33.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='5'] {\n  width: 41.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='5'] {\n  left: 41.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='5'] {\n  min-width: 41.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='5'] {\n  max-width: 41.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='6'] {\n  width: 50%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='6'] {\n  left: 50%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='6'] {\n  min-width: 50%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='6'] {\n  max-width: 50%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='7'] {\n  width: 58.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='7'] {\n  left: 58.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='7'] {\n  min-width: 58.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='7'] {\n  max-width: 58.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='8'] {\n  width: 66.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='8'] {\n  left: 66.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='8'] {\n  min-width: 66.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='8'] {\n  max-width: 66.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='9'] {\n  width: 75%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='9'] {\n  left: 75%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='9'] {\n  min-width: 75%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='9'] {\n  max-width: 75%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='10'] {\n  width: 83.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='10'] {\n  left: 83.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='10'] {\n  min-width: 83.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='10'] {\n  max-width: 83.3333333333%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='11'] {\n  width: 91.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='11'] {\n  left: 91.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='11'] {\n  min-width: 91.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='11'] {\n  max-width: 91.6666666667%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-width='12'] {\n  width: 100%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-x='12'] {\n  left: 100%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-min-width='12'] {\n  min-width: 100%;\n}\n\n.grid-stack > .grid-stack-item[data-gs-max-width='12'] {\n  max-width: 100%;\n}\n\n.grid-stack.grid-stack-animate,\n.grid-stack.grid-stack-animate .grid-stack-item {\n  -webkit-transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;\n  -moz-transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;\n  -ms-transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;\n  -o-transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;\n  transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;\n}\n\n.grid-stack.grid-stack-animate .grid-stack-item.ui-draggable-dragging,\n.grid-stack.grid-stack-animate .grid-stack-item.ui-resizable-resizing,\n.grid-stack.grid-stack-animate .grid-stack-item.grid-stack-placeholder {\n  -webkit-transition: left 0s, top 0s, height 0s, width 0s;\n  -moz-transition: left 0s, top 0s, height 0s, width 0s;\n  -ms-transition: left 0s, top 0s, height 0s, width 0s;\n  -o-transition: left 0s, top 0s, height 0s, width 0s;\n  transition: left 0s, top 0s, height 0s, width 0s;\n}\n\n.grid-stack.grid-stack-one-column-mode {\n  height: auto !important;\n}\n\n.grid-stack.grid-stack-one-column-mode > .grid-stack-item {\n  position: relative !important;\n  width: auto !important;\n  left: 0 !important;\n  top: auto !important;\n  margin-bottom: 20px;\n  max-width: none !important;\n}\n\n.grid-stack.grid-stack-one-column-mode > .grid-stack-item > .ui-resizable-handle {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./gridstack.css", function() {
			var newContent = require("!!../../css-loader/index.js!./gridstack.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../style-loader/index.js!../../css-loader/index.js!./gridstack.css", function() {
			var newContent = require("!!../../style-loader/index.js!../../css-loader/index.js!./gridstack.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(0);
const state_engine_1 = __webpack_require__(1);
const app_grid_service_1 = __webpack_require__(3);
class AppList extends component_1.default {
    getInnerHTML() {
        return `
            <div id="${this.getId()}-overlay" class="app-station-app-list-overlay"></div>
            <div id="${this.getId()}-apps" class="app-station-app-list-apps">
                <span id="${this.getId()}-title" class="app-station-app-list-title">Apps</span>
                <ul id="${this.getId()}-list-container" class="app-station-app-list-container">
                </ul>
            </div>
        `;
    }
    afterRendered() {
        this.setClass("app-station-app-list");
        this.overlay = this.getContainer().querySelector(`#${this.getId()}-overlay`);
        this.overlay.onclick = () => {
            state_engine_1.default.set("app-list-menu-visible", false);
        };
        this.getContainer().style.display = 'none';
    }
    onStateChange() {
        return (state, property, value) => {
            switch (property) {
                case "app-list-menu-visible":
                    this.getContainer().style.display = value ? null : 'none';
                    break;
                case "available-apps":
                    this.buildAppList(value);
                    break;
                case "installed-apps":
                    this.buildAppList(state_engine_1.default.get("available-apps"));
                    break;
            }
        };
    }
    buildAppList(apps) {
        if (apps != null && apps.length != 0) {
            const ul = this.getContainer().querySelector(`#${this.getId()}-list-container`);
            if (ul.children.length != 0) {
                ul.querySelectorAll("li").forEach(li => {
                    ul.removeChild(li);
                });
            }
            apps.forEach(app => {
                const installedApps = state_engine_1.default.get("installed-apps");
                const newInstalledApps = installedApps != null ? [...installedApps] : [];
                if (newInstalledApps.indexOf(app) != -1) {
                    return;
                }
                const li = document.createElement("li");
                li.className = "app-station-list-container-item";
                li.innerHTML = `
                    <div class="app-station-list-container-item-name">${app.getName()}</div>
                    <div>${app.getDescription()}</div>
                `;
                li.onclick = () => {
                    const installedApps = state_engine_1.default.get("installed-apps");
                    const newInstalledApps = installedApps != null ? [...installedApps] : [];
                    app.setX(0);
                    app.setY(0);
                    app.setAutoPosition(true);
                    app.getContainer().style.top = null;
                    app.getContainer().style.left = null;
                    newInstalledApps.push(app);
                    state_engine_1.default.set("installed-apps", newInstalledApps);
                    app_grid_service_1.default.saveInstalledGrid();
                    state_engine_1.default.set("app-list-menu-visible", false);
                    //stateEngine.set("fullscreen-app", null);
                    location.hash = '';
                };
                ul.appendChild(li);
            });
        }
    }
}
exports.default = AppList;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(0);
const header_1 = __webpack_require__(14);
const grid_1 = __webpack_require__(13);
const app_list_1 = __webpack_require__(11);
class AppContent extends component_1.default {
    afterRendered() {
        this.appList = new app_list_1.default(this.getContainer(), "app-station-app-list");
        this.header = new header_1.default(this.getContainer(), "app-station-header");
        this.grid = new grid_1.default(this.getContainer(), "app-station-grid");
        this.setClass("app-station-content");
        this.getContainer().style.display = 'none';
    }
    onStateChange() {
        return (state, property, value) => {
            if (property == "user") {
                this.getContainer().style.display = value != null ? null : 'none';
            }
            else if (property == "fullscreen-app") {
                this.getContainer().style.overflowY = value != null ? 'hidden' : 'auto';
            }
        };
    }
}
exports.default = AppContent;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(0);
const $ = __webpack_require__(2);
__webpack_require__(2);
const state_engine_1 = __webpack_require__(1);
const app_grid_service_1 = __webpack_require__(3);
__webpack_require__(10);
class Grid extends component_1.default {
    constructor(parent, id) {
        super(parent, id);
        this.widgetCount = 0;
    }
    getInnerHTML() {
        return `
            <div class="grid-stack" data-gs-width="12" data-gs-animate="yes"></div>
        `;
    }
    removeItem(item) {
        const installedApps = state_engine_1.default.get("installed-apps");
        const newInstalledApps = new Array();
        installedApps.forEach(app => {
            if (item.id != app.getId()) {
                newInstalledApps.push(app);
            }
        });
        state_engine_1.default.set("installed-apps", newInstalledApps);
        app_grid_service_1.default.saveInstalledGrid();
    }
    afterRendered() {
        $(() => {
            $('.grid-stack').gridstack({
                width: 12,
                alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            });
            $('.grid-stack').on('change', (event, items) => {
                this.serializeGridState();
            });
            $('.grid-stack').on('removed', (event, items) => {
                for (var i = 0; i < items.length; i++) {
                    this.removeItem(items[i]);
                }
            });
            let overHeader = false;
            const mouseEnterHandler = () => {
                overHeader = true;
            };
            const mouseLeftHandler = () => {
                overHeader = false;
            };
            $('.grid-stack').on('dragstart', (event, items) => {
                overHeader = false;
                $('.app-station-header').on('mouseenter', mouseEnterHandler);
                $('.app-station-header').on('mouseleave', mouseLeftHandler);
                state_engine_1.default.set("grid-dragging", true);
            });
            $('.grid-stack').on('dragstop', (event, items) => {
                $('.app-station-header').off('mouseenter', mouseEnterHandler);
                $('.app-station-header').off('mouseleave', mouseLeftHandler);
                if (overHeader == true) {
                    $('.grid-stack').data('gridstack').removeWidget(event.target);
                }
                state_engine_1.default.set("grid-dragging", false);
            });
        });
        this.setClass("app-station-grid");
    }
    onStateChange() {
        return (state, property, value) => {
            switch (property) {
                case "installed-apps":
                    this.syncApps(value);
                    break;
                case "fullscreen-app":
                    this.fullscreenApp(value);
                    break;
            }
        };
    }
    fullscreenApp(app) {
        const grid = $('.grid-stack').data('gridstack');
        if (app != null) {
            grid.disable();
            app.getContainer().classList.toggle("app-station-fullscreen");
            //app.getContainer().classList.toggle("grid-stack-item");
            app.getContentElement().classList.toggle("grid-stack-item-content");
            app.onFullScreen();
            document.querySelectorAll('.grid-stack-item').forEach((elem) => {
                if (elem.id != app.getId()) {
                    elem.style.display = 'none';
                }
            });
        }
        else {
            grid.enableMove(true);
            const gridStackChildren = document.querySelector('.grid-stack').children;
            let toWidgetId = null;
            for (let i = 0; i < gridStackChildren.length; i++) {
                const current = gridStackChildren[i];
                if (current.classList.contains("app-station-fullscreen")) {
                    toWidgetId = current.id;
                    current.classList.toggle("app-station-fullscreen");
                    //current.classList.toggle("grid-stack-item");
                    current.children[0].classList.toggle("grid-stack-item-content");
                    continue;
                }
                current.style.display = null;
            }
            const availableApps = state_engine_1.default.get("available-apps");
            availableApps.forEach(app => {
                if (app.getId() == toWidgetId) {
                    this.registerOnClickEvent(app);
                    app.onWidget();
                }
            });
        }
    }
    registerOnClickEvent(app) {
        const handler = (event, ui) => {
            $(app.getContainer()).off('click', handler);
            location.hash = app.getId();
            //stateEngine.set("fullscreen-app", app);
        };
        $(app.getContainer()).on('click', handler);
    }
    syncApps(apps) {
        const grid = $('.grid-stack').data('gridstack');
        const items = document.querySelectorAll('.grid-stack-item');
        if (items.length != 0) {
            const toRemove = [];
            for (let i = 0; i < items.length; i++) {
                if (apps.filter(app => app.getId() == items[i].id).length == 0) {
                    toRemove.push(items[i].id);
                }
            }
            const availableApps = state_engine_1.default.get("available-apps");
            if (availableApps != null) {
                availableApps.forEach(app => {
                    if (toRemove.indexOf(app.getId()) != -1) {
                        if ($(app.getContainer()) != null) {
                            grid.removeWidget(app.getContainer());
                        }
                        app.onWidgetRemoved();
                    }
                });
            }
        }
        if (apps != null) {
            apps.forEach(app => {
                if (document.querySelector(`#${app.getId()}`) == null) {
                    const gridOptions = app.getGridStackOptions();
                    grid.addWidget(app.getContainer(), gridOptions.x, gridOptions.y, gridOptions.width, gridOptions.height, gridOptions.autoPosition, null, null, null, null, gridOptions.id);
                    if (app.isFullScreenApp() == true) {
                        this.registerOnClickEvent(app);
                    }
                    app.onWidgetCreated();
                    grid.resizable(app.getContainer(), false);
                }
            });
        }
    }
    serializeGridState() {
        const items = document.querySelectorAll('.grid-stack-item');
        if (items.length != this.widgetCount) {
            this.widgetCount = items.length;
        }
        else {
            const installedApps = state_engine_1.default.get("installed-apps");
            const newInstalledApps = new Array();
            items.forEach(item => {
                const filtered = installedApps.filter(app => app.getId() == item.id);
                if (filtered != null && filtered.length != 0) {
                    const app = filtered[0];
                    app.setX(parseInt(item.getAttribute("data-gs-x")));
                    app.setY(parseInt(item.getAttribute("data-gs-y")));
                    app.setAutoPosition(false);
                    newInstalledApps.push(app);
                }
            });
            state_engine_1.default.set("installed-apps", newInstalledApps);
            app_grid_service_1.default.saveInstalledGrid();
        }
    }
}
exports.default = Grid;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(0);
const state_engine_1 = __webpack_require__(1);
const firebase = __webpack_require__(2);
class Header extends component_1.default {
    getInnerHTML() {
        return `
            <svg id="${this.getId()}-menu" class="app-station-header-menu" version="1.0" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 128.000000 128.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" fill="#666" stroke="none"> <path d="M30 1253 c-8 -3 -18 -11 -22 -17 -13 -19 -9 -221 4 -234 17 -17 1239 -17 1256 0 15 15 16 216 2 238 -8 13 -89 15 -617 17 -334 1 -615 -1 -623 -4z"/> <path d="M12 758 c-16 -16 -16 -220 0 -236 17 -17 1239 -17 1256 0 16 16 16 220 0 236 -17 17 -1239 17 -1256 0z"/> <path d="M12 278 c-15 -15 -16 -216 -2 -238 8 -13 89 -15 630 -15 541 0 622 2 630 15 14 22 13 223 -2 238 -17 17 -1239 17 -1256 0z"/> </g> </svg>
            <span id="${this.getId()}-title" class="app-station-header-title">App Station <span id="${this.getId()}-fullscreen-app"></span></span>
            <span id="${this.getId()}-photo" class="app-station-header-photo"></span>
            <svg id="${this.getId()}-apps" class="app-station-header-apps" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#666" id="Core" transform="translate(-340.000000, -4.000000)"><g id="apps" transform="translate(340.000000, 4.000000)"><path d="M0,4 L4,4 L4,0 L0,0 L0,4 L0,4 Z M6,16 L10,16 L10,12 L6,12 L6,16 L6,16 Z M0,16 L4,16 L4,12 L0,12 L0,16 L0,16 Z M0,10 L4,10 L4,6 L0,6 L0,10 L0,10 Z M6,10 L10,10 L10,6 L6,6 L6,10 L6,10 Z M12,0 L12,4 L16,4 L16,0 L12,0 L12,0 Z M6,4 L10,4 L10,0 L6,0 L6,4 L6,4 Z M12,10 L16,10 L16,6 L12,6 L12,10 L12,10 Z M12,16 L16,16 L16,12 L12,12 L12,16 L12,16 Z" id="Shape"/></g></g></g></svg>
            <svg  id="${this.getId()}-trash" class="app-station-header-trash" fill="#000000" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        `;
    }
    afterRendered() {
        this.setClass("app-station-header");
        this.photo = this.getContainer().querySelector(`#${this.getId()}-photo`);
        this.photo.onclick = () => {
            firebase.auth().signOut().then(function () {
                state_engine_1.default.set("user", null);
            }).catch(function (error) {
                // An error happened.
            });
        };
        this.menu = this.getContainer().querySelector(`#${this.getId()}-menu`);
        this.menu.onclick = () => {
            state_engine_1.default.set("app-list-menu-visible", true);
        };
        this.fullscreenApp = this.getContainer().querySelector(`#${this.getId()}-fullscreen-app`);
        this.fullscreenApp.style.display = 'none';
        this.apps = this.getContainer().querySelector(`#${this.getId()}-apps`);
        this.apps.onclick = () => {
            //stateEngine.set("fullscreen-app", null);
            location.hash = '';
        };
        this.apps.style.display = 'none';
        this.trash = this.getContainer().querySelector(`#${this.getId()}-trash`);
        this.trash.style.display = 'none';
        this.titleElement = this.getContainer().querySelector(`#${this.getId()}-title`);
    }
    onStateChange() {
        return (state, property, value) => {
            if (property == "user") {
                if (value != null) {
                    this.photo.style.content = `url(${value.photoURL})`;
                }
            }
            else if (property == "installed-apps") {
                const availableApps = state_engine_1.default.get("available-apps");
                if (value != null && availableApps != null) {
                    this.menu.style.display = value.length == availableApps.length ? 'none' : null;
                }
            }
            else if (property == "fullscreen-app") {
                if (value == null) {
                    this.fullscreenApp.style.display = 'none';
                    this.apps.style.display = 'none';
                }
                else {
                    this.fullscreenApp.style.display = null;
                    this.fullscreenApp.innerHTML = `\\\ ${value.getName()}`;
                    this.apps.style.display = null;
                }
            }
            else if (property == "grid-dragging") {
                this.checkTrashDisplay(value);
            }
            else if (property == "app-station-name") {
                this.titleElement.innerHTML = value;
            }
        };
    }
    checkTrashDisplay(gridDragging) {
        if (gridDragging == true) {
            this.menu.style.display = 'none';
            this.titleElement.style.display = 'none';
            this.photo.style.display = 'none';
            this.trash.style.display = null;
        }
        else {
            this.menu.style.display = null;
            this.titleElement.style.display = null;
            this.photo.style.display = null;
            this.trash.style.display = 'none';
        }
    }
}
exports.default = Header;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(0);
class Loading extends component_1.default {
    getInnerHTML() {
        return `<svg width='42px' height='42px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-hourglass"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g><path fill="none" stroke="#007282" stroke-width="5" stroke-miterlimit="10" d="M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z" class="glass"></path><clipPath id="uil-hourglass-clip1"><rect x="15" y="20" width="70" height="25" class="clip"><animate attributeName="height" from="25" to="0" dur="1s" repeatCount="indefinite" values="25;0;0" keyTimes="0;0.5;1"></animate><animate attributeName="y" from="20" to="45" dur="1s" repeatCount="indefinite" values="20;45;45" keyTimes="0;0.5;1"></animate></rect></clipPath><clipPath id="uil-hourglass-clip2"><rect x="15" y="55" width="70" height="25" class="clip"><animate attributeName="height" from="0" to="25" dur="1s" repeatCount="indefinite" values="0;25;25" keyTimes="0;0.5;1"></animate><animate attributeName="y" from="80" to="55" dur="1s" repeatCount="indefinite" values="80;55;55" keyTimes="0;0.5;1"></animate></rect></clipPath><path d="M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z" clip-path="url(#uil-hourglass-clip1)" fill="#ffab00" class="sand"></path><path d="M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z" clip-path="url(#uil-hourglass-clip2)" fill="#ffab00" class="sand"></path><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="180 50 50" repeatCount="indefinite" dur="1s" values="0 50 50;0 50 50;180 50 50" keyTimes="0;0.7;1"></animateTransform></g></svg>`;
    }
    afterRendered() {
        this.setClass("app-station-loading");
    }
    onStateChange() {
        return (state, property, value) => {
            if (property == "user") {
                this.getContainer().style.display = 'none';
            }
        };
    }
}
exports.default = Loading;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __webpack_require__(0);
const firebase = __webpack_require__(2);
class Login extends component_1.default {
    getInnerHTML() {
        return `
            <span id="${this.getId()}-title" class="app-station-login-title">App Station</span>
        `;
    }
    createLoginButton(provider) {
        const button = document.createElement("div");
        button.className = 'app-station-login-button';
        let buttonText = null;
        if (provider instanceof firebase.auth.EmailAuthProvider) {
            buttonText = 'Sign in with email';
        }
        else if (provider instanceof firebase.auth.GoogleAuthProvider) {
            buttonText = `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="118px" height="120px" viewBox="0 0 118 120" version="1.1">
                    <!-- Generator: Sketch 3.6 (26304) - http://www.bohemiancoding.com/sketch -->
                    <title>google_buttn</title>
                    <desc>Created with Sketch.</desc>
                    <defs/>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Artboard-1" transform="translate(-332.000000, -639.000000)">
                            <g id="google_buttn" transform="translate(332.000000, 639.000000)">
                                <g id="logo_googleg_48dp">
                                    <path d="M117.6,61.3636364 C117.6,57.1090909 117.218182,53.0181818 116.509091,49.0909091 L60,49.0909091 L60,72.3 L92.2909091,72.3 C90.9,79.8 86.6727273,86.1545455 80.3181818,90.4090909 L80.3181818,105.463636 L99.7090909,105.463636 C111.054545,95.0181818 117.6,79.6363636 117.6,61.3636364 L117.6,61.3636364 Z" id="Shape" fill="#4285F4"/>
                                    <path d="M60,120 C76.2,120 89.7818182,114.627273 99.7090909,105.463636 L80.3181818,90.4090909 C74.9454545,94.0090909 68.0727273,96.1363636 60,96.1363636 C44.3727273,96.1363636 31.1454545,85.5818182 26.4272727,71.4 L6.38181818,71.4 L6.38181818,86.9454545 C16.2545455,106.554545 36.5454545,120 60,120 L60,120 Z" id="Shape" fill="#34A853"/>
                                    <path d="M26.4272727,71.4 C25.2272727,67.8 24.5454545,63.9545455 24.5454545,60 C24.5454545,56.0454545 25.2272727,52.2 26.4272727,48.6 L26.4272727,33.0545455 L6.38181818,33.0545455 C2.31818182,41.1545455 0,50.3181818 0,60 C0,69.6818182 2.31818182,78.8454545 6.38181818,86.9454545 L26.4272727,71.4 L26.4272727,71.4 Z" id="Shape" fill="#FBBC05"/>
                                    <path d="M60,23.8636364 C68.8090909,23.8636364 76.7181818,26.8909091 82.9363636,32.8363636 L100.145455,15.6272727 C89.7545455,5.94545455 76.1727273,0 60,0 C36.5454545,0 16.2545455,13.4454545 6.38181818,33.0545455 L26.4272727,48.6 C31.1454545,34.4181818 44.3727273,23.8636364 60,23.8636364 L60,23.8636364 Z" id="Shape" fill="#EA4335"/>
                                    <path d="M0,0 L120,0 L120,120 L0,120 L0,0 Z" id="Shape"/>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
                <span>Sign in with Google</span>
            `;
        }
        else if (provider instanceof firebase.auth.FacebookAuthProvider) {
            buttonText = 'Sign in with Facebook';
        }
        else if (provider instanceof firebase.auth.TwitterAuthProvider) {
            buttonText = 'Sign in with Twitter';
        }
        else if (provider instanceof firebase.auth.GithubAuthProvider) {
            buttonText = 'Sign in with Github';
        }
        else if (provider instanceof firebase.auth.PhoneAuthProvider) {
            buttonText = 'Sign in with phone';
        }
        button.innerHTML = buttonText;
        button.onclick = () => {
            firebase.auth().signInWithRedirect(provider);
        };
        return button;
    }
    buildLoginButtons(value) {
        const { email, phone, google, facebook, twitter, github } = value;
        if (email == true) {
            const provider = new firebase.auth.EmailAuthProvider;
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (phone == true) {
            const provider = new firebase.auth.PhoneAuthProvider();
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (google == true) {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (facebook == true) {
            const provider = new firebase.auth.FacebookAuthProvider();
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (twitter == true) {
            const provider = new firebase.auth.TwitterAuthProvider();
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
        if (github == true) {
            const provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('repo');
            const button = this.createLoginButton(provider);
            this.getContainer().appendChild(button);
        }
    }
    onStateChange() {
        return (state, property, value) => {
            if (property == "user") {
                this.getContainer().style.display = value != null ? 'none' : null;
            }
            else if (property == "login-providers") {
                this.buildLoginButtons(value);
            }
            else if (property == "app-station-name") {
                this.titleElement.innerHTML = value;
            }
        };
    }
    afterRendered() {
        this.getContainer().className = "app-station-login";
        this.titleElement = this.getContainer().querySelector(`#${this.getId()}-title`);
        this.getContainer().style.display = 'none';
    }
}
exports.Login = Login;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ })
/******/ ]);