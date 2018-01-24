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
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./web/vue/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_axios@0.17.1@axios/index.js":
/*!***************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/index.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/_axios@0.17.1@axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/adapters/xhr.js":
/*!**************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/adapters/xhr.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/_axios@0.17.1@axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/_axios@0.17.1@axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/_axios@0.17.1@axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/_axios@0.17.1@axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/_axios@0.17.1@axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/_axios@0.17.1@axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("development" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/_axios@0.17.1@axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/axios.js":
/*!*******************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/axios.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/_axios@0.17.1@axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/_axios@0.17.1@axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/_axios@0.17.1@axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/_axios@0.17.1@axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/_axios@0.17.1@axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/_axios@0.17.1@axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/_axios@0.17.1@axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/cancel/Cancel.js":
/*!***************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/cancel/Cancel.js ***!
  \***************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/cancel/CancelToken.js":
/*!********************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/cancel/CancelToken.js ***!
  \********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/_axios@0.17.1@axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/cancel/isCancel.js":
/*!*****************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/cancel/isCancel.js ***!
  \*****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/Axios.js":
/*!************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/Axios.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/_axios@0.17.1@axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/_axios@0.17.1@axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/_axios@0.17.1@axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/InterceptorManager.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/InterceptorManager.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/createError.js":
/*!******************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/createError.js ***!
  \******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/_axios@0.17.1@axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/dispatchRequest.js":
/*!**********************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/dispatchRequest.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/_axios@0.17.1@axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/_axios@0.17.1@axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/_axios@0.17.1@axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/_axios@0.17.1@axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/_axios@0.17.1@axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/enhanceError.js":
/*!*******************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/enhanceError.js ***!
  \*******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/settle.js":
/*!*************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/settle.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/_axios@0.17.1@axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/core/transformData.js":
/*!********************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/core/transformData.js ***!
  \********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/defaults.js":
/*!**********************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/defaults.js ***!
  \**********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/_axios@0.17.1@axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/_axios@0.17.1@axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/_axios@0.17.1@axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../_process@0.11.10@process/browser.js */ "./node_modules/_process@0.11.10@process/browser.js")))

/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/bind.js":
/*!**************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/bind.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/btoa.js":
/*!**************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/btoa.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/buildURL.js":
/*!******************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/buildURL.js ***!
  \******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/combineURLs.js":
/*!*********************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/combineURLs.js ***!
  \*********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/cookies.js":
/*!*****************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/cookies.js ***!
  \*****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/isAbsoluteURL.js":
/*!***********************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/isAbsoluteURL.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/isURLSameOrigin.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/isURLSameOrigin.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/normalizeHeaderName.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/normalizeHeaderName.js ***!
  \*****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/parseHeaders.js":
/*!**********************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/parseHeaders.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/_axios@0.17.1@axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/helpers/spread.js":
/*!****************************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/helpers/spread.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/_axios@0.17.1@axios/lib/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/_axios@0.17.1@axios/lib/utils.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/_axios@0.17.1@axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/_is-buffer@1.1.6@is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/_babel-loader@7.1.2@babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":\"> 1%\",\"uglify\":true},\"useBuiltIns\":true}]],\"plugins\":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/App.vue":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@7.1.2@babel-loader/lib?{"cacheDirectory":true,"presets":[["env",{"modules":false,"targets":{"browsers":"> 1%","uglify":true},"useBuiltIns":true}]],"plugins":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/App.vue ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'App'
});

/***/ }),

/***/ "./node_modules/_babel-loader@7.1.2@babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":\"> 1%\",\"uglify\":true},\"useBuiltIns\":true}]],\"plugins\":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/components/HelloWorld.vue":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@7.1.2@babel-loader/lib?{"cacheDirectory":true,"presets":[["env",{"modules":false,"targets":{"browsers":"> 1%","uglify":true},"useBuiltIns":true}]],"plugins":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/components/HelloWorld.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'HelloWorld',
  data: function data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  }
});

/***/ }),

/***/ "./node_modules/_babel-loader@7.1.2@babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":\"> 1%\",\"uglify\":true},\"useBuiltIns\":true}]],\"plugins\":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/components/Login.vue":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_babel-loader@7.1.2@babel-loader/lib?{"cacheDirectory":true,"presets":[["env",{"modules":false,"targets":{"browsers":"> 1%","uglify":true},"useBuiltIns":true}]],"plugins":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/components/Login.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuelidate__ = __webpack_require__(/*! vuelidate */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuelidate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuelidate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuelidate_lib_validators__ = __webpack_require__(/*! vuelidate/lib/validators */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuelidate_lib_validators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vuelidate_lib_validators__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Login',
  mixins: [__WEBPACK_IMPORTED_MODULE_0_vuelidate__["validationMixin"]],
  data: function data() {
    return {
      form: {
        username: null,
        remember: true,
        password: null
      },
      sending: false,
      userSaved: false,
      lastUser: '',
      message: ''
    };
  },
  validations: {
    form: {
      username: {
        required: __WEBPACK_IMPORTED_MODULE_1_vuelidate_lib_validators__["required"]
      },
      password: {
        required: __WEBPACK_IMPORTED_MODULE_1_vuelidate_lib_validators__["required"]
      }
    }
  },
  methods: {
    getValidationClass: function getValidationClass(fieldName) {
      var field = this.$v.form[fieldName];
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        };
      }
    },
    login: function login() {
      var _this = this;

      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sending = true;
        this.axios.post('http://127.0.0.1:8000/user/login', {
          username: this.form.username,
          password: this.form.password,
          remember: this.form.remember
        }).then(function (response) {
          if (response.data.code === 200) {} else {
            _this.userSaved = true;
            _this.message = 'Invalid Username or Password.';
            window.setTimeout(function () {
              _this.userSaved = false;
            }, 3000);
          }
          console.log(response.data);
          _this.sending = false;
        });
      }
    },
    reset: function reset() {},
    register: function register() {}
  }
});

/***/ }),

/***/ "./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader/index.js?sourceMap!./node_modules/_css-loader@0.26.4@css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"importLoaders\":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5aa8a2b7\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/components/HelloWorld.vue":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{"omit":1,"remove":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader?sourceMap!./node_modules/_css-loader@0.26.4@css-loader?{"minimize":false,"sourceMap":true,"importLoaders":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler?{"vue":true,"id":"data-v-5aa8a2b7","scoped":true,"hasInlineConfig":false}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/components/HelloWorld.vue ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader/index.js?sourceMap!./node_modules/_css-loader@0.26.4@css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"importLoaders\":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5ea8ff9f\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/App.vue":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{"omit":1,"remove":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader?sourceMap!./node_modules/_css-loader@0.26.4@css-loader?{"minimize":false,"sourceMap":true,"importLoaders":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler?{"vue":true,"id":"data-v-5ea8ff9f","scoped":false,"hasInlineConfig":false}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/App.vue ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader/index.js?sourceMap!./node_modules/_css-loader@0.26.4@css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"importLoaders\":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fe76003c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/_resolve-url-loader@2.2.1@resolve-url-loader/index.js?{\"sourceMap\":true}!./node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js?{\"sourceMap\":true}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/components/Login.vue":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{"omit":1,"remove":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader?sourceMap!./node_modules/_css-loader@0.26.4@css-loader?{"minimize":false,"sourceMap":true,"importLoaders":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler?{"vue":true,"id":"data-v-fe76003c","scoped":true,"hasInlineConfig":false}!./node_modules/_resolve-url-loader@2.2.1@resolve-url-loader?{"sourceMap":true}!./node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js?{"sourceMap":true}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/components/Login.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/_is-buffer@1.1.6@is-buffer/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/_is-buffer@1.1.6@is-buffer/index.js ***!
  \**********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/_process@0.11.10@process/browser.js":
/*!**********************************************************!*\
  !*** ./node_modules/_process@0.11.10@process/browser.js ***!
  \**********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/_setimmediate@1.0.5@setimmediate/setImmediate.js":
/*!***********************************************************************!*\
  !*** ./node_modules/_setimmediate@1.0.5@setimmediate/setImmediate.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../_webpack@3.10.0@webpack/buildin/global.js */ "./node_modules/_webpack@3.10.0@webpack/buildin/global.js"), __webpack_require__(/*! ./../_process@0.11.10@process/browser.js */ "./node_modules/_process@0.11.10@process/browser.js")))

/***/ }),

/***/ "./node_modules/_timers-browserify@2.0.4@timers-browserify/main.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_timers-browserify@2.0.4@timers-browserify/main.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/_setimmediate@1.0.5@setimmediate/setImmediate.js");
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),

/***/ "./node_modules/_vue-axios@2.0.2@vue-axios/dist/vue-axios.min.js":
/*!***********************************************************************!*\
  !*** ./node_modules/_vue-axios@2.0.2@vue-axios/dist/vue-axios.min.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};!function(){function o(e,t){if(!o.installed){if(o.installed=!0,!t)return void console.error("You have to install axios");e.axios=t,Object.defineProperties(e.prototype,{axios:{get:function(){return t}},$http:{get:function(){return t}}})}}"object"==( false?"undefined":_typeof(exports))?module.exports=o: true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return o}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):window.Vue&&window.axios&&Vue.use(o,window.axios)}();

/***/ }),

/***/ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer.js":
/*!********************************************************************************!*\
  !*** ./node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer.js ***!
  \********************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-5aa8a2b7\",\"hasScoped\":true,\"buble\":{\"transforms\":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/components/HelloWorld.vue":
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler?{"id":"data-v-5aa8a2b7","hasScoped":true,"buble":{"transforms":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/components/HelloWorld.vue ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "hello" }, [
    _c("h1", [_vm._v(_vm._s(_vm.msg))]),
    _vm._v(" "),
    _c("h2", [_vm._v("Essential Links")]),
    _vm._v(" "),
    _vm._m(0),
    _vm._v(" "),
    _c("h2", [_vm._v("Ecosystem")]),
    _vm._v(" "),
    _vm._m(1)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("ul", [
      _c("li", [
        _c("a", { attrs: { href: "https://vuejs.org", target: "_blank" } }, [
          _vm._v("\n        Core Docs\n      ")
        ])
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          { attrs: { href: "https://forum.vuejs.org", target: "_blank" } },
          [_vm._v("\n        Forum\n      ")]
        )
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          { attrs: { href: "https://chat.vuejs.org", target: "_blank" } },
          [_vm._v("\n        Community Chat\n      ")]
        )
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          { attrs: { href: "https://twitter.com/vuejs", target: "_blank" } },
          [_vm._v("\n        Twitter\n      ")]
        )
      ]),
      _vm._v(" "),
      _c("br"),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          {
            attrs: {
              href: "http://vuejs-templates.github.io/webpack/",
              target: "_blank"
            }
          },
          [_vm._v("\n        Docs for This Template\n      ")]
        )
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("ul", [
      _c("li", [
        _c(
          "a",
          { attrs: { href: "http://router.vuejs.org/", target: "_blank" } },
          [_vm._v("\n        vue-router\n      ")]
        )
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          { attrs: { href: "http://vuex.vuejs.org/", target: "_blank" } },
          [_vm._v("\n        vuex\n      ")]
        )
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          { attrs: { href: "http://vue-loader.vuejs.org/", target: "_blank" } },
          [_vm._v("\n        vue-loader\n      ")]
        )
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          {
            attrs: {
              href: "https://github.com/vuejs/awesome-vue",
              target: "_blank"
            }
          },
          [_vm._v("\n        awesome-vue\n      ")]
        )
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-5aa8a2b7", esExports)
  }
}

/***/ }),

/***/ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-5ea8ff9f\",\"hasScoped\":false,\"buble\":{\"transforms\":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/App.vue":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler?{"id":"data-v-5ea8ff9f","hasScoped":false,"buble":{"transforms":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/App.vue ***!
  \****************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "app" } }, [_c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-5ea8ff9f", esExports)
  }
}

/***/ }),

/***/ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-fe76003c\",\"hasScoped\":true,\"buble\":{\"transforms\":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/components/Login.vue":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler?{"id":"data-v-fe76003c","hasScoped":true,"buble":{"transforms":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/components/Login.vue ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "login" }, [
    _c(
      "form",
      {
        staticClass: "md-layout-row md-gutter",
        attrs: { novalidate: "" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.login($event)
          }
        }
      },
      [
        _c(
          "md-card",
          { staticClass: "md-flex-50 md-flex-small-100" },
          [
            _c(
              "md-card-header",
              [
                _c("md-card-header-text", [
                  _c("div", { staticClass: "md-subtitle" }, [
                    _c("img", {
                      staticStyle: { width: "30%" },
                      attrs: { src: __webpack_require__(/*! ../assets/logo.png */ "./web/vue/assets/logo.png") }
                    })
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "md-title" }, [_vm._v("Login")])
                ])
              ],
              1
            ),
            _vm._v(" "),
            _c("md-card-content", [
              _c(
                "div",
                { staticClass: "md-layout-row md-layout-wrap md-gutter" },
                [
                  _c(
                    "div",
                    { staticClass: "md-flex md-flex-small-100" },
                    [
                      _c(
                        "md-field",
                        { class: _vm.getValidationClass("username") },
                        [
                          _c("label", { attrs: { for: "username" } }, [
                            _vm._v("Username")
                          ]),
                          _vm._v(" "),
                          _c("md-input", {
                            attrs: {
                              name: "username",
                              id: "username",
                              autocomplete: "username",
                              disabled: _vm.sending
                            },
                            model: {
                              value: _vm.form.username,
                              callback: function($$v) {
                                _vm.$set(_vm.form, "username", $$v)
                              },
                              expression: "form.username"
                            }
                          }),
                          _vm._v(" "),
                          !_vm.$v.form.username.required
                            ? _c("span", { staticClass: "md-error" }, [
                                _vm._v("Username is required.")
                              ])
                            : _vm._e()
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "md-flex md-flex-small-100" },
                    [
                      _c(
                        "md-field",
                        { class: _vm.getValidationClass("password") },
                        [
                          _c("label", { attrs: { for: "password" } }, [
                            _vm._v("Password")
                          ]),
                          _vm._v(" "),
                          _c("md-input", {
                            attrs: {
                              name: "password",
                              id: "password",
                              autocomplete: "password",
                              disabled: _vm.sending,
                              type: "password"
                            },
                            model: {
                              value: _vm.form.password,
                              callback: function($$v) {
                                _vm.$set(_vm.form, "password", $$v)
                              },
                              expression: "form.password"
                            }
                          }),
                          _vm._v(" "),
                          !_vm.$v.form.password.required
                            ? _c("span", { staticClass: "md-error" }, [
                                _vm._v("Password is required")
                              ])
                            : _vm._e()
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "md-flex md-flex-small-100" },
                    [
                      _c(
                        "md-checkbox",
                        {
                          staticClass: "md-primary",
                          staticStyle: { width: "100%" },
                          attrs: { disabled: _vm.sending },
                          model: {
                            value: _vm.form.remember,
                            callback: function($$v) {
                              _vm.$set(_vm.form, "remember", $$v)
                            },
                            expression: "form.remember"
                          }
                        },
                        [_vm._v("Remember Me")]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "md-flex md-flex-small-100" },
                    [
                      _c(
                        "md-button",
                        {
                          staticClass: "md-raised md-primary",
                          staticStyle: { width: "90%" },
                          attrs: { type: "submit" }
                        },
                        [_vm._v("Login")]
                      )
                    ],
                    1
                  )
                ]
              )
            ]),
            _vm._v(" "),
            _vm.sending
              ? _c("md-progress-bar", { attrs: { "md-mode": "indeterminate" } })
              : _vm._e()
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "md-snackbar",
          {
            attrs: { "md-active": _vm.userSaved },
            on: {
              "update:mdActive": function($event) {
                _vm.userSaved = $event
              }
            }
          },
          [_vm._v(_vm._s(_vm.message))]
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-fe76003c", esExports)
  }
}

/***/ }),

/***/ "./node_modules/_vue-material@0.8.1@vue-material/dist/vue-material.js":
/*!****************************************************************************!*\
  !*** ./node_modules/_vue-material@0.8.1@vue-material/dist/vue-material.js ***!
  \****************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/*!
* Vue Material v0.8.1
* Made with love by Marcos Moura
* Released under the MIT License.
*/   
!(function(t,e){ true?module.exports=e(__webpack_require__(/*! vue */ "./node_modules/_vue@2.5.13@vue/dist/vue.esm.js")):"function"==typeof define&&define.amd?define(["vue"],e):"object"==typeof exports?exports.VueMaterial=e(require("vue")):t.VueMaterial=e(t.Vue)})(this,(function(t){return (function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=445)})([(function(t,e){t.exports=function(t,e,n,i,o){var a,r=t=t||{},s=typeof t.default;"object"!==s&&"function"!==s||(a=t,r=t.default);var d="function"==typeof r?r.options:r;e&&(d.render=e.render,d.staticRenderFns=e.staticRenderFns),i&&(d._scopeId=i);var l;if(o?(l=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},d._ssrRegister=l):n&&(l=n),l){var c=d.functional,u=c?d.render:d.beforeCreate;c?d.render=function(t,e){return l.call(e),u(t,e)}:d.beforeCreate=u?[].concat(u,l):[l]}return{esModule:a,exports:r,options:d}}}),(function(t,e,n){"use strict";function i(t){if(!t)return null;var e=t.mdTheme;return e||"md-theme"!==t.$options._componentTag||(e=t.mdName),e||i(t.$parent)}Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{mdTheme:String},computed:{mdEffectiveTheme:function(){return i(this)||this.$material.currentTheme},themeClass:function(){return this.$material.prefix+this.mdEffectiveTheme}},watch:{mdTheme:function(t){this.$material.useTheme(t)}},beforeMount:function(){var t=this.mdTheme;this.$material.useTheme(t||"default")}},t.exports=e.default}),(function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)}),(function(t,e,n){t.exports=!n(5)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))}),(function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)}),(function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}}),(function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}}),(function(t,e,n){var i=n(25),o=n(14);t.exports=function(t){return i(o(t))}}),(function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}}),(function(t,e,n){var i=n(13),o=n(31),a=n(27),r=Object.defineProperty;e.f=n(3)?Object.defineProperty:function(t,e,n){if(i(t),e=a(e,!0),i(n),o)try{return r(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}}),(function(t,e,n){var i=n(9),o=n(17);t.exports=n(3)?function(t,e,n){return i.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function t(e,n){return!(!e||!e.$el)&&(0!==e._uid&&(e.$el.classList.contains(n)?e:t(e.$parent,n)))};e.default=i,t.exports=e.default}),(function(t,e,n){var i=n(22)("wks"),o=n(20),a=n(2).Symbol,r="function"==typeof a;(t.exports=function(t){return i[t]||(i[t]=r&&a[t]||(r?a:o)("Symbol."+t))}).store=i}),(function(t,e,n){var i=n(6);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}}),(function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}}),(function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}}),(function(t,e,n){var i=n(2),o=n(4),a=n(29),r=n(10),s=function(t,e,n){var d,l,c,u=t&s.F,m=t&s.G,f=t&s.S,h=t&s.P,p=t&s.B,b=t&s.W,v=m?o:o[e]||(o[e]={}),g=v.prototype,E=m?i:f?i[e]:(i[e]||{}).prototype;m&&(n=e);for(d in n)(l=!u&&E&&void 0!==E[d])&&d in v||(c=l?E[d]:n[d],v[d]=m&&"function"!=typeof E[d]?n[d]:p&&l?a(c,i):b&&E[d]==c?(function(t){var e=function(e,n,i){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return t.apply(this,arguments)};return e.prototype=t.prototype,e})(c):h&&"function"==typeof c?a(Function.call,c):c,h&&((v.virtual||(v.virtual={}))[d]=c,t&s.R&&g&&!g[d]&&r(g,d,c)))};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s}),(function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}}),(function(t,e,n){var i=n(30),o=n(23);t.exports=Object.keys||function(t){return i(t,o)}}),(function(t,e,n){var i=n(22)("keys"),o=n(20);t.exports=function(t){return i[t]||(i[t]=o(t))}}),(function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}}),(function(t,e,n){var i=n(14);t.exports=function(t){return Object(i(t))}}),(function(t,e,n){var i=n(2),o=i["__core-js_shared__"]||(i["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}}),(function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")}),(function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}}),(function(t,e,n){var i=n(24);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}}),(function(t,e,n){var i=n(6),o=n(2).document,a=i(o)&&i(o.createElement);t.exports=function(t){return a?o.createElement(t):{}}}),(function(t,e,n){var i=n(6);t.exports=function(t,e){if(!i(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!i(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!i(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!i(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}}),(function(t,e,n){var i=n(15),o=Math.min;t.exports=function(t){return t>0?o(i(t),9007199254740991):0}}),(function(t,e,n){var i=n(35);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,o){return t.call(e,n,i,o)}}return function(){return t.apply(e,arguments)}}}),(function(t,e,n){var i=n(8),o=n(7),a=n(33)(!1),r=n(19)("IE_PROTO");t.exports=function(t,e){var n,s=o(t),d=0,l=[];for(n in s)n!=r&&i(s,n)&&l.push(n);for(;e.length>d;)i(s,n=e[d++])&&(~a(l,n)||l.push(n));return l}}),(function(t,e,n){t.exports=!n(3)&&!n(5)((function(){return 7!=Object.defineProperty(n(26)("div"),"a",{get:function(){return 7}}).a}))}),(function(t,e){t.exports={}}),(function(t,e,n){var i=n(7),o=n(28),a=n(34);t.exports=function(t){return function(e,n,r){var s,d=i(e),l=o(d.length),c=a(r,l);if(t&&n!=n){for(;l>c;)if((s=d[c++])!=s)return!0}else for(;l>c;c++)if((t||c in d)&&d[c]===n)return t||c||0;return!t&&-1}}}),(function(t,e,n){var i=n(15),o=Math.max,a=Math.min;t.exports=function(t,e){return t=i(t),t<0?o(t+e,0):a(t,e)}}),(function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){return Math.random().toString(36).slice(4)};e.default=i,t.exports=e.default}),(function(t,e,n){var i=n(9).f,o=n(8),a=n(12)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,a)&&i(t,a,{configurable:!0,value:e})}}),(function(t,e,n){t.exports={default:n(45),__esModule:!0}}),(function(t,e){e.f={}.propertyIsEnumerable}),(function(t,e){t.exports=!0}),(function(t,e){e.f=Object.getOwnPropertySymbols}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=(function(){var t=document.createElement("span"),e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var n in e)if(void 0!==t.style[n])return e[n]})(),t.exports=e.default}),(function(t,e,n){"use strict";var i=n(40),o=n(16),a=n(49),r=n(10),s=n(8),d=n(32),l=n(52),c=n(37),u=n(55),m=n(12)("iterator"),f=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,p,b,v,g){l(n,e,p);var E,_,C,M=function(t){if(!f&&t in y)return y[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},T=e+" Iterator",A="values"==b,x=!1,y=t.prototype,N=y[m]||y["@@iterator"]||b&&y[b],O=N||M(b),S=b?A?M("entries"):O:void 0,R="Array"==e?y.entries||N:N;if(R&&(C=u(R.call(new t)))!==Object.prototype&&(c(C,T,!0),i||s(C,m)||r(C,m,h)),A&&N&&"values"!==N.name&&(x=!0,O=function(){return N.call(this)}),i&&!g||!f&&!x&&y[m]||r(y,m,O),d[e]=O,d[T]=h,b)if(E={values:A?O:M("values"),keys:v?O:M("keys"),entries:S},g)for(_ in E)_ in y||a(y,_,E[_]);else o(o.P+o.F*(f||x),e,E);return E}}),(function(t,e,n){t.exports={default:n(56),__esModule:!0}}),(function(t,e,n){n(46),t.exports=n(4).Object.keys}),(function(t,e,n){var i=n(21),o=n(18);n(47)("keys",(function(){return function(t){return o(i(t))}}))}),(function(t,e,n){var i=n(16),o=n(4),a=n(5);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],r={};r[t]=e(n),i(i.S+i.F*a((function(){n(1)})),"Object",r)}}),(function(t,e,n){"use strict";var i=n(51)(!0);n(43)(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})}))}),(function(t,e,n){t.exports=n(10)}),(function(t,e,n){var i=n(13),o=n(53),a=n(23),r=n(19)("IE_PROTO"),s=function(){},d=function(){var t,e=n(26)("iframe"),i=a.length;for(e.style.display="none",n(54).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),d=t.F;i--;)delete d.prototype[a[i]];return d()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=i(t),n=new s,s.prototype=null,n[r]=t):n=d(),void 0===e?n:o(n,e)}}),(function(t,e,n){var i=n(15),o=n(14);t.exports=function(t){return function(e,n){var a,r,s=String(o(e)),d=i(n),l=s.length;return d<0||d>=l?t?"":void 0:(a=s.charCodeAt(d),a<55296||a>56319||d+1===l||(r=s.charCodeAt(d+1))<56320||r>57343?t?s.charAt(d):a:t?s.slice(d,d+2):r-56320+(a-55296<<10)+65536)}}}),(function(t,e,n){"use strict";var i=n(50),o=n(17),a=n(37),r={};n(10)(r,n(12)("iterator"),(function(){return this})),t.exports=function(t,e,n){t.prototype=i(r,{next:o(1,n)}),a(t,e+" Iterator")}}),(function(t,e,n){var i=n(9),o=n(13),a=n(18);t.exports=n(3)?Object.defineProperties:function(t,e){o(t);for(var n,r=a(e),s=r.length,d=0;s>d;)i.f(t,n=r[d++],e[n]);return t}}),(function(t,e,n){t.exports=n(2).document&&document.documentElement}),(function(t,e,n){var i=n(8),o=n(21),a=n(19)("IE_PROTO"),r=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),i(t,a)?t[a]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?r:null}}),(function(t,e,n){n(57),t.exports=n(4).Object.assign}),(function(t,e,n){var i=n(16);i(i.S+i.F,"Object",{assign:n(58)})}),(function(t,e,n){"use strict";var i=n(18),o=n(41),a=n(39),r=n(21),s=n(25),d=Object.assign;t.exports=!d||n(5)((function(){var t={},e={},n=Symbol(),i="abcdefghijklmnopqrst";return t[n]=7,i.split("").forEach((function(t){e[t]=t})),7!=d({},t)[n]||Object.keys(d({},e)).join("")!=i}))?function(t,e){for(var n=r(t),d=arguments.length,l=1,c=o.f,u=a.f;d>l;)for(var m,f=s(arguments[l++]),h=c?i(f).concat(c(f)):i(f),p=h.length,b=0;p>b;)u.call(f,m=h[b++])&&(n[m]=f[m]);return n}:d}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e){var n=!1;return function(){n||(t.call(),n=!0,window.setTimeout((function(){n=!1}),e))}};e.default=i,t.exports=e.default}),(function(t,e,n){var i=n(61),o=n(12)("iterator"),a=n(32);t.exports=n(4).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||a[i(t)]}}),(function(t,e,n){var i=n(24),o=n(12)("toStringTag"),a="Arguments"==i(function(){return arguments}()),r=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=r(e=Object(t),o))?n:a?i(e):"Object"==(s=i(e))&&"function"==typeof e.callee?"Arguments":s}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{value:[String,Number],debounce:{type:Number,default:100},disabled:Boolean,required:Boolean,maxlength:[Number,String],max:[Number,String],min:[Number,String],name:String,placeholder:String,readonly:Boolean},data:function(){return{timeout:0}},watch:{value:function(){this.updateValues()},disabled:function(){this.setParentDisabled()},required:function(){this.setParentRequired()},placeholder:function(){this.setParentPlaceholder()},maxlength:function(){this.handleMaxLength()},max:function(){this.handleMax()},min:function(){this.handleMin()}},methods:{handleMaxLength:function(){this.parentContainer.enableCounter=this.maxlength>0,this.parentContainer.counterLength=this.maxlength},handleMin:function(){this.parentContainer.min=this.min},handleMax:function(){this.parentContainer.min=this.max},lazyEventEmitter:function(){var t=this;this.timeout&&window.clearTimeout(this.timeout),this.timeout=window.setTimeout((function(){t.$emit("change",t.$el.value),t.$emit("input",t.$el.value)}),this.debounce)},setParentValue:function(t){this.parentContainer.setValue(t||this.$el.value)},setParentDisabled:function(){this.parentContainer.isDisabled=this.disabled},setParentRequired:function(){this.parentContainer.isRequired=this.required},setParentPlaceholder:function(){this.parentContainer.hasPlaceholder=!!this.placeholder},updateValues:function(){var t=this;this.$nextTick((function(){var e=t.$el.value||t.value;t.setParentValue(e),t.parentContainer.inputLength=e?e.length:0}))},onFocus:function(t){this.parentContainer&&(this.parentContainer.isFocused=!0),this.$emit("focus",this.$el.value,t)},onBlur:function(t){this.parentContainer.isFocused=!1,this.setParentValue(),this.$emit("blur",this.$el.value,t)},onInput:function(){this.updateValues(),this.lazyEventEmitter()}}},t.exports=e.default}),(function(t,e,n){e.f=n(12)}),(function(t,e,n){var i=n(2),o=n(4),a=n(40),r=n(63),s=n(9).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=a?{}:i.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:r.f(t)})}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e,n){var i=document.createElement("canvas");t.crossOrigin="Anonymous",t.onload=function(){var t=0,n=void 0,o=void 0,a=void 0,r=void 0,s=void 0,d=void 0,l=void 0;i.width=this.width,i.height=this.height,n=i.getContext("2d"),n.drawImage(this,0,0),o=n.getImageData(0,0,i.width,i.height),a=o.data;for(var c=0,u=a.length;c<u;c+=4)r=a[c],s=a[c+1],d=a[c+2],l=Math.floor((r+s+d)/3),t+=l;e(Math.floor(t/(this.width*this.height)))},t.onerror=n};e.default=i,t.exports=e.default}),(function(t,e,n){"use strict";e.__esModule=!0;var i=n(69),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,o.default)(t)}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){return t&&t.constructor===Array};e.default=i,t.exports=e.default}),(function(t,e,n){n(76);for(var i=n(2),o=n(10),a=n(32),r=n(12)("toStringTag"),s=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],d=0;d<5;d++){var l=s[d],c=i[l],u=c&&c.prototype;u&&!u[r]&&o(u,r,l),a[l]=a.Array}}),(function(t,e,n){t.exports={default:n(70),__esModule:!0}}),(function(t,e,n){n(48),n(71),t.exports=n(4).Array.from}),(function(t,e,n){"use strict";var i=n(29),o=n(16),a=n(21),r=n(72),s=n(73),d=n(28),l=n(74),c=n(60);o(o.S+o.F*!n(75)((function(t){Array.from(t)})),"Array",{from:function(t){var e,n,o,u,m=a(t),f="function"==typeof this?this:Array,h=arguments.length,p=h>1?arguments[1]:void 0,b=void 0!==p,v=0,g=c(m);if(b&&(p=i(p,h>2?arguments[2]:void 0,2)),void 0==g||f==Array&&s(g))for(e=d(m.length),n=new f(e);e>v;v++)l(n,v,b?p(m[v],v):m[v]);else for(u=g.call(m),n=new f;!(o=u.next()).done;v++)l(n,v,b?r(u,p,[o.value,v],!0):o.value);return n.length=v,n}})}),(function(t,e,n){var i=n(13);t.exports=function(t,e,n,o){try{return o?e(i(n)[0],n[1]):e(n)}catch(e){var a=t.return;throw void 0!==a&&i(a.call(t)),e}}}),(function(t,e,n){var i=n(32),o=n(12)("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||a[o]===t)}}),(function(t,e,n){"use strict";var i=n(9),o=n(17);t.exports=function(t,e,n){e in t?i.f(t,e,o(0,n)):t[e]=n}}),(function(t,e,n){var i=n(12)("iterator"),o=!1;try{var a=[7][i]();a.return=function(){o=!0},Array.from(a,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var a=[7],r=a[i]();r.next=function(){return{done:n=!0}},a[i]=function(){return r},t(a)}catch(t){}return n}}),(function(t,e,n){"use strict";var i=n(77),o=n(78),a=n(32),r=n(7);t.exports=n(43)(Array,"Array",(function(t,e){this._t=r(t),this._i=0,this._k=e}),(function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])}),"values"),a.Arguments=a.Array,i("keys"),i("values"),i("entries")}),(function(t,e){t.exports=function(){}}),(function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}}),(function(t,e,n){var i=n(30),o=n(23).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,o)}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){if(o.installed)return void console.warn("Vue Material is already installed.");o.installed=!0,t.use(r.default),t.use(d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(81),r=i(a),s=n(87),d=i(s),l=n(92),c=i(l);n(93),t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){console.warn("The theme '"+t+"' doesn't exists. You need to register it first in order to use.")}function a(t,e,n,i){p.createNewStyleElement&&(t=C(t,e,n),t=t.replace(/THEME_NAME/g,i),(0,p.createNewStyleElement)(t,i))}function r(t){t.material=new t({data:{currentTheme:null,inkRipple:!0,prefix:"md-theme-",styles:[],themes:{default:g}},watch:{styles:function(){this.refreshInjectedStyles()}},methods:{registerPalette:function(t,e){c.default[t]=e},useTheme:function(t){if(!(t in _)){var e=this.themes[t];return e?(a(this.styles.join("\n"),e,t,this.prefix+t),_[t]=!0):o(t)}},refreshInjectedStyles:function(){var t=this,e=this.styles.join("\n"),n=this.prefix;(0,d.default)(_).forEach((function(i){var o=t.themes[i];a(e,o,i,n+i)}))},registerTheme:function(t,e){var n=this;"string"==typeof t?this.themes[t]=e:(0,d.default)(t).forEach((function(e){return n.themes[e]=t[e]}))},setCurrentTheme:function(t){if(t!==this.currentTheme){var e=this.prefix;this.useTheme(t),p.changeHtmlMetaColor&&(0,p.changeHtmlMetaColor)(E[t],e+t,e+this.currentTheme),this.currentTheme=t}}},created:function(){this.setCurrentTheme("default")}}),t.component("md-theme",h.default),t.prototype.$material=t.material}Object.defineProperty(e,"__esModule",{value:!0});var s=n(38),d=i(s);e.default=r;var l=n(82),c=i(l),u=n(83),m=i(u),f=n(84),h=i(f),p=n(86),b=["primary","accent","background","warn","hue-1","hue-2","hue-3"],v=new RegExp("("+b.join("|").toUpperCase()+")-(COLOR|CONTRAST)-?(A?\\d*)-?(\\d*\\.?\\d+)?","g"),g={primary:"indigo",accent:"pink",background:"white",warn:"deep-orange"},E={},_={},C=function(t,e,n){return t.replace(v,(function(t,i,o,a,r){var s=void 0,d=0==+a?500:a;if(i=i.toLowerCase(),e[i]?"string"==typeof e[i]?s=c.default[e[i]]:(s=c.default[e[i].color]||c.default[g[i]],d=0==+a?e[i].hue:a):s=c.default[g[i]],"COLOR"===o){var l=c.default[e[i]];return d||l||("accent"===i?d="A200":"background"===i&&(d=50)),"primary"===i&&(E[n]=s[d]),r?(0,m.default)(s[d],r):s[d]}var u=s.darkText.indexOf(d)>=0;return e[i]&&"string"!=typeof e[i]&&e[i].textColor&&("black"===e[i].textColor?u=!0:"white"===e[i].textColor&&(u=!1)),u?r?(0,m.default)("#000",r):"rgba(0, 0, 0, .87)":r?(0,m.default)("#fff",r):"rgba(255, 255, 255, .87)"}))};t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={red:{50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",A100:"#ff8a80",A200:"#ff5252",A400:"#ff1744",A700:"#d50000",darkText:[50,100,200,300,"A100"]},pink:{50:"#fce4ec",100:"#f8bbd0",200:"#f48fb1",300:"#f06292",400:"#ec407a",500:"#e91e63",600:"#d81b60",700:"#c2185b",800:"#ad1457",900:"#880e4f",A100:"#ff80ab",A200:"#ff4081",A400:"#f50057",A700:"#c51162",darkText:[50,100,200,"A100"]},purple:{50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",A100:"#ea80fc",A200:"#e040fb",A400:"#d500f9",A700:"#aa00ff",darkText:[50,100,200,"A100"]},"deep-purple":{50:"#ede7f6",100:"#d1c4e9",200:"#b39ddb",300:"#9575cd",400:"#7e57c2",500:"#673ab7",600:"#5e35b1",700:"#512da8",800:"#4527a0",900:"#311b92",A100:"#b388ff",A200:"#7c4dff",A400:"#651fff",A700:"#6200ea",darkText:[50,100,200,"A100"]},indigo:{50:"#e8eaf6",100:"#c5cae9",200:"#9fa8da",300:"#7986cb",400:"#5c6bc0",500:"#3f51b5",600:"#3949ab",700:"#303f9f",800:"#283593",900:"#1a237e",A100:"#8c9eff",A200:"#536dfe",A400:"#3d5afe",A700:"#304ffe",darkText:[50,100,200,"A100"]},blue:{50:"#e3f2fd",100:"#bbdefb",200:"#90caf9",300:"#64b5f6",400:"#42a5f5",500:"#2196f3",600:"#1e88e5",700:"#1976d2",800:"#1565c0",900:"#0d47a1",A100:"#82b1ff",A200:"#448aff",A400:"#2979ff",A700:"#2962ff",darkText:[50,100,200,300,400,"A100"]},"light-blue":{50:"#e1f5fe",100:"#b3e5fc",200:"#81d4fa",300:"#4fc3f7",400:"#29b6f6",500:"#03a9f4",600:"#039be5",700:"#0288d1",800:"#0277bd",900:"#01579b",A100:"#80d8ff",A200:"#40c4ff",A400:"#00b0ff",A700:"#0091ea",darkText:[50,100,200,300,400,500,"A100","A200","A300"]},cyan:{50:"#e0f7fa",100:"#b2ebf2",200:"#80deea",300:"#4dd0e1",400:"#26c6da",500:"#00bcd4",600:"#00acc1",700:"#0097a7",800:"#00838f",900:"#006064",A100:"#84ffff",A200:"#18ffff",A400:"#00e5ff",A700:"#00b8d4",darkText:[50,100,200,300,400,500,600,"A100","A200","A300","A400"]},teal:{50:"#e0f2f1",100:"#b2dfdb",200:"#80cbc4",300:"#4db6ac",400:"#26a69a",500:"#009688",600:"#00897b",700:"#00796b",800:"#00695c",900:"#004d40",A100:"#a7ffeb",A200:"#64ffda",A400:"#1de9b6",A700:"#00bfa5",darkText:[50,100,200,300,400,"A100","A200","A300","A400"]},green:{50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",A100:"#b9f6ca",A200:"#69f0ae",A400:"#00e676",A700:"#00c853",darkText:[50,100,200,300,400,500,"A100","A200","A300","A400"]},"light-green":{50:"#f1f8e9",100:"#dcedc8",200:"#c5e1a5",300:"#aed581",400:"#9ccc65",500:"#8bc34a",600:"#7cb342",700:"#689f38",800:"#558b2f",900:"#33691e",A100:"#ccff90",A200:"#b2ff59",A400:"#76ff03",A700:"#64dd17",darkText:[50,100,200,300,400,500,600,"A100","A200","A300","A400"]},lime:{50:"#f9fbe7",100:"#f0f4c3",200:"#e6ee9c",300:"#dce775",400:"#d4e157",500:"#cddc39",600:"#c0ca33",700:"#afb42b",800:"#9e9d24",900:"#827717",A100:"#f4ff81",A200:"#eeff41",A400:"#c6ff00",A700:"#aeea00",darkText:[50,100,200,300,400,500,600,700,800,"A100","A200","A300","A400"]},yellow:{50:"#fffde7",100:"#fff9c4",200:"#fff59d",300:"#fff176",400:"#ffee58",500:"#ffeb3b",600:"#fdd835",700:"#fbc02d",800:"#f9a825",900:"#f57f17",A100:"#ffff8d",A200:"#ffff00",A400:"#ffea00",A700:"#ffd600",darkText:[50,100,200,300,400,500,600,700,800,900,"A100","A200","A300","A400"]},amber:{50:"#fff8e1",100:"#ffecb3",200:"#ffe082",300:"#ffd54f",400:"#ffca28",500:"#ffc107",600:"#ffb300",700:"#ffa000",800:"#ff8f00",900:"#ff6f00",A100:"#ffe57f",A200:"#ffd740",A400:"#ffc400",A700:"#ffab00",darkText:[50,100,200,300,400,500,600,700,800,900,"A100","A200","A300","A400"]},orange:{50:"#fff3e0",100:"#ffe0b2",200:"#ffcc80",300:"#ffb74d",400:"#ffa726",500:"#ff9800",600:"#fb8c00",700:"#f57c00",800:"#ef6c00",900:"#e65100",A100:"#ffd180",A200:"#ffab40",A400:"#ff9100",A700:"#ff6d00",darkText:[50,100,200,300,400,500,600,700,"A100","A200","A300","A400"]},"deep-orange":{50:"#fbe9e7",100:"#ffccbc",200:"#ffab91",300:"#ff8a65",400:"#ff7043",500:"#ff5722",600:"#f4511e",700:"#e64a19",800:"#d84315",900:"#bf360c",A100:"#ff9e80",A200:"#ff6e40",A400:"#ff3d00",A700:"#dd2c00",darkText:[50,100,200,300,400,"A100","A200"]},brown:{50:"#efebe9",100:"#d7ccc8",200:"#bcaaa4",300:"#a1887f",400:"#8d6e63",500:"#795548",600:"#6d4c41",700:"#5d4037",800:"#4e342e",900:"#3e2723",A100:"#d7ccc8",A200:"#bcaaa4",A400:"#8d6e63",A700:"#5d4037",darkText:[50,100,200,"A100","A200","A300","A400"]},grey:{50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121",A100:"#fff",A200:"#000000",A400:"#303030",A700:"#616161",darkText:[50,100,200,300,400,500,"A100"]},"blue-grey":{50:"#eceff1",100:"#cfd8dc",200:"#b0bec5",300:"#90a4ae",400:"#78909c",500:"#607d8b",600:"#546e7a",700:"#455a64",800:"#37474f",900:"#263238",A100:"#cfd8dc",A200:"#b0bec5",A400:"#78909c",A700:"#455a64",darkText:[50,100,200,300,"A100","A200","A300","A400"]},white:{50:"#fff",100:"#fff",200:"#fff",300:"#fff",400:"#fff",500:"#fff",600:"#fff",700:"#fff",800:"#fff",900:"#fff",A100:"#fff",A200:"#fff",A400:"#fff",A700:"#fff",darkText:[50,100,200,300,400,500,600,700,800,900,"A100","A200","A300","A400"]},black:{50:"#000",100:"#000",200:"#000",300:"#000",400:"#000",500:"#000",600:"#000",700:"#000",800:"#000",900:"#000",A100:"#000",A200:"#000",A400:"#000",A700:"#000",darkText:[]}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var n="",i="",o="",a=t.toString().match(/^#?(([0-9a-zA-Z]{3}){1,3})$/);if(!a)throw new Error("Invalid color"+t);if(t=a[1],6===t.length)n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),o=parseInt(t.substring(4,6),16);else if(3===t.length){var r=t.substring(0,1),s=t.substring(1,2),d=t.substring(2,3);n=parseInt(r+r,16),i=parseInt(s+s,16),o=parseInt(d+d,16)}return e?(e>1&&(e/=100),"rgba("+n+", "+i+", "+o+", "+e+")"):"rgb("+n+", "+i+", "+o+")"},t.exports=e.default}),(function(t,e,n){var i=n(0)(n(85),null,null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-theme",props:{mdTag:String,mdName:{type:String,default:"default"}},render:function(t){return this.mdTag||this.$slots.default.length>1?t(this.mdTag||"div",{staticClass:this.$material.prefix+this.mdName},this.$slots.default):this.$slots.default[0]},watch:{mdName:function(t){this.$material.useTheme(t)}},beforeMount:function(){var t=this.mdName;t&&this.$material.useTheme(t)}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.changeHtmlMetaColor=void 0,e.createNewStyleElement=void 0;"server"!==Object({NODE_ENV:"development"}).VUE_ENV&&(e.changeHtmlMetaColor=function(t,e,n){var i=document.querySelector('meta[name="theme-color"]');i?i.setAttribute("content",t):(i=document.createElement("meta"),i.setAttribute("name","theme-color"),i.setAttribute("content",t),document.head.appendChild(i)),document.body.classList.remove(n),document.body.classList.add(e)},e.createNewStyleElement=function(t,e){var n=document.head,i=n.querySelector("#"+e);if(i)i.textContent=t;else{var o=document.createElement("style");o.type="text/css",o.id=e,o.textContent=t,n.appendChild(o)}})}),(function(t,e,n){"use strict";function i(t){t.component("md-ink-ripple",a.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;var o=n(88),a=(function(t){return t&&t.__esModule?t:{default:t}})(o);t.exports=e.default}),(function(t,e,n){function i(t){n(89)}var o=n(0)(n(90),n(91),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e,n){"start"===e?(t.addEventListener("mousedown",n),t.addEventListener("touchstart",n)):(t.addEventListener("mouseup",n),t.addEventListener("touchend",n))},o=function(t,e,n){"start"===e?(t.removeEventListener("mousedown",n),t.removeEventListener("touchstart",n)):(t.removeEventListener("mouseup",n),t.removeEventListener("touchend",n))};e.default={name:"md-ink-ripple",props:{mdDisabled:Boolean},data:function(){return{mounted:!1,rippleElement:null,parentElement:null,parentDimensions:{width:null,height:null,top:null,left:null},awaitingComplete:!1,hasCompleted:!1,fadeOut:!1,active:!1}},computed:{classes:function(){return{"md-fadeout":this.fadeOut,"md-active":this.active}},styles:function(){return{width:this.parentDimensions.width,height:this.parentDimensions.height,top:this.parentDimensions.top,left:this.parentDimensions.left}},disabled:function(){return this.mdDisabled||!this.$material.inkRipple}},watch:{disabled:function(t){t?this.destroy():this.init()}},methods:{checkAvailablePositions:function(t){return["relative","absolute","fixed"].indexOf(getComputedStyle(t).position)>-1},getClosestPositionedParent:function(t){var e=t&&t.parentNode;return!(!e||"body"===e.tagName.toLowerCase())&&(this.checkAvailablePositions(t)?t:this.getClosestPositionedParent(e))},getParentSize:function(){var t=this.parentElement;return Math.round(Math.max(t.offsetWidth,t.offsetHeight))+"px"},getClickPosition:function(t){if(this.$refs.ripple){var e=this.parentElement.getBoundingClientRect(),n=t.pageY,i=t.pageX;return"touchstart"===t.type&&(n=t.changedTouches[0].pageY,i=t.changedTouches[0].pageX),{top:n-e.top-this.$refs.ripple.offsetHeight/2-document.body.scrollTop+"px",left:i-e.left-this.$refs.ripple.offsetWidth/2-document.body.scrollLeft+"px"}}return!1},setDimensions:function(){var t=this.getParentSize();this.parentDimensions.width=t,this.parentDimensions.height=t},setPositions:function(t){var e=this.getClickPosition(t);e&&(this.parentDimensions.top=e.top,this.parentDimensions.left=e.left)},clearState:function(){this.active=!1,this.fadeOut=!1,this.hasCompleted=!1,this.setDimensions(),window.clearTimeout(this.awaitingComplete),o(document.body,"end",this.endRipple)},startRipple:function(t){var e=this;"touchstart"===t.type?this.previous.push("touch"):this.previous.push("mouse"),this.previous=this.previous.splice(this.previous.length-2,this.previous.length),this.previous.length>=2&&"touch"===this.previous[1]&&"mouse"===this.previous[0]||(this.clearState(),this.awaitingComplete=window.setTimeout((function(){e.hasCompleted=!0}),400),i(document.body,"end",this.endRipple),this.$nextTick((function(){e.setPositions(t),e.active=!0})))},endRipple:function(){var t=this;this.hasCompleted?this.fadeOut=!0:this.awaitingComplete=window.setTimeout((function(){t.fadeOut=!0}),200),o(document.body,"end",this.endRipple)},registerTriggerEvent:function(){i(this.parentElement,"start",this.startRipple)},unregisterTriggerEvent:function(){this.parentElement&&o(this.parentElement,"start",this.startRipple)},init:function(){this.rippleElement=this.$el,this.parentElement=this.getClosestPositionedParent(this.$el.parentNode),this.previous=["mouse"],this.parentElement?(this.rippleElement.parentNode.removeChild(this.rippleElement),this.parentElement.querySelectorAll(".md-ink-ripple").length>0?this.$destroy():(this.parentElement.appendChild(this.rippleElement),this.registerTriggerEvent(),this.setDimensions())):this.$destroy()},destroy:function(){this.rippleElement&&this.rippleElement.parentNode&&(this.unregisterTriggerEvent(),this.rippleElement.parentNode.removeChild(this.rippleElement))}},mounted:function(){var t=this;window.setTimeout((function(){t.disabled?t.destroy():t.init(),t.$nextTick((function(){t.mounted=!0}))}),100)},beforeDestroy:function(){this.destroy()}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.mounted||!t.disabled?n("div",{staticClass:"md-ink-ripple"},[n("div",{ref:"ripple",staticClass:"md-ripple",class:t.classes,style:t.styles})]):t._e()},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME :not(input):not(textarea)::selection{background:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME a:not(.md-button){color:ACCENT-COLOR}.THEME_NAME a:not(.md-button):hover{color:ACCENT-COLOR-800}body.THEME_NAME{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST-0.87}.THEME_NAME .md-caption,.THEME_NAME .md-display-1,.THEME_NAME .md-display-2,.THEME_NAME .md-display-3,.THEME_NAME .md-display-4{color:BACKGROUND-CONTRAST-0.57}.THEME_NAME code:not(.hljs){background-color:ACCENT-COLOR-A100-0.2;color:ACCENT-COLOR-800}\n"}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-avatar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(95),r=i(a),s=n(99),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(96)}var o=n(0)(n(97),n(98),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-avatar",mixins:[o.default]},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-avatar",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-avatar.md-primary.md-avatar-icon{background-color:PRIMARY-COLOR}.THEME_NAME.md-avatar.md-primary.md-avatar-icon .md-icon{color:PRIMARY-CONTRAST-0.99999}.THEME_NAME.md-avatar.md-accent.md-avatar-icon{background-color:ACCENT-COLOR}.THEME_NAME.md-avatar.md-accent.md-avatar-icon .md-icon{color:ACCENT-CONTRAST-0.99999}.THEME_NAME.md-avatar.md-warn.md-avatar-icon{background-color:WARN-COLOR}.THEME_NAME.md-avatar.md-warn.md-avatar-icon .md-icon{color:WARN-CONTRAST-0.99999}\n"}),(function(t,e,n){"use strict";function i(t){t.component("md-backdrop",a.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;var o=n(101),a=(function(t){return t&&t.__esModule?t:{default:t}})(o);t.exports=e.default}),(function(t,e,n){function i(t){n(102)}var o=n(0)(n(103),n(104),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-backdrop",methods:{close:function(){this.$emit("close")}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-backdrop",on:{click:t.close,keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;t.close(e)}}})},staticRenderFns:[]}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-bottom-bar",r.default),t.component("md-bottom-bar-item",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(106),r=i(a),s=n(110),d=i(s),l=n(113),c=i(l);t.exports=e.default}),(function(t,e,n){function i(t){n(107)}var o=n(0)(n(108),n(109),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-bottom-bar",props:{mdShift:Boolean},mixins:[o.default],computed:{classes:function(){return this.mdShift?"md-shift":"md-fixed"}},methods:{setActive:function(t){this.$children.forEach((function(e){e.active=e===t})),this.$emit("change",this.$children.findIndex((function(e){return e===t})))}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-bottom-bar",class:[t.themeClass,t.classes]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(111),n(112),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-bottom-bar-item",props:{mdIcon:String,mdIconSrc:String,mdIconset:String,mdActive:Boolean,disabled:Boolean,href:String},data:function(){return{active:!1}},computed:{classes:function(){return{"md-active":this.active}}},watch:{mdActive:function(t){this.setActive(t)}},methods:{setActive:function(t,e){t&&this.$parent.setActive(this),e&&this.$emit("click",e)}},mounted:function(){if(!this.$parent.$el.classList.contains("md-bottom-bar"))throw this.$destroy(),new Error("You should wrap the md-bottom-bar-item in a md-bottom-bar");this.mdActive&&(this.active=!0)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.href?n("a",{staticClass:"md-bottom-bar-item",class:t.classes,attrs:{href:t.href,disabled:t.disabled},on:{click:function(e){t.setActive(!0,e)}}},[t.mdIcon||t.mdIconSrc||t.mdIconset?n("md-icon",{attrs:{"md-src":t.mdIconSrc,"md-iconset":t.mdIconset}},[t._v(t._s(t.mdIcon))]):t._e(),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),n("span",{staticClass:"md-text"},[t._t("default")],2)],1):n("button",{staticClass:"md-bottom-bar-item",class:t.classes,attrs:{type:"button",disabled:t.disabled},on:{click:function(e){t.setActive(!0,e)}}},[t.mdIcon||t.mdIconSrc||t.mdIconset?n("md-icon",{attrs:{"md-src":t.mdIconSrc,"md-iconset":t.mdIconset}},[t._v(t._s(t.mdIcon))]):t._e(),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),n("span",{staticClass:"md-text"},[t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-bottom-bar.md-fixed{background-color:BACKGROUND-COLOR}.THEME_NAME.md-bottom-bar.md-fixed .md-bottom-bar-item{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-fixed .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:BACKGROUND-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-fixed .md-bottom-bar-item.md-active{color:PRIMARY-COLOR}.THEME_NAME.md-bottom-bar.md-fixed.md-accent .md-bottom-bar-item.md-active{color:ACCENT-COLOR}.THEME_NAME.md-bottom-bar.md-fixed.md-warn .md-bottom-bar-item.md-active{color:WARN-COLOR}.THEME_NAME.md-bottom-bar.md-fixed.md-transparent .md-bottom-bar-item.md-active{color:BACKGROUND-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift .md-bottom-bar-item{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:PRIMARY-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift .md-bottom-bar-item.md-active{color:PRIMARY-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift.md-accent{background-color:ACCENT-COLOR}.THEME_NAME.md-bottom-bar.md-shift.md-accent .md-bottom-bar-item{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift.md-accent .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:ACCENT-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift.md-accent .md-bottom-bar-item.md-active{color:ACCENT-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift.md-warn{background-color:WARN-COLOR}.THEME_NAME.md-bottom-bar.md-shift.md-warn .md-bottom-bar-item{color:WARN-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift.md-warn .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:WARN-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift.md-warn .md-bottom-bar-item.md-active{color:WARN-CONTRAST}.THEME_NAME.md-bottom-bar.md-shift.md-transparent{background-color:transparent}.THEME_NAME.md-bottom-bar.md-shift.md-transparent .md-bottom-bar-item{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-bottom-bar.md-shift.md-transparent .md-bottom-bar-item:hover:not([disabled]):not(.md-active){color:BACKGROUND-CONTRAST-0.87}.THEME_NAME.md-bottom-bar.md-shift.md-transparent .md-bottom-bar-item.md-active{color:BACKGROUND-CONTRAST}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-button",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(115),r=i(a),s=n(119),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(116)}var o=n(0)(n(117),n(118),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-button",props:{href:String,target:String,rel:String,type:{type:String,default:"button"},disabled:Boolean},mixins:[o.default],computed:{newRel:function(){return"_blank"===this.target?this.rel||"noopener":this.rel}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.href?n("a",{staticClass:"md-button",class:[t.themeClass],attrs:{href:t.href,disabled:t.disabled,target:t.target,rel:t.newRel},on:{click:function(e){t.$emit("click",e)}}},[n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),t._t("default")],2):n("button",{staticClass:"md-button",class:[t.themeClass],attrs:{type:t.type,disabled:t.disabled},on:{click:function(e){t.$emit("click",e)}}},[n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}}),t._v(" "),t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-button:not([disabled]).md-raised:not(.md-icon-button){color:BACKGROUND-CONTRAST;background-color:BACKGROUND-COLOR}.THEME_NAME.md-button:not([disabled]).md-raised:not(.md-icon-button):hover{background-color:BACKGROUND-COLOR-200}.THEME_NAME.md-button:not([disabled]).md-raised.md-icon-button:not(.md-raised){color:BACKGROUND-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-fab{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-button:not([disabled]).md-fab:hover{background-color:ACCENT-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-fab.md-clean{color:BACKGROUND-CONTRAST;background-color:BACKGROUND-COLOR}.THEME_NAME.md-button:not([disabled]).md-fab.md-clean:hover{background-color:BACKGROUND-COLOR-200}.THEME_NAME.md-button:not([disabled]).md-primary:not(.md-icon-button){color:PRIMARY-COLOR}.THEME_NAME.md-button:not([disabled]).md-primary.md-raised,.THEME_NAME.md-button:not([disabled]).md-primary.md-fab{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-primary.md-raised:hover,.THEME_NAME.md-button:not([disabled]).md-primary.md-fab:hover{background-color:PRIMARY-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-primary.md-icon-button:not(.md-raised){color:PRIMARY-COLOR}.THEME_NAME.md-button:not([disabled]).md-accent:not(.md-icon-button){color:ACCENT-COLOR}.THEME_NAME.md-button:not([disabled]).md-accent.md-raised{background-color:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-accent.md-raised:hover{background-color:ACCENT-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-accent.md-icon-button:not(.md-raised){color:ACCENT-COLOR}.THEME_NAME.md-button:not([disabled]).md-warn:not(.md-icon-button){color:WARN-COLOR}.THEME_NAME.md-button:not([disabled]).md-warn.md-raised,.THEME_NAME.md-button:not([disabled]).md-warn.md-fab{background-color:WARN-COLOR;color:WARN-CONTRAST}.THEME_NAME.md-button:not([disabled]).md-warn.md-raised:hover,.THEME_NAME.md-button:not([disabled]).md-warn.md-fab:hover{background-color:WARN-COLOR-600}.THEME_NAME.md-button:not([disabled]).md-warn.md-icon-button:not(.md-raised){color:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-button-toggle",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(121),r=i(a),s=n(125),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(122)}var o=n(0)(n(123),n(124),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i),a=void 0;e.default={name:"md-button-toggle",props:{mdSingle:Boolean,mdManualToggle:Boolean},mixins:[o.default],mounted:function(){var t=this;this.mdManualToggle||this.$children.forEach((function(e){var n=e.$el;a=function(){t.mdSingle?(t.$children.forEach((function(t){t.$el.classList.remove("md-toggle")})),n.classList.add("md-toggle")):n.classList.toggle("md-toggle")},n&&n.classList.contains("md-button")&&n.addEventListener("click",a)}))},beforeDestroy:function(){this.mdManualToggle||this.$children.forEach((function(t){var e=t.$el;e&&e.classList.contains("md-button")&&e.removeEventListener("click",a)}))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-button-toggle",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports='.THEME_NAME.md-button-toggle .md-button:after{width:1px;position:absolute;top:0;bottom:0;left:0;content:" "}.THEME_NAME.md-button-toggle .md-toggle{color:BACKGROUND-CONTRAST-0.54;background-color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-button-toggle .md-toggle:hover:not([disabled]){background-color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-button-toggle .md-toggle+.md-toggle:after{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-button-toggle.md-raised .md-toggle{color:BACKGROUND-CONTRAST-0.54;background-color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-button-toggle.md-raised .md-toggle:hover:not([disabled]){background-color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-button-toggle.md-raised .md-toggle+.md-toggle:after{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-button-toggle.md-primary .md-toggle{color:PRIMARY-CONTRAST;background-color:PRIMARY-COLOR}.THEME_NAME.md-button-toggle.md-primary .md-toggle:hover:not([disabled]){background-color:PRIMARY-COLOR}.THEME_NAME.md-button-toggle.md-primary .md-toggle+.md-toggle:after{background-color:PRIMARY-COLOR-600}.THEME_NAME.md-button-toggle.md-accent .md-toggle{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-button-toggle.md-accent .md-toggle:hover:not([disabled]){background-color:ACCENT-COLOR}.THEME_NAME.md-button-toggle.md-accent .md-toggle+.md-toggle:after{background-color:ACCENT-COLOR-600}.THEME_NAME.md-button-toggle.md-warn .md-toggle{color:WARN-CONTRAST;background-color:WARN-COLOR}.THEME_NAME.md-button-toggle.md-warn .md-toggle:hover:not([disabled]){background-color:WARN-COLOR}.THEME_NAME.md-button-toggle.md-warn .md-toggle+.md-toggle:after{background-color:WARN-COLOR-600}.THEME_NAME.md-button-toggle [disabled]{color:rgba(0,0,0,0.26)}.THEME_NAME.md-button-toggle [disabled].md-toggle{color:BACKGROUND-CONTRAST-0.2;background-color:rgba(0,0,0,0.26)}\n'}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-card",r.default),t.component("md-card-media",d.default),t.component("md-card-media-cover",c.default),t.component("md-card-media-actions",m.default),t.component("md-card-header",h.default),t.component("md-card-header-text",b.default),t.component("md-card-content",g.default),t.component("md-card-actions",_.default),t.component("md-card-area",M.default),t.component("md-card-expand",A.default),t.material.styles.push(y.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(127),r=i(a),s=n(131),d=i(s),l=n(134),c=i(l),u=n(137),m=i(u),f=n(140),h=i(f),p=n(143),b=i(p),v=n(146),g=i(v),E=n(149),_=i(E),C=n(152),M=i(C),T=n(155),A=i(T),x=n(158),y=i(x);t.exports=e.default}),(function(t,e,n){function i(t){n(128)}var o=n(0)(n(129),n(130),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-card",props:{mdWithHover:Boolean},mixins:[o.default],computed:{classes:function(){return{"md-with-hover":this.mdWithHover}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card",class:[t.themeClass,t.classes]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(132),n(133),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-media",props:{mdRatio:String,mdMedium:Boolean,mdBig:Boolean},computed:{classes:function(){var t={};if(this.mdRatio){var e=[];-1!==this.mdRatio.indexOf(":")?e=this.mdRatio.split(":"):-1!==this.mdRatio.indexOf("/")&&(e=this.mdRatio.split("/")),2===e.length&&(t["md-"+e[0]+"-"+e[1]]=!0)}return(this.mdMedium||this.mdBig)&&(t={"md-medium":this.mdMedium,"md-big":this.mdBig}),t}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-media",class:t.classes},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(135),n(136),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(65),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-card-media-cover",props:{mdTextScrim:Boolean,mdSolid:Boolean},data:function(){return{backdropBg:{}}},computed:{classes:function(){return{"md-text-scrim":this.mdTextScrim,"md-solid":this.mdSolid}},styles:function(){return{background:this.backdropBg}}},methods:{applyScrimColor:function(t){this.$refs.backdrop&&(this.backdropBg="linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, "+t/2+") 66%, rgba(0, 0, 0, "+t+") 100%)")},applySolidColor:function(t){var e=this.$el.querySelector(".md-card-area");e&&(e.style.background="rgba(0, 0, 0, "+t+")")}},mounted:function(){var t=this,e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.6;t.mdTextScrim?t.applyScrimColor(e):t.mdSolid&&t.applySolidColor(e)},n=this.$el.querySelector("img");n&&(this.mdTextScrim||this.mdSolid)&&(0,o.default)(n,(function(t){var n=(100*Math.abs(256-t)/256+15)/100;n>=.7&&(n=.7),e(n)}),e)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-card-media-cover",class:t.classes},[t._t("default"),t._v(" "),t.mdTextScrim?n("div",{ref:"backdrop",staticClass:"md-card-backdrop",style:t.styles}):t._e()],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(138),n(139),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-media-actions"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-media-actions"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(141),n(142),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-header"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-header"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(144),n(145),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-header-text",mounted:function(){this.parentClasses=this.$parent.$el.classList,this.parentClasses.contains("md-card-header")&&(this.insideParent=!0,this.parentClasses.add("md-card-header-flex"))},destroyed:function(){this.parentClasses.remove("md-card-header-flex")}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-header-text"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(147),n(148),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-content"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-content"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(150),n(151),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-actions"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-actions"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(153),n(154),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-area",props:{mdInset:Boolean},computed:{classes:function(){return{"md-inset":this.mdInset}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-card-area",class:t.classes},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(156),n(157),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-card-expand",data:function(){return{trigger:null,content:null}},methods:{toggle:function(){this.$refs.expand.classList.toggle("md-active")}},mounted:function(){var t=this;window.setTimeout((function(){t.trigger=t.$el.querySelector("[md-expand-trigger]"),t.content=t.$el.querySelector(".md-card-content"),t.content&&t.trigger.addEventListener("click",t.toggle)}),200)},destroyed:function(){this.content&&this.trigger.removeEventListener("click",this.toggle)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{ref:"expand",staticClass:"md-card-expand"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-card{background-color:BACKGROUND-COLOR}.THEME_NAME.md-card.md-primary{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card.md-primary .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:PRIMARY-CONTRAST-0.87}.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused input,.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused label,.THEME_NAME.md-card.md-primary .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container:after{background-color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container input,.THEME_NAME.md-card.md-primary .md-input-container textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-card.md-primary .md-input-container textarea::-webkit-input-placeholder{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-card.md-primary .md-input-container label,.THEME_NAME.md-card.md-primary .md-input-container .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-card.md-primary .md-card-expand .md-card-actions{background-color:PRIMARY-COLOR}.THEME_NAME.md-card.md-accent{background-color:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card.md-accent .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:ACCENT-CONTRAST-0.87}.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused input,.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused label,.THEME_NAME.md-card.md-accent .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container:after{background-color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container input,.THEME_NAME.md-card.md-accent .md-input-container textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-card.md-accent .md-input-container textarea::-webkit-input-placeholder{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-card.md-accent .md-input-container label,.THEME_NAME.md-card.md-accent .md-input-container .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-card.md-accent .md-card-expand .md-card-actions{background-color:ACCENT-COLOR}.THEME_NAME.md-card.md-warn{background-color:WARN-COLOR;color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card.md-warn .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:WARN-CONTRAST-0.87}.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused input,.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused label,.THEME_NAME.md-card.md-warn .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container:after{background-color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container input,.THEME_NAME.md-card.md-warn .md-input-container textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-card.md-warn .md-input-container textarea::-webkit-input-placeholder{color:WARN-CONTRAST-0.54}.THEME_NAME.md-card.md-warn .md-input-container label,.THEME_NAME.md-card.md-warn .md-input-container .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-card.md-warn .md-card-expand .md-card-actions{background-color:WARN-COLOR}.THEME_NAME.md-card .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-card>.md-card-area:after{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-card .md-card-media-cover.md-text-scrim .md-backdrop{background:linear-gradient(to bottom, BACKGROUND-CONTRAST-0.0 20%, BACKGROUND-CONTRAST-0.275 66%, BACKGROUND-CONTRAST-0.55 100%)}.THEME_NAME.md-card .md-card-media-cover.md-solid .md-card-area{background-color:BACKGROUND-CONTRAST-0.4}.THEME_NAME.md-card .md-card-media-cover .md-card-header .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon,.THEME_NAME.md-card .md-card-media-cover .md-card-actions .md-icon-button:not(.md-primary):not(.md-warn):not(.md-accent) .md-icon{color:#fff}.THEME_NAME.md-card .md-card-expand .md-card-actions{background-color:BACKGROUND-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-checkbox",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(160),r=i(a),s=n(164),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(161)}var o=n(0)(n(162),n(163),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-checkbox",props:{name:String,value:[String,Boolean,Array],id:String,disabled:Boolean,mdValue:[String]},mixins:[o.default],data:function(){return{checked:this.value||!1}},computed:{classes:function(){return{"md-checked":this.isArray()?this.value.indexOf(this.mdValue)>=0:this.checked,"md-disabled":this.disabled}}},watch:{value:function(){this.isArray()||(this.checked=!!this.value)}},methods:{toggleCheck:function(t){if(!this.disabled)if(this.isArray()){var e=this.value.indexOf(this.mdValue);e>=0?this.value.splice(e,1):this.value.push(this.mdValue),this.$emit("change",this.value,t),this.$emit("input",this.value,t)}else this.checked=!this.checked,this.$emit("change",this.checked,t),this.$emit("input",this.checked,t)},isArray:function(){return Array.isArray(this.value)}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-checkbox",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-checkbox-container",attrs:{tabindex:"0"},on:{click:function(e){e.stopPropagation(),t.toggleCheck(e)}}},[n("input",{attrs:{type:"checkbox",name:t.name,id:t.id,disabled:t.disabled,tabindex:"-1"},domProps:{value:t.mdValue,checked:t.checked}}),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}})],1),t._v(" "),t.$slots.default?n("label",{staticClass:"md-checkbox-label",attrs:{for:t.id||t.name},on:{click:function(e){e.preventDefault(),t.toggleCheck(e)}}},[t._t("default")],2):t._e()])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-checkbox.md-checked .md-checkbox-container{background-color:ACCENT-COLOR;border-color:ACCENT-COLOR}.THEME_NAME.md-checkbox.md-checked .md-checkbox-container:after{border-color:ACCENT-CONTRAST}.THEME_NAME.md-checkbox .md-ink-ripple{color:ACCENT-COLOR}.THEME_NAME.md-checkbox .md-ripple{opacity:.26}.THEME_NAME.md-checkbox.md-primary.md-checked .md-checkbox-container{background-color:PRIMARY-COLOR;border-color:PRIMARY-COLOR}.THEME_NAME.md-checkbox.md-primary.md-checked .md-checkbox-container:after{border-color:PRIMARY-CONTRAST}.THEME_NAME.md-checkbox.md-primary .md-ink-ripple{color:PRIMARY-COLOR}.THEME_NAME.md-checkbox.md-warn.md-checked .md-checkbox-container{background-color:WARN-COLOR;border-color:WARN-COLOR}.THEME_NAME.md-checkbox.md-warn.md-checked .md-checkbox-container:after{border-color:WARN-CONTRAST}.THEME_NAME.md-checkbox.md-warn .md-ink-ripple{color:WARN-COLOR}.THEME_NAME.md-checkbox.md-disabled.md-checked .md-checkbox-container{background-color:rgba(0,0,0,0.26);border-color:transparent}.THEME_NAME.md-checkbox.md-disabled:not(.md-checked) .md-checkbox-container{border-color:rgba(0,0,0,0.26)}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-chips",r.default),t.component("md-chip",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(166),r=i(a),s=n(170),d=i(s),l=n(173),c=i(l);t.exports=e.default}),(function(t,e,n){function i(t){n(167)}var o=n(0)(n(168),n(169),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(36),s=i(r);e.default={name:"md-chips",props:{value:Array,disabled:Boolean,debounce:{type:Number,default:100},mdInputId:String,mdInputName:String,mdInputPlaceholder:String,mdInputType:{type:String,default:"text"},mdStatic:Boolean,mdMax:{type:Number,default:1/0}},mixins:[a.default],data:function(){return{currentChip:null,selectedChips:this.value,inputId:this.mdInputId||"chips-"+(0,s.default)()}},watch:{value:function(t){this.selectedChips=t}},computed:{classes:function(){return{"md-static":this.mdStatic,"md-disabled":this.disabled,"md-chips":!0}}},methods:{applyInputFocus:function(){var t=this;this.$nextTick((function(){t.$refs.input.$el.focus()}))},addChip:function(){if(this.currentChip&&this.selectedChips.length<this.mdMax){var t=this.currentChip.trim();this.selectedChips.indexOf(t)<0&&(this.selectedChips.push(t),this.currentChip=null,this.$emit("input",this.selectedChips),this.$emit("change",this.selectedChips),this.applyInputFocus())}},deleteChip:function(t){var e=this.selectedChips.indexOf(t);e>=0&&this.selectedChips.splice(e,1),this.$emit("change",this.selectedChips),this.applyInputFocus()},editChip:function(t){var e=this.selectedChips.indexOf(t);e>=0&&this.selectedChips.splice(e,1),this.currentChip=t,this.$emit("change",this.selectedChips),this.applyInputFocus()},deleteLastChip:function(){this.currentChip||(this.selectedChips.pop(),this.$emit("change",this.selectedChips),this.applyInputFocus())}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-input-container",{staticClass:"md-chips",class:[t.themeClass,t.classes],on:{click:t.applyInputFocus}},[t._l(t.selectedChips,(function(e){return n("md-chip",{key:e,attrs:{"md-editable":!t.mdStatic,"md-deletable":!t.mdStatic,disabled:t.disabled},on:{edit:function(n){t.editChip(e)},delete:function(n){t.deleteChip(e)}}},[t._t("chip",[t._v(t._s(e))],{value:e})],2)})),t._v(" "),n("md-input",{directives:[{name:"show",rawName:"v-show",value:!t.mdStatic,expression:"!mdStatic"}],ref:"input",attrs:{type:t.mdInputType,placeholder:t.mdInputPlaceholder,id:t.inputId,name:t.mdInputName,disabled:t.disabled,tabindex:"0",debounce:0},nativeOn:{keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46]))return null;t.deleteLastChip(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.addChip(e)},function(e){if(!("button"in e)&&186!==e.keyCode)return null;e.preventDefault(),t.addChip(e)}]},model:{value:t.currentChip,callback:function(e){t.currentChip=e},expression:"currentChip"}}),t._v(" "),t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(171),n(172),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-chip",props:{disabled:Boolean,mdDeletable:Boolean,mdEditable:Boolean},mixins:[o.default],computed:{classes:function(){return{"md-deletable":this.mdDeletable,"md-disabled":this.disabled,"md-editable":this.mdEditable}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-chip",class:[t.themeClass,t.classes],attrs:{tabindex:"0"}},[n("div",{staticClass:"md-chip-container",on:{click:function(e){!t.disabled&&t.mdEditable&&t.$emit("edit")}}},[t._t("default")],2),t._v(" "),t.mdDeletable?n("md-button",{staticClass:"md-icon-button md-dense md-delete",attrs:{tabindex:"-1"},on:{click:function(e){!t.disabled&&t.$emit("delete")}},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46]))return null;!t.disabled&&t.$emit("delete")}}},[n("md-icon",{staticClass:"md-icon-delete"},[t._v("cancel")])],1):t._e()],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-chip{background-color:BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-chip.md-deletable:hover,.THEME_NAME.md-chip.md-deletable:focus,.THEME_NAME.md-chip.md-editable:hover,.THEME_NAME.md-chip.md-editable:focus{background-color:BACKGROUND-CONTRAST-0.54;color:BACKGROUND-COLOR}.THEME_NAME.md-chip.md-deletable:hover .md-delete,.THEME_NAME.md-chip.md-deletable:focus .md-delete,.THEME_NAME.md-chip.md-editable:hover .md-delete,.THEME_NAME.md-chip.md-editable:focus .md-delete{color:BACKGROUND-COLOR}.THEME_NAME.md-chip .md-delete{color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-chip .md-delete .md-ripple{color:BACKGROUND-COLOR}.THEME_NAME.md-chip.md-primary{color:PRIMARY-CONTRAST;background-color:PRIMARY-COLOR}.THEME_NAME.md-chip.md-accent{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-chip.md-warn{color:WARN-CONTRAST;background-color:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-dialog",r.default),t.component("md-dialog-title",d.default),t.component("md-dialog-content",c.default),t.component("md-dialog-actions",m.default),t.component("md-dialog-alert",h.default),t.component("md-dialog-confirm",b.default),t.component("md-dialog-prompt",g.default),t.material.styles.push(_.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(175),r=i(a),s=n(179),d=i(s),l=n(182),c=i(l),u=n(185),m=i(u),f=n(188),h=i(f),p=n(191),b=i(p),v=n(194),g=i(v),E=n(197),_=i(E);t.exports=e.default}),(function(t,e,n){function i(t){n(176)}var o=n(0)(n(177),n(178),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(42),s=i(r);e.default={name:"md-dialog",props:{mdClickOutsideToClose:{type:Boolean,default:!0},mdEscToClose:{type:Boolean,default:!0},mdBackdrop:{type:Boolean,default:!0},mdOpenFrom:String,mdCloseTo:String,mdFullscreen:{type:Boolean,default:!1}},mixins:[a.default],data:function(){return{active:!1,transitionOff:!1,dialogTransform:""}},computed:{classes:function(){return{"md-active":this.active}},dialogClasses:function(){return{"md-fullscreen":this.mdFullscreen,"md-transition-off":this.transitionOff,"md-reference":this.mdOpenFrom||this.mdCloseTo}},styles:function(){return{transform:this.dialogTransform}}},methods:{removeDialog:function(){document.body.contains(this.dialogElement)&&this.$el.parentNode.removeChild(this.$el)},calculateDialogPos:function(t){var e=document.querySelector(t);if(e){var n=e.getBoundingClientRect(),i=this.dialogInnerElement.getBoundingClientRect(),o=n.width/i.width,a=n.height/i.height,r={top:-(i.top-n.top),left:-(i.left-n.left+n.width)};n.top>i.top+i.height&&(r.top=n.top-i.top),n.left>i.left+i.width&&(r.left=n.left-i.left-n.width),this.dialogTransform="translate3D("+r.left+"px, "+r.top+"px, 0) scale("+o+", "+a+")"}},open:function(){var t=this;document.body.appendChild(this.dialogElement),this.transitionOff=!0,this.calculateDialogPos(this.mdOpenFrom),window.setTimeout((function(){t.dialogElement.focus(),t.transitionOff=!1,t.active=!0})),this.$emit("open")},closeOnEsc:function(){this.mdEscToClose&&this.close()},close:function(){var t=this;document.body.contains(this.dialogElement)&&this.$nextTick((function(){var e=function e(){var n=t.dialogElement.querySelector(".md-ripple.md-active");n&&n.classList.remove("md-active"),t.dialogInnerElement.removeEventListener(s.default,e),document.body.removeChild(t.dialogElement),t.dialogTransform=""};t.transitionOff=!0,t.dialogTransform="",t.calculateDialogPos(t.mdCloseTo),window.setTimeout((function(){t.transitionOff=!1,t.active=!1,t.dialogInnerElement.addEventListener(s.default,e)})),t.$emit("close")}))}},mounted:function(){var t=this;this.$nextTick((function(){t.dialogElement=t.$el,t.dialogInnerElement=t.$refs.dialog,t.removeDialog()}))},beforeDestroy:function(){this.removeDialog()}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-dialog-container",class:[t.themeClass,t.classes],attrs:{tabindex:"0"},on:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;e.stopPropagation(),t.closeOnEsc(e)}}},[n("div",{ref:"dialog",staticClass:"md-dialog",class:t.dialogClasses,style:t.styles},[t._t("default")],2),t._v(" "),t.mdBackdrop?n("md-backdrop",{ref:"backdrop",staticClass:"md-dialog-backdrop",class:t.classes,on:{close:function(e){t.mdClickOutsideToClose&&t.close()}}}):t._e()],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(180),n(181),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-title"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-dialog-title md-title"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(183),n(184),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-content"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-dialog-content"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(186),n(187),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-actions"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-dialog-actions"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(189),n(190),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-alert",props:{mdTitle:String,mdContent:String,mdContentHtml:String,mdOkText:{type:String,default:"Ok"}},data:function(){return{debounce:!1}},methods:{fireCloseEvent:function(){this.debounce||this.$emit("close")},open:function(){this.$emit("open"),this.debounce=!1,this.$refs.dialog.open()},close:function(){this.fireCloseEvent(),this.debounce=!0,this.$refs.dialog.close()}},mounted:function(){if(!this.mdContent&&!this.mdContentHtml)throw new Error("Missing md-content or md-content-html attributes")}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-dialog",{ref:"dialog",staticClass:"md-dialog-alert",on:{close:function(e){t.fireCloseEvent()}}},[t.mdTitle?n("md-dialog-title",[t._v(t._s(t.mdTitle))]):t._e(),t._v(" "),t.mdContentHtml?n("md-dialog-content",{domProps:{innerHTML:t._s(t.mdContentHtml)}}):n("md-dialog-content",[t._v(t._s(t.mdContent))]),t._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close()}}},[t._v(t._s(t.mdOkText))])],1)],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(192),n(193),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-confirm",props:{mdTitle:String,mdContent:String,mdContentHtml:String,mdOkText:{type:String,default:"Ok"},mdCancelText:{type:String,default:"Cancel"}},data:function(){return{debounce:!1}},methods:{fireCloseEvent:function(t){this.debounce||this.$emit("close",t)},open:function(){this.$emit("open"),this.debounce=!1,this.$refs.dialog.open()},close:function(t){this.fireCloseEvent(t),this.debounce=!0,this.$refs.dialog.close()}},mounted:function(){if(!this.mdContent&&!this.mdContentHtml)throw new Error("Missing md-content or md-content-html attributes")}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-dialog",{ref:"dialog",staticClass:"md-dialog-confirm",on:{close:function(e){t.fireCloseEvent("cancel")}}},[t.mdTitle?n("md-dialog-title",[t._v(t._s(t.mdTitle))]):t._e(),t._v(" "),t.mdContentHtml?n("md-dialog-content",{domProps:{innerHTML:t._s(t.mdContentHtml)}}):n("md-dialog-content",[t._v(t._s(t.mdContent))]),t._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close("cancel")}}},[t._v(t._s(t.mdCancelText))]),t._v(" "),n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close("ok")}}},[t._v(t._s(t.mdOkText))])],1)],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(195),n(196),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-dialog-prompt",props:{value:{type:[String,Number],required:!0},mdTitle:String,mdContent:String,mdContentHtml:String,mdOkText:{type:String,default:"Ok"},mdCancelText:{type:String,default:"Cancel"},mdInputId:String,mdInputName:String,mdInputMaxlength:[String,Number],mdInputPlaceholder:String},data:function(){return{debounce:!1}},methods:{fireCloseEvent:function(t){this.debounce||this.$emit("close",t)},open:function(){var t=this;this.$emit("open"),this.debounce=!1,this.$refs.dialog.open(),window.setTimeout((function(){t.$refs.input.$el.focus()}))},close:function(t){this.fireCloseEvent(t),this.debounce=!0,this.$refs.dialog.close()},confirmValue:function(){this.$emit("input",this.$refs.input.$el.value),this.close("ok")}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-dialog",{ref:"dialog",staticClass:"md-dialog-prompt",on:{close:function(e){t.fireCloseEvent("cancel")}}},[t.mdTitle?n("md-dialog-title",[t._v(t._s(t.mdTitle))]):t._e(),t._v(" "),t.mdContentHtml?n("md-dialog-content",{domProps:{innerHTML:t._s(t.mdContentHtml)}}):t._e(),t._v(" "),t.mdContent?n("md-dialog-content",[t._v(t._s(t.mdContent))]):t._e(),t._v(" "),n("md-dialog-content",[n("md-input-container",[n("md-input",{ref:"input",attrs:{id:t.mdInputId,name:t.mdInputName,maxlength:t.mdInputMaxlength,placeholder:t.mdInputPlaceholder,value:t.value},nativeOn:{keydown:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;t.confirmValue(e)}}})],1)],1),t._v(" "),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:function(e){t.close("cancel")}}},[t._v(t._s(t.mdCancelText))]),t._v(" "),n("md-button",{staticClass:"md-primary",on:{click:t.confirmValue}},[t._v(t._s(t.mdOkText))])],1)],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-dialog-container .md-dialog{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}\n"}),(function(t,e,n){"use strict";function i(t){t.component("md-divider",a.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;var o=n(199),a=(function(t){return t&&t.__esModule?t:{default:t}})(o);t.exports=e.default}),(function(t,e,n){function i(t){n(200)}var o=n(0)(n(201),n(202),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-divider"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("hr",{staticClass:"md-divider"})},staticRenderFns:[]}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-file",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(204),r=i(a),s=n(208),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(205)}var o=n(0)(n(206),n(207),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(66),a=i(o),r=n(11),s=i(r);e.default={name:"md-file",props:{value:String,id:String,name:String,disabled:Boolean,required:Boolean,placeholder:String,accept:String,multiple:Boolean},data:function(){return{filename:this.value}},watch:{value:function(){this.filename=this.value}},methods:{getMultipleName:function(t){var e=[];return[].concat((0,a.default)(t)).forEach((function(t){e.push(t.name)})),e.join(", ")},openPicker:function(){this.disabled||(this.resetFile(),this.$refs.fileInput.click(),this.$refs.textInput.$el.focus())},resetFile:function(){this.parentContainer.value="",this.$refs.fileInput.value=""},onFileSelected:function(t){var e=t.target.files||t.dataTransfer.files;e?e.length>1?this.filename=this.getMultipleName(e):1===e.length?this.filename=e[0].name:this.filename=null:this.filename=t.target.value.split("\\").pop(),this.$emit("selected",e||t.target.value),this.$emit("input",this.filename)}},mounted:function(){if(this.parentContainer=(0,s.default)(this.$parent,"md-input-container"),!this.parentContainer)throw this.$destroy(),new Error("You should wrap the md-file in a md-input-container");this.parentContainer.hasFile=!0},beforeDestroy:function(){this.parentContainer.hasFile=!1}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-file",on:{click:t.openPicker}},[n("md-input",{ref:"textInput",attrs:{readonly:"",required:t.required,placeholder:t.placeholder,disabled:t.disabled},model:{value:t.filename,callback:function(e){t.filename=e},expression:"filename"}}),t._v(" "),n("md-icon",[t._v("attach_file")]),t._v(" "),n("input",{ref:"fileInput",attrs:{type:"file",id:t.id,name:t.name,disabled:t.disabled,multiple:t.multiple,accept:t.accept},on:{change:t.onFileSelected}})],1)},staticRenderFns:[]}}),(function(t,e){t.exports=""}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-icon",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(210),r=i(a),s=n(214),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(211)}var o=n(0)(n(212),n(213),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i),a={};e.default={name:"md-icon",props:{mdSrc:String,mdIconset:{type:String,default:"material-icons"}},data:function(){return{svgContent:null,imageSrc:null}},mixins:[o.default],watch:{mdSrc:function(){this.svgContent=null,this.imageSrc=null,this.checkSrc()}},methods:{isImage:function(t){return t.indexOf("image")>=0},isSVG:function(t){return t.indexOf("svg")>=0},setSVGContent:function(t){var e=this;this.svgContent=t,this.$nextTick((function(){e.$el.children[0].removeAttribute("fill")}))},loadSVG:function(){if(a[this.mdSrc])this.setSVGContent(a[this.mdSrc]);else{var t=new XMLHttpRequest,e=this;t.open("GET",this.mdSrc,!0),t.onload=function(){var t=this.getResponseHeader("content-type");this.status>=200&&this.status<400&&e.isImage(t)?e.isSVG(t)?(a[e.mdSrc]=this.response,e.setSVGContent(this.response)):e.loadImage():console.warn("The file "+e.mdSrc+" is not a valid image.")},t.send()}},loadImage:function(){this.imageSrc=this.mdSrc},checkSrc:function(){this.mdSrc&&(this.mdSrc.indexOf(".svg")>=0?this.loadSVG():this.loadImage())}},mounted:function(){this.checkSrc()}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.svgContent?n("i",{staticClass:"md-icon",class:[t.themeClass],domProps:{innerHTML:t._s(t.svgContent)}}):t.imageSrc?n("md-image",{staticClass:"md-icon",class:[t.themeClass],attrs:{"md-src":t.imageSrc}}):n("i",{staticClass:"md-icon",class:[t.themeClass,t.mdIconset],attrs:{"aria-hidden":!!t.mdIconset}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-icon.md-primary{color:PRIMARY-COLOR}.THEME_NAME.md-icon.md-accent{color:ACCENT-COLOR}.THEME_NAME.md-icon.md-warn{color:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-image",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(216),r=i(a),s=n(220),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(217)}var o=n(0)(n(218),n(219),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(65),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-image",props:{mdSrc:String},data:function(){return{loaded:!1,applyBlack:!0,imageElement:null}},watch:{mdSrc:function(){this.createImage()}},computed:{classes:function(){return{"md-loaded":this.loaded,"md-black-output":this.applyBlack}}},methods:{analyzeLightness:function(t){var e=this,n=function(){e.loaded=!0};(0,o.default)(t,(function(t){(100*Math.abs(256-t)/256+15)/100>=.7&&(e.applyBlack=!0),e.$nextTick(n)}),n)},createImage:function(){this.loaded=!1,this.applyBlack=!1,this.imageElement=null,this.mdSrc&&(this.imageElement=document.createElement("img"),this.imageElement.crossOrigin="",this.imageElement.src=this.mdSrc,this.analyzeLightness(this.imageElement))}},created:function(){this.createImage()}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("img",{staticClass:"md-image",class:t.classes,attrs:{src:t.mdSrc}})},staticRenderFns:[]}}),(function(t,e){t.exports=""}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-input-container",r.default),t.component("md-input",d.default),t.component("md-autocomplete",c.default),t.component("md-textarea",m.default),t.material.styles.push(h.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(222),r=i(a),s=n(226),d=i(s),l=n(229),c=i(l),u=n(237),m=i(u),f=n(241),h=i(f);t.exports=e.default}),(function(t,e,n){function i(t){n(223)}var o=n(0)(n(224),n(225),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(67),s=i(r);e.default={name:"md-input-container",props:{mdInline:Boolean,mdHasPassword:Boolean,mdClearable:Boolean},mixins:[a.default],data:function(){return{value:"",input:!1,inputInstance:null,showPassword:!1,enableCounter:!1,hasSelect:!1,hasPlaceholder:!1,hasFile:!1,isDisabled:!1,isRequired:!1,isFocused:!1,counterLength:0,inputLength:0}},computed:{hasValue:function(){return(0,s.default)(this.value)?this.value.length>0:Boolean(this.value)},classes:function(){return{"md-input-inline":this.mdInline,"md-has-password":this.mdHasPassword,"md-clearable":this.mdClearable,"md-has-select":this.hasSelect,"md-has-file":this.hasFile,"md-has-value":this.hasValue,"md-input-placeholder":this.hasPlaceholder,"md-input-disabled":this.isDisabled,"md-input-required":this.isRequired,"md-input-focused":this.isFocused}}},methods:{isInput:function(){return this.input&&"input"===this.input.tagName.toLowerCase()},togglePasswordType:function(){this.isInput()&&("password"===this.input.type?(this.input.type="text",this.showPassword=!0):(this.input.type="password",this.showPassword=!1),this.input.focus())},clearInput:function(){this.inputInstance.$el.value="",this.inputInstance.$emit("input",""),this.setValue("")},setValue:function(t){this.value=t}},mounted:function(){if(this.input=this.$el.querySelectorAll("input, textarea, select, .md-file")[0],!this.input)throw this.$destroy(),new Error("Missing input/select/textarea inside md-input-container")}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-input-container",class:[t.themeClass,t.classes]},[t._t("default"),t._v(" "),t.enableCounter?n("span",{staticClass:"md-count"},[t._v(t._s(t.inputLength)+" / "+t._s(t.counterLength))]):t._e(),t._v(" "),t.mdHasPassword?n("md-button",{staticClass:"md-icon-button md-toggle-password",attrs:{tabindex:"-1"},on:{click:function(e){e.preventDefault(),t.togglePasswordType(e)}}},[n("md-icon",[t._v(t._s(t.showPassword?"visibility_off":"visibility"))])],1):t._e(),t._v(" "),t.mdClearable&&t.hasValue?n("md-button",{staticClass:"md-icon-button md-clear-input",attrs:{tabindex:"-1"},on:{click:t.clearInput}},[n("md-icon",[t._v("clear")])],1):t._e()],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(227),n(228),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(62),a=i(o),r=n(11),s=i(r);e.default={name:"md-input",props:{type:{type:String,default:"text"}},mixins:[a.default],mounted:function(){var t=this;this.$nextTick((function(){if(t.parentContainer=(0,s.default)(t.$parent,"md-input-container"),!t.parentContainer)throw t.$destroy(),new Error("You should wrap the md-input in a md-input-container");t.parentContainer.inputInstance=t,t.setParentDisabled(),t.setParentRequired(),t.setParentPlaceholder(),t.handleMaxLength(),t.updateValues()}))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("input",{staticClass:"md-input",attrs:{type:t.type,name:t.name,disabled:t.disabled,required:t.required,placeholder:t.placeholder,maxlength:t.maxlength,min:t.min,max:t.max,readonly:t.readonly},domProps:{value:t.value},on:{focus:t.onFocus,blur:t.onBlur,input:t.onInput,keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;t.onInput(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;t.onInput(e)}]}})},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(230),n(236),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(231),a=i(o),r=n(44),s=i(r),d=n(235),l=i(d),c=n(62),u=i(c),m=n(11),f=i(m);e.default={mixins:[u.default,l.default],data:function(){return{items:[],loading:!1,query:"",selected:null,isItemSelected:0,timeout:0,parentContainer:null,searchButton:null}},computed:{listIsEmpty:function(){return 0===this.list.length},itemsEmpty:function(){return 0===this.items.length},filterItemsByResLength:function(){return 0===this.maxRes?this.items:this.items.slice(0,this.maxRes)}},watch:{list:function(t){this.items=(0,s.default)([],t)},query:function(t){this.$refs.input.value=t,this.setParentUpdateValue(t)},value:function(t){this.query=t,this.setParentUpdateValue(t)}},methods:{debounceUpdate:function(){var t=this;this.onInput(),this.timeout&&window.clearTimeout(this.timeout),this.timeout=window.setTimeout((function(){if(!t.listIsEmpty)return void t.renderFilteredList();t.update()}),this.debounce)},hit:function(t){this.query=t[this.printAttribute],this.$refs.input.value=t[this.printAttribute],this.selected=t,this.onInput(),this.$emit("selected",this.selected,this.$refs.input.value),this.closeMenu()},makeFetchRequest:function(t){var e=this;return this.fetch(t).then((function(t){var n=t||t.data||t.body;n=e.prepareResponseData?e.prepareResponseData(n):n,e.items=e.limit?n.slice(0,e.limit):n,e.loading=!1,e.itemsEmpty||e.isItemSelected?e.closeMenu():e.openMenu()}))},onFocus:function(t){this.isItemSelected=0,this.parentContainer&&(this.parentContainer.isFocused=!0),this.$refs.input.focus(),this.query&&this.query.length>=this.minChars&&(this.renderFilteredList(),this.openMenu()),this.$emit("focus",this.$el.value,t)},onInput:function(){this.updateValues(),this.$emit("change",this.$refs.input.value),this.$emit("input",this.$refs.input.value)},renderFilteredList:function(){this.filterList&&this.query.length>=this.minChars&&(this.items=this.filterList((0,s.default)([],this.list),this.query)),(this.query.length<this.minChars||this.itemsEmpty)&&this.closeMenu(),this.itemsEmpty||0!==this.isItemSelected?1===this.isItemSelected&&(this.isItemSelected=0):this.openMenu()},reset:function(){this.items=[],this.query="",this.loading=!1},setParentValue:function(t){null!==this.parentContainer&&this.parentContainer.setValue(t||this.$refs.input.value)},setParentDisabled:function(){this.parentContainer.isDisabled=this.disabled},setParentRequired:function(){this.parentContainer.isRequired=this.required},setParentPlaceholder:function(){this.parentContainer.hasPlaceholder=!!this.placeholder},setParentUpdateValue:function(t){this.setParentValue(t),this.updateValues(t)},setSearchButton:function(){this.searchButton=this.parentContainer.$el.querySelector("[md-autocomplete-search]"),this.searchButton&&this.searchButton.addEventListener("click",this.makeFetchRequest)},update:function(){if(!this.query&&!this.list.length)return this.reset();if(!(this.minChars&&this.query.length<this.minChars)){this.loading=!0;var t=(0,a.default)({},this.queryParam,this.query);return this.makeFetchRequest(t)}},toggleMenu:function(){this.items.length&&this.$refs.menu.toggle()},openMenu:function(){this.items.length&&!this.itemsEmpty&&(this.$refs.menu.open(),this.$refs.input.focus())},closeMenu:function(){this.$refs.menu.close()},updateValues:function(t){var e=t||this.$refs.input.value||this.value;this.setParentValue(e),null!==this.parentContainer&&(this.parentContainer.inputLength=e?e.length:0)},contentHighlightItem:function(t){return this.menuContent=document.body.querySelector(".md-autocomplete-content"),null!==this.menuContent&&(this.menuContent.__vue__.highlightItem(t),!0)},contentFireClick:function(){if(this.menuContent=document.body.querySelector(".md-autocomplete-content"),null===this.menuContent||!1===this.menuContent.__vue__.highlighted||this.menuContent.__vue__.highlighted<1)return this.closeMenu(),!1;var t=this.menuContent.__vue__.$children[0].$children[this.menuContent.__vue__.highlighted-1].index;return this.isItemSelected=1,this.hit(this.items[t-1]),this.closeMenu(),!0},setItemSelected:function(t){return this.isItemSelected=2,this.hit(t),this.closeMenu(),!0}},beforeDestroy:function(){this.searchButton&&this.searchButton.removeEventListener("click",this.makeFetchRequest)},mounted:function(){var t=this;this.query=this.value,this.$nextTick((function(){t.parentContainer=(0,f.default)(t.$parent,"md-input-container"),t.menuContent=document.body.querySelector(".md-autocomplete-content"),t.listIsEmpty||(t.items=(0,s.default)([],t.list)),t.verifyProps(),t.setSearchButton(),t.setParentDisabled(),t.setParentRequired(),t.setParentPlaceholder(),t.handleMaxLength(),t.updateValues()}))}},t.exports=e.default}),(function(t,e,n){"use strict";e.__esModule=!0;var i=n(232),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default=function(t,e,n){return e in t?(0,o.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}}),(function(t,e,n){t.exports={default:n(233),__esModule:!0}}),(function(t,e,n){n(234);var i=n(4).Object;t.exports=function(t,e,n){return i.defineProperty(t,e,n)}}),(function(t,e,n){var i=n(16);i(i.S+i.F*!n(3),"Object",{defineProperty:n(9).f})}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{debounce:{type:Number,default:1e3},disabled:Boolean,fetch:{type:Function},filterList:Function,list:{type:Array,default:function(){return[]}},minChars:{type:Number,default:1},name:String,prepareResponseData:Function,printAttribute:{type:String,default:"name"},queryParam:{type:String,default:"q"},maxHeight:{type:Number,default:0},required:Boolean,maxRes:{type:Number,default:0}},methods:{onFocus:function(){this.parentContainer&&(this.parentContainer.isFocused=!0)},onBlur:function(){this.parentContainer.isFocused=!1,this.setParentValue()},verifyProps:function(){return this.parentContainer?this.listIsEmpty&&this.filterList?this.throwErrorDestroy("You should use a `filterList` function prop with the `list` prop"):!this.fetch&&this.listIsEmpty?this.throwErrorDestroy("You should use a `fetch` function prop"):void 0:this.throwErrorDestroy("You should wrap the md-input in a md-input-container")},throwErrorDestroy:function(t){throw this.$destroy(),new Error(t)}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-autocomplete",on:{focus:t.onFocus,blur:t.onBlur}},[n("md-menu",{ref:"menu",staticClass:"md-autocomplete-menu",attrs:{"md-align-trigger":"","md-auto-width":"","md-fixed":"","md-no-focus":"","md-manual-toggle":"","md-max-height":t.maxHeight,"md-close-on-select":!1,"md-align-trigger":""}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.query,expression:"query"}],ref:"input",staticClass:"md-input",attrs:{type:"text",disabled:t.disabled,required:t.required,placeholder:t.placeholder,maxlength:t.maxlength,name:t.name,"md-menu-trigger":""},domProps:{value:t.query},on:{focus:t.onFocus,blur:t.onBlur,input:[function(e){e.target.composing||(t.query=e.target.value)},t.debounceUpdate],keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;e.preventDefault(),t.contentHighlightItem("up")},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;e.preventDefault(),t.contentHighlightItem("down")},function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;e.preventDefault(),t.contentFireClick()},function(e){if(!("button"in e)&&t._k(e.keyCode,"tab",9))return null;t.closeMenu()}]}}),t._v(" "),n("md-menu-content",{staticClass:"md-autocomplete-content"},t._l(t.filterItemsByResLength,(function(e,i){return t.items.length?n("md-menu-item",{key:i,attrs:{listIndex:i,"manual-highlight":""},on:{click:function(n){t.setItemSelected(e)}}},[t._v("\n        "+t._s(e[t.printAttribute])+"\n      ")]):t._e()})))],1)],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(238),n(240),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(239),a=i(o),r=n(62),s=i(r),d=n(11),l=i(d);e.default={name:"md-textarea",mixins:[s.default],watch:{value:function(){var t=this;this.$nextTick((function(){return a.default.update(t.$el)}))}},mounted:function(){var t=this;this.$nextTick((function(){if(t.parentContainer=(0,l.default)(t.$parent,"md-input-container"),!t.parentContainer)throw t.$destroy(),new Error("You should wrap the md-textarea in a md-input-container");t.parentContainer.inputInstance=t,t.setParentDisabled(),t.setParentRequired(),t.setParentPlaceholder(),t.handleMaxLength(),t.updateValues(),t.$el.getAttribute("rows")||t.$el.setAttribute("rows","1"),(0,a.default)(t.$el),setTimeout((function(){return a.default.update(t.$el)}),200)}))},beforeDestroy:function(){a.default.destroy(this.$el)}},t.exports=e.default}),(function(t,e,n){var i,o,a;!(function(n,r){o=[e,t],i=r,void 0!==(a="function"==typeof i?i.apply(e,o):i)&&(t.exports=a)})(0,(function(t,e){"use strict";function n(t){function e(e){var n=t.style.width;t.style.width="0px",t.offsetWidth,t.style.width=n,t.style.overflowY=e}function n(t){for(var e=[];t&&t.parentNode&&t.parentNode instanceof Element;)t.parentNode.scrollTop&&e.push({node:t.parentNode,scrollTop:t.parentNode.scrollTop}),t=t.parentNode;return e}function i(){var e=t.style.height,i=n(t),o=document.documentElement&&document.documentElement.scrollTop;t.style.height="auto";var a=t.scrollHeight+s;if(0===t.scrollHeight)return void(t.style.height=e);t.style.height=a+"px",d=t.clientWidth,i.forEach((function(t){t.node.scrollTop=t.scrollTop})),o&&(document.documentElement.scrollTop=o)}function o(){i();var n=Math.round(parseFloat(t.style.height)),o=window.getComputedStyle(t,null),a=Math.round(parseFloat(o.height));if(a!==n?"visible"!==o.overflowY&&(e("visible"),i(),a=Math.round(parseFloat(window.getComputedStyle(t,null).height))):"hidden"!==o.overflowY&&(e("hidden"),i(),a=Math.round(parseFloat(window.getComputedStyle(t,null).height))),l!==a){l=a;var s=r("autosize:resized");try{t.dispatchEvent(s)}catch(t){}}}if(t&&t.nodeName&&"TEXTAREA"===t.nodeName&&!a.has(t)){var s=null,d=t.clientWidth,l=null,c=function(){t.clientWidth!==d&&o()},u=function(e){window.removeEventListener("resize",c,!1),t.removeEventListener("input",o,!1),t.removeEventListener("keyup",o,!1),t.removeEventListener("autosize:destroy",u,!1),t.removeEventListener("autosize:update",o,!1),Object.keys(e).forEach((function(n){t.style[n]=e[n]})),a.delete(t)}.bind(t,{height:t.style.height,resize:t.style.resize,overflowY:t.style.overflowY,overflowX:t.style.overflowX,wordWrap:t.style.wordWrap});t.addEventListener("autosize:destroy",u,!1),"onpropertychange"in t&&"oninput"in t&&t.addEventListener("keyup",o,!1),window.addEventListener("resize",c,!1),t.addEventListener("input",o,!1),t.addEventListener("autosize:update",o,!1),t.style.overflowX="hidden",t.style.wordWrap="break-word",a.set(t,{destroy:u,update:o}),(function(){var e=window.getComputedStyle(t,null);"vertical"===e.resize?t.style.resize="none":"both"===e.resize&&(t.style.resize="horizontal"),s="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(s)&&(s=0),o()})()}}function i(t){var e=a.get(t);e&&e.destroy()}function o(t){var e=a.get(t);e&&e.update()}var a="function"==typeof Map?new Map:(function(){var t=[],e=[];return{has:function(e){return t.indexOf(e)>-1},get:function(n){return e[t.indexOf(n)]},set:function(n,i){-1===t.indexOf(n)&&(t.push(n),e.push(i))},delete:function(n){var i=t.indexOf(n);i>-1&&(t.splice(i,1),e.splice(i,1))}}})(),r=function(t){return new Event(t,{bubbles:!0})};try{new Event("test")}catch(t){r=function(t){var e=document.createEvent("Event");return e.initEvent(t,!0,!1),e}}var s=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?(s=function(t){return t},s.destroy=function(t){return t},s.update=function(t){return t}):(s=function(t,e){return t&&Array.prototype.forEach.call(t.length?t:[t],(function(t){return n(t)})),t},s.destroy=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],i),t},s.update=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],o),t}),e.exports=s}))}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("textarea",{staticClass:"md-input",attrs:{name:t.name,disabled:t.disabled,required:t.required,placeholder:t.placeholder,maxlength:t.maxlength,readonly:t.readonly},domProps:{value:t.value},on:{focus:t.onFocus,blur:t.onBlur,input:t.onInput}})},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-input-container.md-input-invalid:after{background-color:WARN-COLOR}.THEME_NAME.md-input-container.md-input-invalid label,.THEME_NAME.md-input-container.md-input-invalid input,.THEME_NAME.md-input-container.md-input-invalid textarea,.THEME_NAME.md-input-container.md-input-invalid .md-error,.THEME_NAME.md-input-container.md-input-invalid .md-count,.THEME_NAME.md-input-container.md-input-invalid .md-icon:not(.md-icon-delete){color:WARN-COLOR}.THEME_NAME.md-input-container.md-input-focused.md-input-inline label{color:rgba(0,0,0,0.54)}.THEME_NAME.md-input-container.md-input-focused.md-input-required label:after{color:WARN-COLOR}.THEME_NAME.md-input-container.md-input-focused:after{height:2px;background-color:PRIMARY-COLOR}.THEME_NAME.md-input-container.md-input-focused input,.THEME_NAME.md-input-container.md-input-focused textarea{color:PRIMARY-COLOR;text-shadow:0 0 0 BACKGROUND-CONTRAST;-webkit-text-fill-color:transparent}.THEME_NAME.md-input-container.md-input-focused label,.THEME_NAME.md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:PRIMARY-COLOR}.THEME_NAME.md-input-container.md-input-disabled label,.THEME_NAME.md-input-container.md-input-disabled input,.THEME_NAME.md-input-container.md-input-disabled textarea,.THEME_NAME.md-input-container.md-input-disabled .md-error,.THEME_NAME.md-input-container.md-input-disabled .md-count,.THEME_NAME.md-input-container.md-input-disabled .md-icon:not(.md-icon-delete),.THEME_NAME.md-input-container.md-input-disabled ::-webkit-input-placeholder{color:BACKGROUND-CONTRAST-0.38}\n"}),(function(t,e,n){"use strict";function i(t){t.component("md-layout",a.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;var o=n(243),a=(function(t){return t&&t.__esModule?t:{default:t}})(o);t.exports=e.default}),(function(t,e,n){function i(t){n(244)}var o=n(0)(n(245),null,i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-layout",props:{mdTag:{type:String,default:"div"},mdRow:Boolean,mdRowXsmall:Boolean,mdRowSmall:Boolean,mdRowMedium:Boolean,mdRowLarge:Boolean,mdRowXlarge:Boolean,mdColumn:Boolean,mdColumnXsmall:Boolean,mdColumnSmall:Boolean,mdColumnMedium:Boolean,mdColumnLarge:Boolean,mdColumnXlarge:Boolean,mdHideXsmall:Boolean,mdHideSmall:Boolean,mdHideMedium:Boolean,mdHideLarge:Boolean,mdHideXlarge:Boolean,mdHideXsmallAndUp:Boolean,mdHideSmallAndUp:Boolean,mdHideMediumAndUp:Boolean,mdHideLargeAndUp:Boolean,mdHideXlargeAndUp:Boolean,mdGutter:[String,Number,Boolean],mdAlign:String,mdAlignXsmall:String,mdAlignSmall:String,mdAlignMedium:String,mdAlignLarge:String,mdAlignXlarge:String,mdVerticalAlign:String,mdVerticalAlignXsmall:String,mdVerticalAlignSmall:String,mdVerticalAlignMedium:String,mdVerticalAlignLarge:String,mdVerticalAlignXlarge:String,mdFlex:[String,Number,Boolean],mdFlexXsmall:[String,Number,Boolean],mdFlexSmall:[String,Number,Boolean],mdFlexMedium:[String,Number,Boolean],mdFlexLarge:[String,Number,Boolean],mdFlexXlarge:[String,Number,Boolean],mdFlexOffset:[String,Number,Boolean],mdFlexOffsetXsmall:[String,Number,Boolean],mdFlexOffsetSmall:[String,Number,Boolean],mdFlexOffsetMedium:[String,Number,Boolean],mdFlexOffsetLarge:[String,Number,Boolean],mdFlexOffsetXlarge:[String,Number,Boolean]},computed:{classes:function(){var t={"md-row":this.mdRow,"md-row-xsmall":this.mdRowXsmall,"md-row-small":this.mdRowSmall,"md-row-medium":this.mdRowMedium,"md-row-large":this.mdRowLarge,"md-row-xlarge":this.mdRowXlarge,"md-column":this.mdColumn,"md-column-xsmall":this.mdColumnXsmall,"md-column-small":this.mdColumnSmall,"md-column-medium":this.mdColumnMedium,"md-column-large":this.mdColumnLarge,"md-column-xlarge":this.mdColumnXlarge,"md-hide-xsmall":this.mdHideXsmall,"md-hide-small":this.mdHideSmall,"md-hide-medium":this.mdHideMedium,"md-hide-large":this.mdHideLarge,"md-hide-xlarge":this.mdHideXlarge,"md-hide-xsmall-and-up":this.mdHideXsmallAndUp,"md-hide-small-and-up":this.mdHideSmallAndUp,"md-hide-medium-and-up":this.mdHideMediumAndUp,"md-hide-large-and-up":this.mdHideLargeAndUp,"md-hide-xlarge-and-up":this.mdHideXlargeAndUp};return this.mdGutter&&("boolean"==typeof this.mdGutter?t["md-gutter"]=!0:this.mdGutter&&(t["md-gutter-"+this.mdGutter]=!0)),this.generatePropClasses("md-flex","","mdFlex",t),this.generatePropClasses("md-flex","xsmall","mdFlexXsmall",t),this.generatePropClasses("md-flex","small","mdFlexSmall",t),this.generatePropClasses("md-flex","medium","mdFlexMedium",t),this.generatePropClasses("md-flex","large","mdFlexLarge",t),this.generatePropClasses("md-flex","xlarge","mdFlexXlarge",t),this.generatePropClasses("md-flex-offset","","mdFlexOffset",t),this.generatePropClasses("md-flex-offset","xsmall","mdFlexOffsetXsmall",t),this.generatePropClasses("md-flex-offset","small","mdFlexOffsetSmall",t),this.generatePropClasses("md-flex-offset","medium","mdFlexOffsetMedium",t),this.generatePropClasses("md-flex-offset","large","mdFlexOffsetLarge",t),this.generatePropClasses("md-flex-offset","xlarge","mdFlexOffsetXlarge",t),this.generatePropClasses("md-align","","mdAlign",t),this.generatePropClasses("md-align","xsmall","mdAlignXsmall",t),this.generatePropClasses("md-align","small","mdAlignSmall",t),this.generatePropClasses("md-align","medium","mdAlignMedium",t),this.generatePropClasses("md-align","large","mdAlignLarge",t),this.generatePropClasses("md-align","xlarge","mdAlignXlarge",t),this.generatePropClasses("md-vertical-align","","mdVerticalAlign",t),this.generatePropClasses("md-vertical-align","xsmall","mdVerticalAlignXsmall",t),this.generatePropClasses("md-vertical-align","small","mdVerticalAlignSmall",t),this.generatePropClasses("md-vertical-align","medium","mdVerticalAlignMedium",t),this.generatePropClasses("md-vertical-align","large","mdVerticalAlignLarge",t),this.generatePropClasses("md-vertical-align","xlarge","mdVerticalAlignXlarge",t),t}},methods:{generatePropClasses:function(t,e,n,i){e&&(e="-"+e),this[n]&&("boolean"==typeof this[n]?this[n]?i[t+e]=!0:i[t+e+"-none"]=!0:i[t+e+"-"+this[n]]=!0)}},render:function(t){return t(this.mdTag,{staticClass:"md-layout",class:this.classes},this.$slots.default)}},t.exports=e.default}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-list",r.default),t.component("md-list-item",d.default),t.component("md-list-expand",c.default),t.material.styles.push(m.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(247),r=i(a),s=n(251),d=i(s),l=n(283),c=i(l),u=n(286),m=i(u);t.exports=e.default}),(function(t,e,n){function i(t){n(248)}var o=n(0)(n(249),n(250),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-list",mixins:[o.default]},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("ul",{staticClass:"md-list",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(252),a=i(o),r=n(253),s=i(r),d=n(268),l=i(d),c=n(271),u=i(c),m=n(274),f=i(m),h=n(277),p=i(h),b=n(280),v=i(b);e.default={functional:!0,props:{href:String,disabled:Boolean},render:function(t,e){var n=e.children,i=e.data,o=e.props;return t(function(){var t=i.on,e=["contextmenu","dblclick","dragend","mousedown","touchstart","click"],a=n.length;if(o.href)return u.default;for(;a--;){var r=n[a].componentOptions;if(r)if("md-list-expand"===r.tag){var d=(function(){var t=n[a];return i.scopedSlots={expand:function(){return t}},n.splice(a,1),{v:p.default}})();if("object"===(void 0===d?"undefined":(0,s.default)(d)))return d.v}else if("router-link"===r.tag)return n[a].data.staticClass="md-list-item-container md-button",f.default}if(t)for(var c=e.length;c--;)if(t[e[c]])return l.default;return v.default}(),(0,a.default)({props:o},i),n)}},t.exports=e.default}),(function(t,e,n){"use strict";e.__esModule=!0;var i=n(44),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default=o.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(254),a=i(o),r=n(256),s=i(r),d="function"==typeof s.default&&"symbol"==typeof a.default?function(t){return typeof t}:function(t){return t&&"function"==typeof s.default&&t.constructor===s.default&&t!==s.default.prototype?"symbol":typeof t};e.default="function"==typeof s.default&&"symbol"===d(a.default)?function(t){return void 0===t?"undefined":d(t)}:function(t){return t&&"function"==typeof s.default&&t.constructor===s.default&&t!==s.default.prototype?"symbol":void 0===t?"undefined":d(t)}}),(function(t,e,n){t.exports={default:n(255),__esModule:!0}}),(function(t,e,n){n(48),n(68),t.exports=n(63).f("iterator")}),(function(t,e,n){t.exports={default:n(257),__esModule:!0}}),(function(t,e,n){n(258),n(265),n(266),n(267),t.exports=n(4).Symbol}),(function(t,e,n){"use strict";var i=n(2),o=n(8),a=n(3),r=n(16),s=n(49),d=n(259).KEY,l=n(5),c=n(22),u=n(37),m=n(20),f=n(12),h=n(63),p=n(64),b=n(260),v=n(261),g=n(262),E=n(13),_=n(7),C=n(27),M=n(17),T=n(50),A=n(263),x=n(264),y=n(9),N=n(18),O=x.f,S=y.f,R=A.f,w=i.Symbol,k=i.JSON,H=k&&k.stringify,P=f("_hidden"),L=f("toPrimitive"),$={}.propertyIsEnumerable,I=c("symbol-registry"),B=c("symbols"),D=c("op-symbols"),F=Object.prototype,j="function"==typeof w,W=i.QObject,Y=!W||!W.prototype||!W.prototype.findChild,V=a&&l((function(){return 7!=T(S({},"a",{get:function(){return S(this,"a",{value:7}).a}})).a}))?function(t,e,n){var i=O(F,e);i&&delete F[e],S(t,e,n),i&&t!==F&&S(F,e,i)}:S,U=function(t){var e=B[t]=T(w.prototype);return e._k=t,e},G=j&&"symbol"==typeof w.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof w},z=function(t,e,n){return t===F&&z(D,e,n),E(t),e=C(e,!0),E(n),o(B,e)?(n.enumerable?(o(t,P)&&t[P][e]&&(t[P][e]=!1),n=T(n,{enumerable:M(0,!1)})):(o(t,P)||S(t,P,M(1,{})),t[P][e]=!0),V(t,e,n)):S(t,e,n)},q=function(t,e){E(t);for(var n,i=v(e=_(e)),o=0,a=i.length;a>o;)z(t,n=i[o++],e[n]);return t},K=function(t,e){return void 0===e?T(t):q(T(t),e)},X=function(t){var e=$.call(this,t=C(t,!0));return!(this===F&&o(B,t)&&!o(D,t))&&(!(e||!o(this,t)||!o(B,t)||o(this,P)&&this[P][t])||e)},J=function(t,e){if(t=_(t),e=C(e,!0),t!==F||!o(B,e)||o(D,e)){var n=O(t,e);return!n||!o(B,e)||o(t,P)&&t[P][e]||(n.enumerable=!0),n}},Q=function(t){for(var e,n=R(_(t)),i=[],a=0;n.length>a;)o(B,e=n[a++])||e==P||e==d||i.push(e);return i},Z=function(t){for(var e,n=t===F,i=R(n?D:_(t)),a=[],r=0;i.length>r;)!o(B,e=i[r++])||n&&!o(F,e)||a.push(B[e]);return a};j||(w=function(){if(this instanceof w)throw TypeError("Symbol is not a constructor!");var t=m(arguments.length>0?arguments[0]:void 0),e=function(n){this===F&&e.call(D,n),o(this,P)&&o(this[P],t)&&(this[P][t]=!1),V(this,t,M(1,n))};return a&&Y&&V(F,t,{configurable:!0,set:e}),U(t)},s(w.prototype,"toString",(function(){return this._k})),x.f=J,y.f=z,n(79).f=A.f=Q,n(39).f=X,n(41).f=Z,a&&!n(40)&&s(F,"propertyIsEnumerable",X,!0),h.f=function(t){return U(f(t))}),r(r.G+r.W+r.F*!j,{Symbol:w});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;)f(tt[et++]);for(var tt=N(f.store),et=0;tt.length>et;)p(tt[et++]);r(r.S+r.F*!j,"Symbol",{for:function(t){return o(I,t+="")?I[t]:I[t]=w(t)},keyFor:function(t){if(G(t))return b(I,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){Y=!0},useSimple:function(){Y=!1}}),r(r.S+r.F*!j,"Object",{create:K,defineProperty:z,defineProperties:q,getOwnPropertyDescriptor:J,getOwnPropertyNames:Q,getOwnPropertySymbols:Z}),k&&r(r.S+r.F*(!j||l((function(){var t=w();return"[null]"!=H([t])||"{}"!=H({a:t})||"{}"!=H(Object(t))}))),"JSON",{stringify:function(t){if(void 0!==t&&!G(t)){for(var e,n,i=[t],o=1;arguments.length>o;)i.push(arguments[o++]);return e=i[1],"function"==typeof e&&(n=e),!n&&g(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!G(e))return e}),i[1]=e,H.apply(k,i)}}}),w.prototype[L]||n(10)(w.prototype,L,w.prototype.valueOf),u(w,"Symbol"),u(Math,"Math",!0),u(i.JSON,"JSON",!0)}),(function(t,e,n){var i=n(20)("meta"),o=n(6),a=n(8),r=n(9).f,s=0,d=Object.isExtensible||function(){return!0},l=!n(5)((function(){return d(Object.preventExtensions({}))})),c=function(t){r(t,i,{value:{i:"O"+ ++s,w:{}}})},u=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!a(t,i)){if(!d(t))return"F";if(!e)return"E";c(t)}return t[i].i},m=function(t,e){if(!a(t,i)){if(!d(t))return!0;if(!e)return!1;c(t)}return t[i].w},f=function(t){return l&&h.NEED&&d(t)&&!a(t,i)&&c(t),t},h=t.exports={KEY:i,NEED:!1,fastKey:u,getWeak:m,onFreeze:f}}),(function(t,e,n){var i=n(18),o=n(7);t.exports=function(t,e){for(var n,a=o(t),r=i(a),s=r.length,d=0;s>d;)if(a[n=r[d++]]===e)return n}}),(function(t,e,n){var i=n(18),o=n(41),a=n(39);t.exports=function(t){var e=i(t),n=o.f;if(n)for(var r,s=n(t),d=a.f,l=0;s.length>l;)d.call(t,r=s[l++])&&e.push(r);return e}}),(function(t,e,n){var i=n(24);t.exports=Array.isArray||function(t){return"Array"==i(t)}}),(function(t,e,n){var i=n(7),o=n(79).f,a={}.toString,r="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return o(t)}catch(t){return r.slice()}};t.exports.f=function(t){return r&&"[object Window]"==a.call(t)?s(t):o(i(t))}}),(function(t,e,n){var i=n(39),o=n(17),a=n(7),r=n(27),s=n(8),d=n(31),l=Object.getOwnPropertyDescriptor;e.f=n(3)?l:function(t,e){if(t=a(t),e=r(e,!0),d)try{return l(t,e)}catch(t){}if(s(t,e))return o(!i.f.call(t,e),t[e])}}),(function(t,e){}),(function(t,e,n){n(64)("asyncIterator")}),(function(t,e,n){n(64)("observable")}),(function(t,e,n){var i=n(0)(n(269),n(270),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item",props:{disabled:Boolean},computed:{classes:function(){return{"md-disabled":this.disabled}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item",class:t.classes},[n("div",{staticClass:"md-list-item-container md-button"},[t._t("default")],2),t._v(" "),n("md-button",{staticClass:"md-button-ghost",attrs:{type:"button",disabled:t.disabled},on:{click:function(e){t.$emit("click",e)}}})],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(272),n(273),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item",props:{href:String,target:String,disabled:Boolean},computed:{classes:function(){return{"md-disabled":this.disabled}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item",class:t.classes},[n("a",{staticClass:"md-list-item-container md-button",attrs:{href:t.href,target:t.target,disabled:t.disabled},on:{click:function(e){t.$emit("click",e)}}},[t._t("default")],2),t._v(" "),n("md-ink-ripple",{attrs:{disabled:t.disabled}})],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(275),n(276),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item",props:{disabled:Boolean},computed:{classes:function(){return{"md-disabled":this.disabled}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item",class:t.classes,attrs:{disabled:t.disabled}},[t._t("default"),t._v(" "),n("md-ink-ripple",{attrs:{disabled:t.disabled}})],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(278),n(279),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(11),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-list-item",props:{disabled:Boolean,mdExpandMultiple:Boolean},data:function(){return{parentList:!1,active:!1,height:0,contentObserver:null,transitionOff:!0}},computed:{classes:function(){return{"md-disabled":this.disabled,"md-active":this.active}},expandClasses:function(){return{"md-transition-off":this.transitionOff}},expandStyles:function(){return{"margin-bottom":this.height}}},methods:{resetSiblings:function(){var t=this;this.parentList.$children.forEach((function(e){e.$el!==t.$el&&e.$el.classList.contains("md-list-item-expand")&&(e.active=!1)}))},calculatePadding:function(){var t=this;window.requestAnimationFrame((function(){t._destroyed||(t.height=-t.$refs.expand.scrollHeight+"px",window.setTimeout((function(){t.transitionOff=!1})))}))},toggleExpandList:function(t){this.mdExpandMultiple||this.resetSiblings(),this.calculatePadding(),this.active=!this.active,this.$emit("click",t)},recalculateAfterChange:function(){this.transitionOff=!0,this.calculatePadding()},observeChildChanges:function(){this.contentObserver=new MutationObserver(this.recalculateAfterChange),this.contentObserver.observe(this.$refs.expand,{childList:!0,characterData:!0,subtree:!0})}},mounted:function(){var t=this;this.$nextTick((function(){t.parentList=(0,o.default)(t.$parent,"md-list"),t.calculatePadding(),t.observeChildChanges(),window.addEventListener("resize",t.recalculateAfterChange)}))},beforeDestroy:function(){this.contentObserver&&this.contentObserver.disconnect(),window.removeEventListener("resize",this.recalculateAfterChange),this._destroyed=!0}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item md-list-item-expand",class:t.classes},[n("div",{staticClass:"md-list-item-container md-button"},[t._t("default"),t._v(" "),n("md-icon",{staticClass:"md-list-expand-indicator"},[t._v("keyboard_arrow_down")])],2),t._v(" "),n("md-button",{staticClass:"md-button-ghost",attrs:{type:"button",disabled:t.disabled},on:{click:t.toggleExpandList}}),t._v(" "),n("div",{ref:"expand",staticClass:"md-list-expand",class:t.expandClasses,style:t.expandStyles},[t._t("expand")],2)],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(281),n(282),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-item"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"md-list-item"},[n("div",{staticClass:"md-list-item-container"},[t._t("default")],2)])},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(284),n(285),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-list-expand"},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-list-expand-container"},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-list{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}.THEME_NAME.md-list.md-transparent{background-color:transparent;color:inherit}.THEME_NAME.md-list .md-list-item .router-link-active.md-list-item-container{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item .router-link-active.md-list-item-container>.md-icon{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item.md-primary .md-list-item-container{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item.md-primary .md-list-item-container>.md-icon{color:PRIMARY-COLOR}.THEME_NAME.md-list .md-list-item.md-accent .md-list-item-container{color:ACCENT-COLOR}.THEME_NAME.md-list .md-list-item.md-accent .md-list-item-container>.md-icon{color:ACCENT-COLOR}.THEME_NAME.md-list .md-list-item.md-warn .md-list-item-container{color:WARN-COLOR}.THEME_NAME.md-list .md-list-item.md-warn .md-list-item-container>.md-icon{color:WARN-COLOR}.THEME_NAME.md-list .md-list-item-expand .md-list-item-container{background-color:BACKGROUND-COLOR}.THEME_NAME.md-list .md-list-item-expand .md-list-item-container:hover,.THEME_NAME.md-list .md-list-item-expand .md-list-item-container:focus{background-color:rgba(153,153,153,0.2)}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-menu",r.default),t.component("md-menu-item",d.default),t.component("md-menu-content",c.default),t.material.styles.push(m.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(288),r=i(a),s=n(293),d=i(s),l=n(297),c=i(l),u=n(300),m=i(u);t.exports=e.default}),(function(t,e,n){function i(t){n(289)}var o=n(0)(n(290),n(292),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(42),a=i(o),r=n(291),s=i(r);e.default={name:"md-menu",props:{mdSize:{type:[Number,String],default:0},mdDirection:{type:String,default:"bottom right"},mdAlignTrigger:{type:Boolean,default:!1},mdOffsetX:{type:[Number,String],default:0},mdOffsetY:{type:[Number,String],default:0},mdCloseOnSelect:{type:Boolean,default:!0},mdAutoWidth:{type:Boolean,default:!1},mdFixed:{type:Boolean,default:!1},mdNoFocus:{type:Boolean,default:!1},mdManualToggle:{type:Boolean,default:!1},mdMaxHeight:{type:Number,default:0}},data:function(){return{active:!1}},watch:{mdSize:function(t,e){t>=1&&t<=7&&(this.removeLastSizeMenuContentClass(e),this.addNewSizeMenuContentClass(t))},mdDirection:function(t,e){this.removeLastDirectionMenuContentClass(e),this.addNewDirectionMenuContentClass(t)},mdAlignTrigger:function(t){this.handleAlignTriggerClass(t)}},methods:{validateMenu:function(){if(!this.menuContent)throw this.$destroy(),new Error("You must have a md-menu-content inside your menu.");if(!this.menuTrigger)throw this.$destroy(),new Error("You must have an element with a md-menu-trigger attribute inside your menu.")},removeLastSizeMenuContentClass:function(t){this.menuContent.classList.remove("md-size-"+t)},removeLastDirectionMenuContentClass:function(t){this.menuContent.classList.remove("md-direction-"+t.replace(/ /g,"-"))},addNewSizeMenuContentClass:function(t){this.menuContent.classList.add("md-size-"+t)},addNewDirectionMenuContentClass:function(t){this.menuContent.classList.add("md-direction-"+t.replace(/ /g,"-"))},handleAlignTriggerClass:function(t){t&&this.menuContent.classList.add("md-align-trigger")},getPosition:function(t,e){var n=this.menuTrigger.getBoundingClientRect(),i="top"===t?n.top+n.height-this.menuContent.offsetHeight:n.top,o="left"===e?n.left-this.menuContent.offsetWidth+n.width:n.left;return i+=parseInt(this.mdOffsetY,10),o+=parseInt(this.mdOffsetX,10),this.mdAlignTrigger&&("top"===t?i-=n.height+11:i+=n.height+11),{top:i,left:o}},calculateMenuContentPos:function(){var t=void 0,e=void 0;if(!this._destroyed){if(t=this.mdDirection?this.getPosition.apply(this,this.mdDirection.trim().split(" ")):this.getPosition("bottom","right"),this.mdAutoWidth&&(e=this.menuTrigger.getBoundingClientRect().width,this.menuContent.style.width=parseInt(e,10)+"px"),this.mdFixed){if(0===this.mdMaxHeight)this.menuContent.style.maxHeight=window.innerHeight-this.menuTrigger.getBoundingClientRect().bottom-8+"px";else if(this.menuContent.children[0].children.length>0){var n=this.menuContent.children[0].children[0].clientHeight;this.menuContent.style.maxHeight=16+n*this.mdMaxHeight+"px"}}else t=(0,s.default)(this.menuContent,t);this.menuContent.style.top=t.top+window.pageYOffset+"px",this.menuContent.style.left=t.left+window.pageXOffset+"px"}},recalculateOnResize:function(){window.requestAnimationFrame(this.calculateMenuContentPos)},open:function(){document.body.contains(this.menuContent)&&document.body.removeChild(this.menuContent),document.body.appendChild(this.menuContent),document.body.appendChild(this.backdropElement),window.addEventListener("resize",this.recalculateOnResize),this.calculateMenuContentPos(),getComputedStyle(this.menuContent).top,this.menuContent.classList.add("md-active"),this.mdNoFocus||this.menuContent.focus(),this.active=!0,this.$emit("open")},close:function(){var t=this,e=function e(n){if(t.menuContent&&n.target===t.menuContent){var i=t.menuContent.querySelector(".md-ripple.md-active");t.menuContent.removeEventListener(a.default,e),t.mdNoFocus||t.menuTrigger.focus(),t.active=!1,i&&i.classList.remove("md-active"),document.body.contains(t.menuContent)&&document.body.removeChild(t.menuContent),document.body.contains(t.backdropElement)&&document.body.removeChild(t.backdropElement),window.removeEventListener("resize",t.recalculateOnResize)}};this.menuContent.addEventListener(a.default,e),this.menuContent.classList.remove("md-active"),this.$emit("close")},toggle:function(){this.active?this.close():this.open()}},mounted:function(){var t=this;this.$nextTick((function(){t.menuTrigger=t.$el.querySelector("[md-menu-trigger]"),t.menuContent=t.$el.querySelector(".md-menu-content"),t.backdropElement=t.$refs.backdrop.$el,t.validateMenu(),t.handleAlignTriggerClass(t.mdAlignTrigger),t.addNewSizeMenuContentClass(t.mdSize),t.addNewDirectionMenuContentClass(t.mdDirection),t.$el.removeChild(t.$refs.backdrop.$el),t.menuContent.parentNode.removeChild(t.menuContent),t.mdManualToggle||t.menuTrigger.addEventListener("click",t.toggle)}))},beforeDestroy:function(){document.body.contains(this.menuContent)&&(document.body.removeChild(this.menuContent),document.body.removeChild(this.backdropElement)),this.mdManualToggle||this.menuTrigger.removeEventListener("click",this.toggle),window.removeEventListener("resize",this.recalculateOnResize),this._destroyed=!0}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e){return e.top<=0-parseInt(getComputedStyle(t).marginTop,10)},o=function(t,e){return e.top+t.offsetHeight+0>=window.innerHeight-parseInt(getComputedStyle(t).marginTop,10)},a=function(t,e){return e.left<=0-parseInt(getComputedStyle(t).marginLeft,10)},r=function(t,e){return e.left+t.offsetWidth+0>=window.innerWidth-parseInt(getComputedStyle(t).marginLeft,10)},s=function(t,e){var n=getComputedStyle(t);return i(t,e)&&(e.top=0-parseInt(n.marginTop,10)),a(t,e)&&(e.left=0-parseInt(n.marginLeft,10)),r(t,e)&&(e.left=window.innerWidth-0-t.offsetWidth-parseInt(n.marginLeft,10)),o(t,e)&&(e.top=window.innerHeight-0-t.offsetHeight-parseInt(n.marginTop,10)),e};e.default=s,t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-menu"},[t._t("default"),t._v(" "),n("md-backdrop",{ref:"backdrop",staticClass:"md-menu-backdrop md-transparent md-active",on:{close:t.close}})],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(294),n(296),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(11),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);n(295),e.default={name:"md-menu-item",props:{href:String,target:String,disabled:Boolean,listIndex:{type:Number,default:-1},manualHighlight:{type:Boolean,default:!1}},data:function(){return{parentContent:{},index:0,highlighted:!1}},computed:{classes:function(){return{"md-highlighted":this.highlighted}},getHighlight:function(){if(!this.manualHighlight)return this.index===this.parentContent.highlighted?(this.disabled&&(this.parentContent.oldHighlight>this.parentContent.highlighted?this.parentContent.highlighted--:this.parentContent.highlighted++),1===this.index?this.parentContent.$el.scrollTop=0:this.index===this.parentContent.itemsAmount?this.parentContent.$el.scrollTop=this.parentContent.$el.scrollHeight:this.$el.scrollIntoViewIfNeeded(!1),this.highlighted=!0,!0):(this.highlighted=!1,!1)}},methods:{close:function(t){this.parentMenu.mdManualToggle?this.disabled||(this.$emit("click",t),this.$emit("selected",t)):this.disabled||(this.parentMenu.mdCloseOnSelect&&this.parentContent.close(),this.$emit("click",t),this.$emit("selected",t))}},mounted:function(){if(this.parentContent=(0,o.default)(this.$parent,"md-menu-content"),this.parentMenu=(0,o.default)(this.$parent,"md-menu"),!this.parentContent)throw this.$destroy(),new Error("You must wrap the md-menu-item in a md-menu-content");-1===this.listIndex?(this.parentContent.itemListCount++,this.index=this.parentContent.itemListCount):this.index=this.listIndex+1}},t.exports=e.default}),(function(t,e){Element.prototype.scrollIntoViewIfNeeded||(Element.prototype.scrollIntoViewIfNeeded=function(t){t=0===arguments.length||!!t;var e=this.parentNode,n=window.getComputedStyle(e,null),i=parseInt(n.getPropertyValue("border-top-width")),o=parseInt(n.getPropertyValue("border-left-width")),a=this.offsetTop-e.offsetTop<e.scrollTop,r=this.offsetTop-e.offsetTop+this.clientHeight-i>e.scrollTop+e.clientHeight,s=this.offsetLeft-e.offsetLeft<e.scrollLeft,d=this.offsetLeft-e.offsetLeft+this.clientWidth-o>e.scrollLeft+e.clientWidth,l=a&&!r;(a||r)&&t&&(e.scrollTop=this.offsetTop-e.offsetTop-e.clientHeight/2-i+this.clientHeight/2),(s||d)&&t&&(e.scrollLeft=this.offsetLeft-e.offsetLeft-e.clientWidth/2-o+this.clientWidth/2),(a||r||s||d)&&!t&&this.scrollIntoView(l)})}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("md-list-item",{staticClass:"md-menu-item",class:t.classes,attrs:{href:t.href,target:t.target,disabled:t.disabled},on:{click:t.close}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(298),n(299),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-menu-content",data:function(){return{oldHighlight:!1,highlighted:!1,itemsAmount:0,itemListCount:0}},methods:{close:function(){this.highlighted=!1,this.$parent.close()},highlightItem:function(t){this.itemsAmount=this.$children[0].$children.length,this.itemsAmount<this.highlighted-1&&(this.highlighted=1),this.oldHighlight=this.highlighted,"up"===t&&(1===this.highlighted?this.highlighted=this.itemsAmount:this.highlighted--),"down"===t&&(this.highlighted===this.itemsAmount?this.highlighted=1:this.highlighted++),this.$children[0].$children[this.highlighted-1].$el.scrollIntoView({block:"end",behavior:"smooth"});for(var e=0;e<this.itemsAmount;e++)this.$children[0].$children[e].highlighted=!1;this.$children[0].$children[this.highlighted-1].highlighted=!0},fireClick:function(){this.highlighted>0&&this.getOptions()[this.highlighted-1].$el.click()},getOptions:function(){return this.$children[0].$children.filter((function(t){return t.$el.classList.contains("md-option")}))}},mounted:function(){if(!this.$parent.$el.classList.contains("md-menu"))throw this.$destroy(),new Error("You must wrap the md-menu-content in a md-menu")}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-menu-content",attrs:{tabindex:"-1"},on:{keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;e.preventDefault(),t.close(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"tab",9))return null;e.preventDefault(),t.close(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38))return null;e.preventDefault(),t.highlightItem("up")},function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40))return null;e.preventDefault(),t.highlightItem("down")},function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;t.fireClick(e)},function(e){if(!("button"in e)&&t._k(e.keyCode,"space",32))return null;t.fireClick(e)}]}},[n("md-list",[t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".md-menu-content .THEME_NAME.md-list{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}.md-menu-content .THEME_NAME.md-list .md-menu-item:hover .md-button:not([disabled]),.md-menu-content .THEME_NAME.md-list .md-menu-item:focus .md-button:not([disabled]),.md-menu-content .THEME_NAME.md-list .md-menu-item.md-highlighted .md-button:not([disabled]){background-color:BACKGROUND-CONTRAST-0.12}.md-menu-content .THEME_NAME.md-list .md-menu-item[disabled]{color:BACKGROUND-CONTRAST-0.38}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-boards",r.default),t.component("md-board",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(302),r=i(a),s=n(306),d=i(s),l=n(309),c=i(l);t.exports=e.default}),(function(t,e,n){function i(t){n(303)}var o=n(0)(n(304),n(305),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(1),s=i(r),d=n(59),l=i(d);e.default={props:{mdFixed:Boolean,mdCentered:Boolean,mdRight:Boolean,mdDynamicHeight:{type:Boolean,default:!0},mdElevation:{type:[String,Number],default:0},mdAuto:{type:Boolean,default:!1},mdDuration:{type:Number,default:5e3},mdControls:{type:Boolean,default:!1},mdInfinite:{type:Boolean,default:!1},mdSwipeable:Boolean,mdSwipeDistance:{type:Number,default:100}},mixins:[s.default],data:function(){return{boardList:{},activeBoard:null,activeBoardNumber:0,hasIcons:!1,hasLabel:!1,transitionControl:null,transitionOff:!1,contentHeight:"0px",contentWidth:"0px",autoTransition:null}},computed:{boardClasses:function(){return{"md-dynamic-height":this.mdDynamicHeight,"md-transition-off":this.transitionOff}},navigationClasses:function(){return{"md-has-icon":this.hasIcons,"md-has-label":this.hasLabel,"md-fixed":this.mdFixed,"md-right":!this.mdCentered&&this.mdRight,"md-centered":this.mdCentered||this.mdFixed}},indicatorClasses:function(){var t=this.lastIndicatorNumber>this.activeBoardNumber;return this.lastIndicatorNumber=this.activeBoardNumber,{"md-transition-off":this.transitionOff,"md-to-right":!t,"md-to-left":t}}},methods:{getHeaderClass:function(t){return{"md-active":this.activeBoard===t.id,"md-disabled":t.disabled}},registerBoard:function(t){this.boardList[t.id]=t},unregisterBoard:function(t){delete this.boardList[t.id]},updateBoard:function(t){if(this.registerBoard(t),t.active)if(t.disabled){if((0,a.default)(this.boardList).length){var e=(0,a.default)(this.boardList),n=e.indexOf(t.id)+1,i=e[n];i?this.setActiveBoard(this.boardList[i]):this.setActiveBoard(this.boardList[0])}}else this.setActiveBoard(t)},observeElementChanges:function(){this.parentObserver=new MutationObserver((0,l.default)(this.calculateOnWatch,50)),this.parentObserver.observe(this.$refs.boardsContent,{childList:!0,attributes:!0,subtree:!0})},getBoardIndex:function(t){return(0,a.default)(this.boardList).indexOf(t)},calculateIndicatorPos:function(){if(this.$refs.boardHeader&&this.$refs.boardHeader[this.activeBoardNumber]){var t=this.$el.offsetWidth,e=this.$refs.boardHeader[this.activeBoardNumber],n=e.offsetLeft,i=t-n-e.offsetWidth;this.$refs.indicator.style.left=n+"px",this.$refs.indicator.style.right=i+"px"}},calculateBoardsWidthAndPosition:function(){var t=this.$el.offsetWidth,e=0;this.contentWidth=t*this.activeBoardNumber+"px";for(var n in this.boardList){var i=this.boardList[n];i.ref.width=t+"px",i.ref.left=t*e+"px",e++}},calculateContentHeight:function(){var t=this;this.$nextTick((function(){if((0,a.default)(t.boardList).length){var e=t.boardList[t.activeBoard].ref.$el.offsetHeight;t.contentHeight=e+"px"}}))},calculatePosition:function(){var t=this;window.requestAnimationFrame((function(){t._destroyed||(t.calculateIndicatorPos(),t.calculateBoardsWidthAndPosition(),t.calculateContentHeight())}))},debounceTransition:function(){var t=this;window.clearTimeout(this.transitionControl),this.transitionControl=window.setTimeout((function(){t.calculatePosition(),t.transitionOff=!1}),200)},calculateOnWatch:function(){this.calculatePosition(),this.debounceTransition()},calculateOnResize:function(){this.transitionOff=!0,this.calculateOnWatch()},start:function(){var t=this;this.autoTransition&&window.clearInterval(this.autoTransition),this.autoTransition=window.setInterval((function(){t.moveNextBoard()}),this.mdDuration)},setActiveBoard:function(t,e){this.mdAuto&&e&&this.start(),this.hasIcons=!!t.icon,this.hasLabel=!!t.label,this.activeBoard=t.id,this.activeBoardNumber=this.getBoardIndex(this.activeBoard),this.calculatePosition(),this.$emit("change",this.activeBoardNumber)},movePrevBoard:function(){var t=(0,a.default)(this.boardList),e=t.indexOf(this.activeBoard)-1,n=t[e];if(n)this.setActiveBoard(this.boardList[n],!0);else if(this.mdInfinite){var i=(0,a.default)(this.boardList)[(0,a.default)(this.boardList).length-1];this.setActiveBoard(this.boardList[i],!0)}},moveNextBoard:function(){var t=(0,a.default)(this.boardList),e=t.indexOf(this.activeBoard)+1,n=t[e];if(n)this.setActiveBoard(this.boardList[n],!0);else if(this.mdInfinite){var i=(0,a.default)(this.boardList)[0];this.setActiveBoard(this.boardList[i],!0)}},isHorizontallyInside:function(t){return t>this.mountedRect.left&&t<this.mountedRect.left+this.mountedRect.width},isVerticallyInside:function(t){return t>this.mountedRect.top&&t<this.mountedRect.top+this.mountedRect.height},handleTouchStart:function(t){this.mountedRect=this.$refs.boardsContent.getBoundingClientRect();var e=t.changedTouches[0].clientX,n=t.changedTouches[0].clientY;this.isHorizontallyInside(e)&&this.isVerticallyInside(n)&&(this.initialTouchPosition=e,this.canMove=!0)},handleTouchEnd:function(t){if(this.canMove){var e=t.changedTouches[0].clientX,n=this.initialTouchPosition-e,i=n>0?"moveNextBoard":"movePrevBoard";Math.abs(n)>this.mdSwipeDistance&&this[i](),this.canMove=!1,this.initialTouchPosition=null}}},mounted:function(){var t=this;this.$nextTick((function(){if(t.observeElementChanges(),window.addEventListener("resize",t.calculateOnResize),(0,a.default)(t.boardList).length&&!t.activeBoard){var e=(0,a.default)(t.boardList)[0];t.setActiveBoard(t.boardList[e])}t.mdSwipeable&&(t.mountedRect=t.$refs.boardsContent.getBoundingClientRect(),t.initialTouchPosition=null,t.canMove=!1,document.addEventListener("touchstart",t.handleTouchStart),document.addEventListener("touchend",t.handleTouchEnd)),t.mdAuto&&t.start()}))},beforeDestroy:function(){this.parentObserver&&this.parentObserver.disconnect(),this.autoTransition&&window.clearTimeout(this.autoTransition),window.removeEventListener("resize",this.calculateOnResize),this.mdSwipeable&&(document.removeEventListener("touchstart",this.handleTouchStart),document.removeEventListener("touchend",this.handleTouchEnd)),this._destroyed=!0}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-boards",class:[t.themeClass,t.boardClasses]},[n("div",{ref:"boardsContent",staticClass:"md-boards-content",style:{height:t.contentHeight}},[n("div",{staticClass:"md-boards-wrapper",style:{transform:"translate3D(-"+t.contentWidth+", 0, 0)"}},[t._t("default")],2)]),t._v(" "),n("nav",{ref:"boardNavigation",staticClass:"md-boards-navigation",class:t.navigationClasses},[t.mdControls?t._e():n("span",{staticStyle:{flex:"1"}}),t._v(" "),t.mdControls?n("md-button",{on:{click:function(e){t.movePrevBoard()}}},[n("div",{staticClass:"md-board-header-container"},[n("md-icon",{staticClass:"md-control"},[t._v("chevron_left")])],1)]):t._e(),t._v(" "),n("span",{staticStyle:{flex:"1"}}),t._v(" "),t._l(t.boardList,(function(e){return n("button",{key:e.id,ref:"boardHeader",refInFor:!0,staticClass:"md-board-header",class:t.getHeaderClass(e),attrs:{type:"button",disabled:e.disabled},on:{click:function(n){t.setActiveBoard(e,!0)}}},[n("div",{staticClass:"md-board-header-container"},[n("md-icon",[t._v("fiber_manual_record")])],1)])})),t._v(" "),n("span",{staticStyle:{flex:"1"}}),t._v(" "),t.mdControls?n("md-button",{on:{click:function(e){t.moveNextBoard()}}},[n("div",{staticClass:"md-board-header-container"},[n("md-icon",{staticClass:"md-control"},[t._v("chevron_right")])],1)]):t._e(),t._v(" "),t.mdControls?t._e():n("span",{staticStyle:{flex:"1"}}),t._v(" "),n("span",{ref:"indicator"})],2)])},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(307),n(308),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(11),s=i(r);e.default={props:{id:[String,Number],mdLabel:[String,Number],mdIcon:String,mdActive:Boolean,mdDisabled:Boolean,mdTooltip:String,mdTooltipDelay:{type:String,default:"0"},mdTooltipDirection:{type:String,default:"bottom"}},data:function(){return{mounted:!1,boardId:this.id||"board-"+(0,a.default)(),width:"0px",left:"0px"}},watch:{mdActive:function(){this.updateBoardData()},mdDisabled:function(){this.updateBoardData()},mdIcon:function(){this.updateBoardData()},mdLabel:function(){this.updateBoardData()},mdTooltip:function(){this.updateBoardData()},mdTooltipDelay:function(){this.updateBoardData()},mdTooltipDirection:function(){this.updateBoardData()}},computed:{styles:function(){return{width:this.width,left:this.left}}},methods:{getBoardData:function(){return{id:this.boardId,label:this.mdLabel,icon:this.mdIcon,active:this.mdActive,disabled:this.mdDisabled,tooltip:this.mdTooltip,tooltipDelay:this.mdTooltipDelay,tooltipDirection:this.mdTooltipDirection,ref:this}},updateBoardData:function(){this.parentBoards.updateBoard(this.getBoardData())}},mounted:function(){var t=this.getBoardData();if(this.parentBoards=(0,s.default)(this.$parent,"md-boards"),!this.parentBoards)throw new Error("You must wrap the md-board in a md-boards");this.mounted=!0,this.parentBoards.updateBoard(t),this.mdActive&&this.parentBoards.setActiveBoard(t)},beforeDestroy:function(){this.parentBoards.unregisterBoard(this.getBoardData())}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-board",style:t.styles,attrs:{id:t.boardId}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-boards>.md-boards-navigation{background-color:transparent}.THEME_NAME.md-boards>.md-boards-navigation .md-board-header{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-boards>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards>.md-boards-navigation .md-board-header:active{color:PRIMARY-COLOR}.THEME_NAME.md-boards>.md-boards-navigation .md-board-header.md-disabled{color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-boards>.md-boards-navigation .md-button{color:PRIMARY-COLOR}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation{background-color:transparent}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header:active{color:PRIMARY-CONTRAST}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-board-header.md-disabled{color:PRIMARY-CONTRAST-0.26}.THEME_NAME.md-boards.md-transparent>.md-boards-navigation .md-button{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-primary>.md-boards-navigation{background-color:PRIMARY-COLOR}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header:active{color:PRIMARY-CONTRAST}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-board-header.md-disabled{color:PRIMARY-CONTRAST-0.26}.THEME_NAME.md-boards.md-primary>.md-boards-navigation .md-button{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-boards.md-accent>.md-boards-navigation{background-color:ACCENT-COLOR}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header:active{color:ACCENT-CONTRAST}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-board-header.md-disabled{color:ACCENT-CONTRAST-0.26}.THEME_NAME.md-boards.md-accent>.md-boards-navigation .md-button{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-boards.md-warn>.md-boards-navigation{background-color:WARN-COLOR}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header{color:WARN-CONTRAST-0.54}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header.md-active,.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header:active{color:WARN-CONTRAST}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-board-header.md-disabled{color:WARN-CONTRAST-0.26}.THEME_NAME.md-boards.md-warn>.md-boards-navigation .md-button{color:WARN-CONTRAST-0.54}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-progress",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(311),r=i(a),s=n(315),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(312)}var o=n(0)(n(313),n(314),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-progress",props:{mdIndeterminate:Boolean,mdProgress:{type:Number,default:0}},mixins:[o.default],computed:{classes:function(){return{"md-indeterminate":this.mdIndeterminate}},styles:function(){if(!this.mdIndeterminate)return{width:this.mdProgress+"%"}}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"md-progress",appear:""}},[n("div",{staticClass:"md-progress",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-progress-track",style:t.styles})])])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-progress{background-color:PRIMARY-COLOR-0.38}.THEME_NAME.md-progress:not(.md-indeterminate) .md-progress-track{background-color:PRIMARY-COLOR}.THEME_NAME.md-progress .md-progress-track:after,.THEME_NAME.md-progress .md-progress-track:before{background-color:PRIMARY-COLOR}.THEME_NAME.md-progress.md-accent{background-color:ACCENT-COLOR-0.38}.THEME_NAME.md-progress.md-accent:not(.md-indeterminate) .md-progress-track{background-color:ACCENT-COLOR}.THEME_NAME.md-progress.md-accent .md-progress-track:after,.THEME_NAME.md-progress.md-accent .md-progress-track:before{background-color:ACCENT-COLOR}.THEME_NAME.md-progress.md-warn{background-color:WARN-COLOR-0.38}.THEME_NAME.md-progress.md-warn:not(.md-indeterminate) .md-progress-track{background-color:WARN-COLOR}.THEME_NAME.md-progress.md-warn .md-progress-track:after,.THEME_NAME.md-progress.md-warn .md-progress-track:before{background-color:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-radio",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(317),r=i(a),s=n(321),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(318)}var o=n(0)(n(319),n(320),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-radio",props:{name:String,id:String,value:[String,Boolean,Number],mdValue:{type:[String,Boolean,Number],required:!0},disabled:Boolean},mixins:[o.default],computed:{classes:function(){return{"md-checked":void 0!==this.value&&null!==this.value&&this.mdValue.toString()===this.value.toString(),"md-disabled":this.disabled}}},methods:{toggleCheck:function(t){this.disabled||(this.$emit("change",this.mdValue,t),this.$emit("input",this.mdValue,t))}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-radio",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-radio-container",on:{click:function(e){e.stopPropagation(),t.toggleCheck(e)}}},[n("input",{attrs:{type:"radio",name:t.name,id:t.id,disabled:t.disabled},domProps:{value:t.value}}),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}})],1),t._v(" "),t.$slots.default?n("label",{staticClass:"md-radio-label",attrs:{for:t.id||t.name},on:{click:function(e){e.preventDefault(),t.toggleCheck(e)}}},[t._t("default")],2):t._e()])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-radio .md-radio-container:after{background-color:ACCENT-COLOR}.THEME_NAME.md-radio.md-checked .md-radio-container{border-color:ACCENT-COLOR}.THEME_NAME.md-radio.md-checked .md-ink-ripple{color:ACCENT-COLOR}.THEME_NAME.md-radio.md-checked .md-ripple{opacity:.38}.THEME_NAME.md-radio.md-primary .md-radio-container:after{background-color:PRIMARY-COLOR}.THEME_NAME.md-radio.md-primary.md-checked .md-radio-container{border-color:PRIMARY-COLOR}.THEME_NAME.md-radio.md-primary.md-checked .md-ink-ripple{color:PRIMARY-COLOR}.THEME_NAME.md-radio.md-warn .md-radio-container:after{background-color:WARN-COLOR}.THEME_NAME.md-radio.md-warn.md-checked .md-radio-container{border-color:WARN-COLOR}.THEME_NAME.md-radio.md-warn.md-checked .md-ink-ripple{color:WARN-COLOR}.THEME_NAME.md-radio.md-disabled .md-radio-container{border-color:rgba(0,0,0,0.26)}.THEME_NAME.md-radio.md-disabled .md-radio-container:after{background-color:rgba(0,0,0,0.26)}.THEME_NAME.md-radio.md-disabled.md-checked .md-radio-container{border-color:rgba(0,0,0,0.26)}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-rating-bar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(323),r=i(a),s=n(327),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(324)}var o=n(0)(n(325),n(326),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={props:{mdMaxRating:{type:Number,default:5},disabled:Boolean,value:{type:Number,default:0},mdIconSize:{type:Number,default:1},mdFullIconset:String,mdEmptyIconset:String,mdFullIcon:{type:String,default:"star"},mdEmptyIcon:{type:String,default:"star"}},mixins:[o.default],data:function(){return{srcFullIcon:null,srcEmptyIcon:null,rating:this.value}},mounted:function(){this.srcFullIcon=this.checkSrc(this.mdFullIcon),this.srcEmptyIcon=this.checkSrc(this.mdEmptyIcon)},computed:{emptyIcon:function(){return this.mdEmptyIconset?"":this.mdEmptyIcon},fullIcon:function(){return this.mdFullIconset?"":this.mdFullIcon},iconClasses:function(){var t={};return this.mdIconSize&&(t["md-size-"+this.mdIconSize+"x"]=!0),t},fullIconStyle:function(){return{width:100/this.mdMaxRating*this.rating+"%","margin-left":-24*this.mdIconSize*this.mdMaxRating+"px"}}},watch:{mdFullIcon:function(){this.srcFullIcon=this.checkSrc(this.mdFullIcon)},mdEmptyIcon:function(){this.srcEmptyIcon=this.checkSrc(this.mdEmptyIcon)},value:function(){this.rating=this.value}},methods:{hoverStars:function(t){this.disabled||(this.rating=this.getIconIndex(t.currentTarget),this.$emit("hover",this.rating))},clickStars:function(t){if(!this.disabled){var e=this.getIconIndex(t.currentTarget);this.$emit("input",e),this.$emit("change",e)}},getIconIndex:function(t){var e=this,n=this.$el.querySelectorAll(".md-empty-icon > .md-icon, .md-full-icon > .md-icon"),i=-1;return n=Array.prototype.slice.call(n),n.some((function(n,o){if(n===t)return i=(o+1)%e.mdMaxRating,i=i||e.mdMaxRating,!0})),i},checkSrc:function(t){return t&&/.+\.(svg|png)/.test(t)?t:null},onMouseOut:function(){this.rating=this.value}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-rating-bar",class:[t.themeClass],attrs:{disabled:t.disabled}},[t.srcEmptyIcon?n("div",{staticClass:"md-empty-icon"},t._l(t.mdMaxRating,(function(e){return t.srcEmptyIcon?n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-src":t.srcEmptyIcon},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}}):t._e()}))):n("div",{staticClass:"md-empty-icon"},t._l(t.mdMaxRating,(function(e){return n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-iconset":t.mdEmptyIconset},domProps:{innerHTML:t._s(t.emptyIcon)},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}})}))),t._v(" "),t.srcFullIcon?n("div",{staticClass:"md-full-icon",style:t.fullIconStyle},t._l(t.mdMaxRating,(function(e){return t.srcFullIcon?n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-src":t.srcFullIcon},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}}):t._e()}))):n("div",{staticClass:"md-full-icon",style:t.fullIconStyle},t._l(t.mdMaxRating,(function(e){return n("md-icon",{key:e,class:[t.iconClasses],attrs:{"md-iconset":t.mdFullIconset},domProps:{innerHTML:t._s(t.fullIcon)},nativeOn:{mouseover:function(e){t.hoverStars(e)},click:function(e){t.clickStars(e)},mouseout:function(e){t.onMouseOut(e)}}})})))])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-rating-bar>.md-empty-icon .md-icon{color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-rating-bar>.md-full-icon .md-icon{color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-rating-bar.md-primary>.md-full-icon .md-icon{color:PRIMARY-COLOR}.THEME_NAME.md-rating-bar.md-accent>.md-full-icon .md-icon{color:ACCENT-COLOR}.THEME_NAME.md-rating-bar.md-warn>.md-full-icon .md-icon{color:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-select",r.default),t.component("md-option",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(329),r=i(a),s=n(333),d=i(s),l=n(336),c=i(l);t.exports=e.default}),(function(t,e,n){function i(t){n(330)}var o=n(0)(n(331),n(332),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(44),a=i(o),r=n(38),s=i(r),d=n(1),l=i(d),c=n(11),u=i(c),m=n(67),f=i(m);e.default={name:"md-select",props:{name:String,id:String,required:Boolean,multiple:Boolean,value:[String,Boolean,Number,Array],disabled:Boolean,placeholder:String,mdMenuClass:String,mdMenuOptions:Object},mixins:[l.default],data:function(){return{lastSelected:null,selectedValue:null,selectedText:null,multipleOptions:{},options:{},optionsAmount:0}},computed:{classes:function(){return{"md-disabled":this.disabled,"md-select-icon":this.hasIcon}},contentClasses:function(){return this.multiple?"md-multiple "+this.mdMenuClass:this.mdMenuClass},hasIcon:function(){return this.$slots.icon},valueStyle:function(){return this.hasIcon?{display:"none"}:{}}},watch:{value:function(t){this.setTextAndValue(t),this.multiple&&this.selectOptions(t)},disabled:function(){this.setParentDisabled()},required:function(){this.setParentRequired()},placeholder:function(){this.setParentPlaceholder()}},methods:{changeValue:function(t){this.$emit("input",t),this.$emit("change",t),this.$emit("selected",t)},getSingleValue:function(t){var e=this,n={};return(0,s.default)(this.options).forEach((function(i){var o=e.options[i];o.value===t&&(n.value=t,n.text=o.$refs.item.textContent,n.el=o.$refs.item)})),n},getMultipleValue:function(t){var e=this;if((0,f.default)(this.value)){var n=[];return t.forEach((function(t){(0,s.default)(e.options).forEach((function(i){var o=e.options[i];if(o.value===t){var a=o.$refs.item.textContent;e.multipleOptions[i]={value:t,text:a},n.push(a)}}))})),{value:t,text:n.join(", ")}}return{}},onOpen:function(){this.lastSelected&&this.lastSelected.scrollIntoViewIfNeeded(!0),this.$emit("opened")},removeChild:function(t){this.optionsAmount--;var e=(0,a.default)({},this.options[t]);if(delete this.options[t],delete this.multipleOptions[t],this.multiple){var n=this.selectedValue.find((function(t){return t.name===e.$refs.item.textContent.trim()})),i=this.selectedValue.indexOf(n);-1!==i&&this.selectedValue.splice(i,1)}},setParentDisabled:function(){this.parentContainer.isDisabled=this.disabled},setParentRequired:function(){this.parentContainer.isRequired=this.required},setParentPlaceholder:function(){this.parentContainer.hasPlaceholder=!!this.placeholder},selectOptions:function(t){var e=this,n=(0,s.default)(this.options).map((function(t){return e.options[t]}));if(n&&n.length){var i=n.filter((function(e){return t.includes(e.value)})),o=n.filter((function(e){return!t.includes(e.value)}));i.forEach((function(t){t.check=!0})),o.forEach((function(t){t.check=!1}))}},setTextAndValue:function(t){var e=this.multiple?this.getMultipleValue(t):this.getSingleValue(t);this.selectedValue=e.value,this.selectedText=e.text,this.lastSelected=e.el,this.parentContainer&&this.parentContainer.setValue(this.selectedText)},selectMultiple:function(t,e,n){var i=this;this.$nextTick((function(){var o=[];i.multipleOptions[t]={value:e,text:n};for(var a in i.multipleOptions)i.multipleOptions.hasOwnProperty(a)&&i.multipleOptions[a].value&&o.push(i.multipleOptions[a].value);i.changeValue(o)}))},selectOption:function(t,e,n){this.lastSelected=n,this.selectedText=e,this.setTextAndValue(t),this.changeValue(t)}},mounted:function(){this.parentContainer=(0,u.default)(this.$parent,"md-input-container"),this.parentContainer&&(this.setParentDisabled(),this.setParentRequired(),this.setParentPlaceholder(),this.parentContainer.hasSelect=!0),this.setTextAndValue(this.value)},beforeDestroy:function(){this.parentContainer&&(this.parentContainer.setValue(""),this.parentContainer.hasSelect=!1)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-select",class:[t.themeClass,t.classes]},[n("md-menu",t._b({attrs:{"md-close-on-select":!t.multiple},on:{open:t.onOpen,close:function(e){t.$emit("closed")}}},"md-menu",t.mdMenuOptions,!1),[t._t("icon"),t._v(" "),n("span",{ref:"value",staticClass:"md-select-value",style:t.valueStyle,attrs:{"md-menu-trigger":""}},[t._v("\n      "+t._s(t.selectedText||t.placeholder)+"\n    ")]),t._v(" "),n("md-menu-content",{staticClass:"md-select-content",class:[t.themeClass,t.contentClasses]},[t._t("default")],2)],2),t._v(" "),n("select",{attrs:{name:t.name,id:t.id,required:t.required,disabled:t.disabled,tabindex:"-1"}},[t.multiple?t._e():n("option",{attrs:{selected:"true"},domProps:{value:t.selectedValue}},[t._v("\n      "+t._s(t.selectedText)+"\n    ")]),t._v(" "),t._l(t.multipleOptions,(function(e,i){return e.value?n("option",{key:i,attrs:{selected:"true"},domProps:{value:e.value}},[t._v("\n      "+t._s(e.text)+"\n    ")]):t._e()}))],2)],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(334),n(335),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(11),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-option",props:{value:[String,Boolean,Number,Object]},data:function(){return{parentSelect:{},check:!1,index:0}},computed:{isSelected:function(){if(this.value&&this.parentSelect.value){var t=this.value.toString();return this.parentSelect.multiple?this.parentSelect.value.indexOf(t)>=0:this.value&&this.parentSelect.value&&t===this.parentSelect.value.toString()}return!1},classes:function(){return{"md-selected":this.isSelected,"md-checked":this.check}}},methods:{isMultiple:function(){return this.parentSelect.multiple},setParentOption:function(){this.isMultiple()?this.check=!this.check:this.parentSelect.selectOption(this.value,this.$refs.item.textContent,this.$el)},selectOption:function(t){this.disabled||(this.setParentOption(),this.$emit("selected",t))}},watch:{isSelected:function(t){this.isMultiple()&&(this.check=t)},check:function(t){t?this.parentSelect.selectMultiple(this.index,this.value,this.$refs.item.textContent):this.parentSelect.selectMultiple(this.index)}},mounted:function(){if(this.parentSelect=(0,o.default)(this.$parent,"md-select"),this.parentContent=(0,o.default)(this.$parent,"md-menu-content"),!this.parentSelect)throw new Error("You must wrap the md-option in a md-select");this.parentSelect.optionsAmount++,this.index=this.parentSelect.optionsAmount,this.parentSelect.multipleOptions[this.index]={},this.parentSelect.options[this.index]=this,(this.isMultiple()&&this.parentSelect.value.indexOf(this.value)>=0||this.parentSelect.value===this.value)&&this.setParentOption()},beforeDestroy:function(){this.parentSelect&&this.parentSelect.removeChild(this.index)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("md-menu-item",{staticClass:"md-option",class:t.classes,attrs:{tabindex:"-1"},on:{click:t.selectOption}},[t.parentSelect.multiple?n("md-checkbox",{staticClass:"md-primary",model:{value:t.check,callback:function(e){t.check=e},expression:"check"}},[n("span",{ref:"item"},[t._t("default")],2)]):n("span",{ref:"item"},[t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-select:after{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-select:after{color:BACKGROUND-CONTRAST-0.38}.THEME_NAME.md-select-content .md-menu-item.md-selected,.THEME_NAME.md-select-content .md-menu-item.md-checked{color:PRIMARY-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-sidenav",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(338),r=i(a),s=n(342),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(339)}var o=n(0)(n(340),n(341),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-sidenav",data:function(){return{mdVisible:!1}},mixins:[o.default],props:{mdSwipeable:Boolean,mdSwipeThreshold:{type:Number,default:15},mdSwipeDistance:{type:Number,default:100}},computed:{classes:function(){return this.mdVisible&&"md-active"}},methods:{show:function(){this.open()},open:function(){this.mdVisible=!0,this.$el.focus(),this.$emit("open")},close:function(){this.mdVisible=!1,this.$el.blur(),this.$emit("close")},toggle:function(){this.mdVisible?this.close():this.open()},isHorizontallyInside:function(t){return t>0&&t<this.mountedRect.left+this.mountedRect.width},isVerticallyInside:function(t){return t>0&&t<this.mountedRect.top+this.mountedRect.height},isFromStartWhenClosed:function(t){return!!this.mdVisible||t<this.mdSwipeThreshold},handleTouchStart:function(t){var e=t.touches[0].clientX-this.mountedRect.left,n=t.touches[0].clientY-this.mountedRect.top;this.isHorizontallyInside(e)&&this.isVerticallyInside(n)&&this.isFromStartWhenClosed(e)&&(this.initialTouchPosition=e,this.canMove=!0)},handleTouchEnd:function(){this.canMove=!1,this.initialTouchPosition=null},handleTouchMove:function(t){if(this.canMove){var e=t.touches[0].clientX,n=this.mdVisible?this.initialTouchPosition-e:e-this.initialTouchPosition,i=this.mdVisible?"close":"open";n>this.mdSwipeDistance&&this[i]()}}},mounted:function(){this.mdSwipeable&&(this.mountedRect=this.$refs.backdrop.$el.getBoundingClientRect(),this.initialTouchPosition=null,this.canMove=!1,document.addEventListener("touchstart",this.handleTouchStart),document.addEventListener("touchend",this.handleTouchEnd),document.addEventListener("touchmove",this.handleTouchMove))},beforeDestroy:function(){this.mdSwipeable&&(document.removeEventListener("touchstart",this.handleTouchStart),document.removeEventListener("touchend",this.handleTouchEnd),document.removeEventListener("touchmove",this.handleTouchMove))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-sidenav",class:[t.themeClass,t.classes],attrs:{tabindex:"0"},on:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;t.close(e)}}},[n("div",{staticClass:"md-sidenav-content"},[t._t("default")],2),t._v(" "),n("md-backdrop",{ref:"backdrop",staticClass:"md-sidenav-backdrop",on:{close:t.close}})],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-sidenav .md-sidenav-content{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-snackbar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(344),r=i(a),s=n(350),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(345)}var o=n(0)(n(346),n(349),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(42),s=i(r),d=n(1),l=i(d),c=n(347),u=i(c);e.default={name:"md-snackbar",props:{id:[String,Number],mdPosition:{type:String,default:"bottom center"},mdDuration:{type:[String,Number],default:4e3}},mixins:[l.default],data:function(){return{snackbarId:this.id||"snackbar-"+(0,a.default)(),removedSnackBarElementEventName:"removedSnackBarElement",active:!1,rootElement:{},snackbarElement:{},directionClass:null,closeTimeout:null,removedSnackBarElementEvent:null}},computed:{classes:function(){var t={"md-active":this.active};return this.directionClass=this.mdPosition.replace(/ /g,"-"),t["md-position-"+this.directionClass]=!0,t}},watch:{active:function(t){var e="md-has-toast-"+this.directionClass;t?(document.body.classList.add(e),document.body.classList.add("md-has-toast")):(document.body.classList.remove(e),document.body.classList.remove("md-has-toast"))}},methods:{removeElement:function(){if(document.body.contains(this.snackbarElement)&&!this.active){var t=this.snackbarElement.querySelector(".md-ripple.md-active");t&&t.classList.remove("md-active"),document.body.removeChild(this.snackbarElement)}document.dispatchEvent(this.removedSnackBarElementEvent)},open:function(){if(u.default.current)return document.removeEventListener(this.removedSnackBarElementEventName,this.showElementAndStartTimer),document.addEventListener(this.removedSnackBarElementEventName,this.showElementAndStartTimer),void u.default.current.close();this.showElementAndStartTimer()},showElementAndStartTimer:function(){document.body.contains(this.snackbarElement)||(document.removeEventListener(this.removedSnackBarElementEventName,this.showElementAndStartTimer),u.default.current=this,document.body.appendChild(this.snackbarElement),null!==this.$refs.container&&void 0!==this.$refs.container&&window.getComputedStyle(this.$refs.container).backgroundColor,this.active=!0,this.$emit("open"),this.mdDuration!==1/0&&this.setCloseTimeout(this.mdDuration),this.timeoutStartedAt=Date.now())},close:function(){var t=this;if(this.$refs.container){this.active=!1;var e=function e(){document.removeEventListener(s.default,e),t.removeElement()};u.default.current=null,this.$emit("close"),document.removeEventListener(s.default,e),document.addEventListener(s.default,e),this.clearCloseTimeout(),this.pendingDuration=this.mdDuration}},pauseTimeout:function(){this.pendingDuration=this.pendingDuration-(Date.now()-this.timeoutStartedAt),this.timeoutStartedAt=0,this.clearCloseTimeout()},resumeTimeout:function(){this.timeoutStartedAt=Date.now(),this.pendingDuration!==1/0&&this.setCloseTimeout(this.pendingDuration)},setCloseTimeout:function(t){this.clearCloseTimeout(),this.closeTimeout=window.setTimeout(this.close,t)},clearCloseTimeout:function(){this.closeTimeout&&(window.clearTimeout(this.closeTimeout),this.closeTimeout=null)}},mounted:function(){var t=this;this.$nextTick((function(){t.snackbarElement=t.$el,t.snackbarElement.parentNode.removeChild(t.snackbarElement),t.timeoutStartedAt=0,t.pendingDuration=t.mdDuration})),this.removedSnackBarElementEvent=new Event(this.removedSnackBarElementEventName)},beforeDestroy:function(){this.clearCloseTimeout(),this.active=!1,this.removeElement()}},t.exports=e.default}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(348),o=(function(t){return t&&t.__esModule?t:{default:t}})(i),a=new o.default({data:function(){return{current:null}}});e.default=a,t.exports=e.default}),(function(e,n){e.exports=t}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-snackbar",class:[t.themeClass,t.classes],attrs:{id:t.snackbarId},on:{mouseenter:t.pauseTimeout,mouseleave:t.resumeTimeout}},[n("div",{ref:"container",staticClass:"md-snackbar-container"},[n("div",{staticClass:"md-snackbar-content"},[t._t("default")],2)])])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME .md-snackbar .md-ink-ripple,.THEME_NAME.md-snackbar .md-ink-ripple{color:#fff}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-speed-dial",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(352),r=i(a),s=n(356),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(353)}var o=n(0)(n(354),n(355),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-speed-dial",props:{mdOpen:{type:String,default:"click"},mdMode:{type:String,default:"fling"},mdDirection:{type:String,default:"top"}},mixins:[o.default],data:function(){return{fabTrigger:null,active:!1}},computed:{classes:function(){var t={"md-active":this.active};return t["md-mode-"+this.mdMode]=!0,t["md-direction-"+this.mdDirection]=!0,t}},methods:{closeSpeedDial:function(t){!t.target!==this.fabTrigger&&this.fabTrigger.contains(t.target)||(this.active=!1,document.body.removeEventListener("click",this.closeSpeedDial))},toggleSpeedDial:function(){var t=this;this.active=!this.active,window.setTimeout((function(){document.body.addEventListener("click",t.closeSpeedDial)}),50)}},mounted:function(){var t=this;this.$nextTick((function(){t.fabTrigger=t.$el.querySelector("[md-fab-trigger]"),"click"===t.mdOpen?t.fabTrigger.addEventListener("click",t.toggleSpeedDial):(t.$el.addEventListener("mouseenter",t.toggleSpeedDial),t.$el.addEventListener("mouseleave",t.closeSpeedDial))}))},beforeDestroy:function(){this.fabTrigger.removeEventListener("click",this.toggleSpeedDial),document.body.removeEventListener("click",this.closeSpeedDial)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-speed-dial",class:[t.themeClass,t.classes]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=""}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-spinner",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(358),r=i(a),s=n(362),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(359)}var o=n(0)(n(360),n(361),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-spinner",props:{mdSize:{type:Number,default:50},mdStroke:{type:Number,default:3.5},mdIndeterminate:Boolean,mdProgress:{type:Number,default:0}},mixins:[o.default],computed:{classes:function(){return{"md-indeterminate":this.mdIndeterminate}},styles:function(){var t=this.mdSize+"px";return{width:t,height:t}},dashProgress:function(){var t=125*this.mdProgress/100;return!this.mdIndeterminate&&(t>=125&&(t=130),t+", 200")}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"md-spinner",appear:""}},[n("div",{staticClass:"md-spinner",class:[t.themeClass,t.classes],style:t.styles},[n("svg",{staticClass:"md-spinner-draw",attrs:{viewBox:"25 25 50 50"}},[n("circle",{staticClass:"md-spinner-path",attrs:{cx:"50",cy:"50",r:"20","stroke-width":t.mdStroke,"stroke-dasharray":t.dashProgress}})])])])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-spinner .md-spinner-path{stroke:PRIMARY-COLOR}.THEME_NAME.md-spinner.md-accent .md-spinner-path{stroke:ACCENT-COLOR}.THEME_NAME.md-spinner.md-warn .md-spinner-path{stroke:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-stepper",r.default),t.component("md-step",d.default),t.component("md-step-header-container",c.default),t.component("md-step-header",m.default),t.material.styles.push(h.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(364),r=i(a),s=n(368),d=i(s),l=n(371),c=i(l),u=n(372),m=i(u),f=n(375),h=i(f);t.exports=e.default}),(function(t,e,n){function i(t){n(365)}var o=n(0)(n(366),n(367),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(1),s=i(r),d=n(59),l=i(d);e.default={name:"md-stepper",props:{mdAlternateLabels:{type:Boolean,default:!1},mdElevation:{type:[String,Number],default:1},mdVertical:{type:Boolean,default:!1}},mixins:[s.default],data:function(){return{stepList:{},activeStep:null,activeStepNumber:0,contentHeight:"0px",contentWidth:"0px"}},computed:{navigationClasses:function(){return{"md-alternate-labels":this.mdAlternateLabels}},stepsClasses:function(){return{"md-steps-vertical":this.mdVertical}}},methods:{getNextStep:function(t){var e=this.getStepIndex(t);if(e!==this.stepList.length){var n=(0,a.default)(this.stepList)[e+1];return this.stepList[n]}},getPreviousStep:function(t){var e=this.getStepIndex(t);if(0!==e){var n=(0,a.default)(this.stepList)[e-1];return this.stepList[n]}},getStepsCount:function(){return(0,a.default)(this.stepList).length},getStepIndex:function(t){return(0,a.default)(this.stepList).indexOf(t)},registerStep:function(t){this.$set(this.stepList,t.id,t)},moveNextStep:function(){if(this.activeStepNumber<this.getStepsCount()-1){var t=this.getNextStep(this.activeStep);this.setActiveStep(t)}else this.$emit("completed")},movePreviousStep:function(){if(this.activeStepNumber>0&&this.activeStepNumber<this.getStepsCount()){var t=this.getPreviousStep(this.activeStep);this.setActiveStep(t)}},setActiveStep:function(t){this.activeStepNumber>this.getStepIndex(t.id)&&!t.editable||(this.activeStep=t.id,this.activeStepNumber=this.getStepIndex(this.activeStep),this.calculatePosition(),this.$emit("change",this.activeStepNumber))},unregisterStep:function(t){this.$delete(this.stepList,t.id)},updateStep:function(t){if(this.registerStep(t),t.active)if(t.disabled){if((0,a.default)(this.stepList).length){var e=(0,a.default)(this.stepList),n=e.indexOf(t.id)+1,i=e[n];i?this.setActiveStep(this.stepList[i]):this.setActiveStep(this.stepList[0])}}else this.setActiveStep(t)},observeElementChanges:function(){this.parentObserver=new MutationObserver((0,l.default)(this.calculateOnWatch,50)),this.parentObserver.observe(this.$refs.stepContent,{childList:!0,attributes:!0,subtree:!0})},calculateStepsWidthAndPosition:function(){if(this.mdVertical)this.contentWidth="initial";else{var t=this.$el.offsetWidth,e=0;this.contentWidth=t*this.activeStepNumber+"px";for(var n in this.stepList){var i=this.stepList[n];i.ref.width=t+"px",i.ref.left=t*e+"px",e++}}},calculateContentHeight:function(){var t=this;this.$nextTick((function(){if(!t.mdVertical&&(0,a.default)(t.stepList).length){var e=t.stepList[t.activeStep].ref.$el.offsetHeight;t.contentHeight=e+"px"}else t.contentHeight="initial"}))},calculatePosition:function(){var t=this;window.requestAnimationFrame((function(){t._destroyed||(t.calculateStepsWidthAndPosition(),t.calculateContentHeight())}))},debounceTransition:function(){var t=this;window.clearTimeout(this.transitionControl),this.transitionControl=window.setTimeout((function(){t.calculatePosition(),t.transitionOff=!1}),200)},calculateOnWatch:function(){this.calculatePosition(),this.debounceTransition()},calculateOnResize:function(){this.transitionOff=!0,this.calculateOnWatch()}},mounted:function(){var t=this;this.$nextTick((function(){if(t.observeElementChanges(),window.addEventListener("resize",t.calculateOnResize),(0,a.default)(t.stepList).length&&!t.activeStep){var e=(0,a.default)(t.stepList)[0];t.setActiveStep(t.stepList[e])}}))},beforeDestroy:function(){this.parentObserver&&this.parentObserver.disconnect(),window.removeEventListener("resize",this.calculateOnResize),this._destroyed=!0}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-stepper",class:[t.themeClass,t.stepsClasses]},[t.mdVertical?t._e():n("md-whiteframe",{ref:"stepNavigation",staticClass:"md-steps-navigation",class:t.navigationClasses,attrs:{"md-tag":"nav","md-elevation":t.mdElevation}},[n("md-step-header-container",{ref:"stepHeader",attrs:{"md-vertical":t.mdVertical}},t._l(t.stepList,(function(e,i){return n("md-step-header",{key:e.id,attrs:{step:e,"md-alternate-labels":t.mdAlternateLabels},nativeOn:{click:function(n){t.setActiveStep(e)}}})})))],1),t._v(" "),n("md-whiteframe",{attrs:{"md-elevation":t.mdElevation}},[t.mdVertical?t._e():n("div",{ref:"stepContent",staticClass:"md-steps-container",style:{height:t.contentHeight}},[n("div",{staticClass:"md-steps-wrapper",style:{transform:"translate3D(-"+t.contentWidth+", 0, 0)"}},[t._t("default")],2)]),t._v(" "),t.mdVertical?n("div",{ref:"stepContent",staticClass:"md-steps-vertical-container"},[t._t("default")],2):t._e()])],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(369),n(370),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(11),s=i(r);e.default={name:"md-step",props:{id:[String,Number],mdActive:Boolean,mdButtonBack:{type:String,default:"BACK"},mdButtonContinue:{type:String,default:"CONTINUE"},mdContinue:{type:Boolean,default:!0},mdDisabled:Boolean,mdError:Boolean,mdEditable:{type:Boolean,default:!0},mdIcon:String,mdLabel:[String,Number],mdMessage:[String],mdTooltip:String,mdTooltipDelay:{type:String,default:"0"},mdTooltipDirection:{type:String,default:"bottom"}},data:function(){return{index:0,left:"0px",mounted:!1,parentStepper:void 0,stepId:this.id||"step-"+(0,a.default)(),vertical:!1,width:"0px"}},watch:{mdActive:function(){this.updateStepData()},mdContinue:function(){this.updateStepData()},mdEditable:function(){this.updateStepData()},mdDisabled:function(){this.updateStepData()},mdError:function(){this.updateStepData()},mdIcon:function(){this.updateStepData()},mdLabel:function(){this.updateStepData()},mdMessage:function(){this.updateStepData()},mdTooltip:function(){this.updateStepData()},mdTooltipDelay:function(){this.updateStepData()},mdTooltipDirection:function(){this.updateStepData()}},computed:{canGoBack:function(){if(0===this.index)return!1;if(!this.parentStepper)return!1;var t=this.parentStepper.getPreviousStep(this.stepId);return!(void 0!==t&&!t.editable)},continueText:function(){return this.parentStepper&&this.index+1===this.parentStepper.getStepsCount()&&"CONTINUE"===this.mdButtonContinue?"FINISH":this.mdButtonContinue},isCurrentStep:function(){return this.index===this.parentStepper.activeStepNumber},styles:function(){return this.vertical?{}:{width:this.width,left:this.left}}},methods:{getStepData:function(){return{id:this.stepId,label:this.mdLabel,message:this.mdMessage,icon:this.mdIcon,active:this.mdActive,continue:this.mdContinue,editable:this.mdEditable,disabled:this.mdDisabled,error:this.mdError,toolTip:this.mdTooltip,tooltipDelay:this.mdTooltipDelay,tooltipDirection:this.mdTooltipDirection,ref:this}},moveNextStep:function(){this.parentStepper.moveNextStep()},movePreviousStep:function(){this.parentStepper.movePreviousStep()},setActiveStep:function(){this.parentStepper.setActiveStep(this.getStepData())},updateStepData:function(){this.parentStepper.updateStep(this.getStepData())}},mounted:function(){var t=this.getStepData();if(this.parentStepper=(0,s.default)(this.$parent,"md-stepper"),!this.parentStepper)throw new Error("You must wrap the md-step in a md-stepper");this.mounted=!0,this.parentStepper.updateStep(t),this.mdActive&&this.parentStepper.setActiveStep(t),this.vertical=this.parentStepper.mdVertical,this.index=this.parentStepper.getStepIndex(this.stepId)},beforeDestroy:function(){this.parentStepper.unregisterStep(this.getStepData())}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-step",style:t.styles,attrs:{id:t.stepId}},[t.vertical?n("md-step-header",{attrs:{step:t.getStepData()}}):t._e(),t._v(" "),!t.vertical||t.vertical&&t.isCurrentStep?n("div",{staticClass:"md-step-content"},[t._t("default"),t._v(" "),!t.vertical||t.vertical&&t.isCurrentStep?n("div",{staticClass:"md-step-actions"},[n("md-button",{staticClass:"md-raised md-primary",attrs:{disabled:!t.mdContinue},on:{click:t.moveNextStep}},[t._v(t._s(t.continueText))]),t._v(" "),n("md-button",{attrs:{disabled:!t.canGoBack},on:{click:t.movePreviousStep}},[t._v(t._s(t.mdButtonBack))])],1):t._e()],2):t._e()],1)},staticRenderFns:[]}}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(36),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={functional:!0,props:{mdVertical:{type:Boolean,default:!1}},render:function(t,e){var n=e.children,i=e.props;return i.mdVertical||(n=(function(e){return e.reduce((function(e,n,i,a){if(e.push(n),i<a.length-1){var r=t("md-divider",{key:"divider-"+(0,o.default)()});e.push(r)}return e}),[])})(n)),t("div",{class:"md-steps-navigation-container"},n)}},t.exports=e.default}),(function(t,e,n){var i=n(0)(n(373),n(374),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(11),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={props:{step:Object,mdAlternateLabels:Boolean},data:function(){return{index:Number,parentStepper:{}}},computed:{isCompleted:function(){return this.index<this.parentStepper.activeStepNumber},getHeaderClasses:function(){return{"md-active":this.parentStepper.activeStep===this.step.id,"md-alternate-labels":this.mdAlternateLabels,"md-disabled":this.step.disabled,"md-has-sub-message":this.step.message,"md-primary":this.isCompleted,"md-warn":this.step.error}},icon:function(){return!this.step.disabled&&this.step.editable&&this.isCompleted&&!this.step.error?"mode_edit":this.step.disabled||!this.isCompleted||this.step.error?!this.step.disabled&&this.step.error?"warning":this.step.icon:"check"},stepNumber:function(){return this.index+1}},mounted:function(){var t=this;this.$nextTick((function(){if(t.parentStepper=(0,o.default)(t.$parent,"md-stepper"),!t.parentStepper)throw t.$destroy(),new Error("You should wrap the md-step-header in a md-stepper");t.index=t.parentStepper.getStepIndex(t.step.id)}))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-step-header",class:t.getHeaderClasses},[n("div",{staticClass:"md-step-icons"},[t.icon&&!t.step.error?n("md-icon",{staticClass:"md-step-icon"},[t._v(t._s(t.icon))]):t._e(),t._v(" "),t.icon&&t.step.error?n("md-icon",{staticClass:"md-step-error"},[t._v(t._s(t.icon))]):t._e(),t._v(" "),t.icon?t._e():n("div",{staticClass:"md-step-number"},[n("span",[t._v(t._s(t.stepNumber))])])],1),t._v(" "),n("div",{staticClass:"md-step-titles"},[n("div",{staticClass:"md-step-title"},[t._v(t._s(t.step.label))]),t._v(" "),t.step.message?n("small",[t._v(t._s(t.step.message))]):t._e()]),t._v(" "),t.step.toolTip?n("md-tooltip",{attrs:{"md-direction":t.step.tooltipDirection,"md-delay":t.step.tooltipDelay}},[t._v(t._s(t.step.toolTip))]):t._e()],1)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-stepper .md-step-header .md-step-icon,.THEME_NAME.md-stepper .md-step-header .md-step-number{color:BACKGROUND-CONTRAST;background-color:#bdbdbd}.THEME_NAME.md-stepper .md-step-header.md-primary .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-primary .md-step-number,.THEME_NAME.md-stepper .md-step-header.md-active .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-active .md-step-number{color:PRIMARY-CONTRAST;background-color:PRIMARY-COLOR}.THEME_NAME.md-stepper .md-step-header.md-accent .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-accent .md-step-number{color:ACCENT-CONTRAST;background-color:ACCENT-COLOR}.THEME_NAME.md-stepper .md-step-header.md-warn .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-warn .md-step-number{color:WARN-CONTRAST;background-color:WARN-COLOR}.THEME_NAME.md-stepper .md-step-header.md-warn .md-step-error,.THEME_NAME.md-stepper .md-step-header.md-warn .md-step-titles{color:WARN-COLOR}.THEME_NAME.md-stepper .md-step-header.md-disabled{color:#bdbdbd}.THEME_NAME.md-stepper .md-step-header.md-disabled .md-step-icon,.THEME_NAME.md-stepper .md-step-header.md-disabled .md-step-number{color:white;background-color:#bdbdbd}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-subheader",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(377),r=i(a),s=n(381),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(378)}var o=n(0)(n(379),n(380),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-subheader",mixins:[o.default]},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return"md-list"===t.$parent.$options._componentTag?n("li",{staticClass:"md-subheader",class:[t.themeClass]},[t._t("default")],2):n("div",{staticClass:"md-subheader",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-subheader.md-primary{color:PRIMARY-COLOR}.THEME_NAME.md-subheader.md-accent{color:ACCENT-COLOR}.THEME_NAME.md-subheader.md-warn{color:WARN-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-switch",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(383),r=i(a),s=n(387),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(384)}var o=n(0)(n(385),n(386),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-switch",props:{name:String,value:Boolean,id:String,disabled:Boolean,type:{type:String,default:"button"}},mixins:[o.default],data:function(){return{leftPos:"-1px",checked:Boolean(this.value)}},computed:{classes:function(){return{"md-checked":this.checked,"md-disabled":this.disabled}},styles:function(){return{transform:"translate3D("+this.leftPos+", -50%, 0)"}}},watch:{checked:function(){this.setPosition()},value:function(t){this.changeState(t)}},methods:{setPosition:function(){this.leftPos=this.checked?"75%":"-1px"},changeState:function(t,e){void 0!==e?(this.$emit("change",t,e),e.defaultPrevented||(this.checked=t),this.$emit("input",this.checked,e)):this.checked=t},toggle:function(t){this.disabled||this.changeState(!this.checked,t)}},mounted:function(){this.$nextTick(this.setPosition)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-switch",class:[t.themeClass,t.classes]},[n("div",{staticClass:"md-switch-container",on:{click:function(e){t.toggle(e)}}},[n("div",{staticClass:"md-switch-thumb",style:t.styles},[n("input",{attrs:{type:"checkbox",name:t.name,id:t.id,disabled:t.disabled,tabindex:"-1"},domProps:{value:t.value}}),t._v(" "),n("button",{staticClass:"md-switch-holder",attrs:{type:t.type}}),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":t.disabled}})],1)]),t._v(" "),t.$slots.default?n("label",{staticClass:"md-switch-label",attrs:{for:t.id||t.name}},[t._t("default")],2):t._e()])},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-switch.md-checked .md-switch-container{background-color:ACCENT-COLOR-500-0.5}.THEME_NAME.md-switch.md-checked .md-switch-thumb{background-color:ACCENT-COLOR}.THEME_NAME.md-switch.md-checked .md-ink-ripple{color:ACCENT-COLOR}.THEME_NAME.md-switch.md-checked .md-ripple{opacity:.38}.THEME_NAME.md-switch.md-checked.md-primary .md-switch-container{background-color:PRIMARY-COLOR-500-0.5}.THEME_NAME.md-switch.md-checked.md-primary .md-switch-thumb{background-color:PRIMARY-COLOR}.THEME_NAME.md-switch.md-checked.md-primary .md-ink-ripple{color:PRIMARY-COLOR}.THEME_NAME.md-switch.md-checked.md-warn .md-switch-container{background-color:WARN-COLOR-500-0.5}.THEME_NAME.md-switch.md-checked.md-warn .md-switch-thumb{background-color:WARN-COLOR}.THEME_NAME.md-switch.md-checked.md-warn .md-ink-ripple{color:WARN-COLOR}.THEME_NAME.md-switch.md-disabled .md-switch-container,.THEME_NAME.md-switch.md-disabled.md-checked .md-switch-container{background-color:rgba(0,0,0,0.12)}.THEME_NAME.md-switch.md-disabled .md-switch-thumb,.THEME_NAME.md-switch.md-disabled.md-checked .md-switch-thumb{background-color:#bdbdbd}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-table",r.default),t.component("md-table-header",{functional:!0,render:function(t,e){return t("thead",{staticClass:"md-table-header"},e.children)}}),t.component("md-table-body",{functional:!0,render:function(t,e){return t("tbody",{staticClass:"md-table-body"},e.children)}}),t.component("md-table-row",d.default),t.component("md-table-head",c.default),t.component("md-table-cell",m.default),t.component("md-table-edit",h.default),t.component("md-table-card",b.default),t.component("md-table-pagination",_.default),t.component("md-table-alternate-header",g.default),t.material.styles.push(M.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(389),r=i(a),s=n(393),d=i(s),l=n(396),c=i(l),u=n(399),m=i(u),f=n(402),h=i(f),p=n(405),b=i(p),v=n(408),g=i(v),E=n(411),_=i(E),C=n(417),M=i(C);t.exports=e.default}),(function(t,e,n){function i(t){n(390)}var o=n(0)(n(391),n(392),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(44),a=i(o),r=n(1),s=i(r),d=n(11),l=i(d);e.default={name:"md-table",props:{mdSortType:String,mdSort:String},mixins:[s.default],data:function(){return{sortType:this.mdSortType,sortBy:this.mdSort,hasRowSelection:!1,data:[],selectedRows:[]}},computed:{numberOfRows:function(){return this.data?this.data.length:0},numberOfSelected:function(){return this.selectedRows?this.selectedRows.length:0}},methods:{emitSort:function(t){this.sortBy=t,this.$emit("sort",{name:t,type:this.sortType})},emitSelection:function(){this.$emit("select",this.selectedRows)},removeRow:function(t){var e=this.data.indexOf(t);-1!==e&&this.data.splice(e,1),this.removeSelectedRow(t)},removeSelectedRow:function(t){var e=this.selectedRows.indexOf(t);-1!==e&&this.selectedRows.splice(e,1)},setRowSelection:function(t,e){if(t)return void this.selectedRows.push(e);this.removeSelectedRow(e)},setMultipleRowSelection:function(t){this.selectedRows=t?(0,a.default)([],this.data):[]}},watch:{mdSort:function(){this.sortBy=this.mdSort,this.$emit("sortInput")},mdSortType:function(){this.sortType=this.mdSortType,this.$emit("sortInput")}},mounted:function(){this.parentCard=(0,l.default)(this.$parent,"md-table-card"),this.parentCard&&(this.parentCard.tableInstance=this)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table",class:[t.themeClass]},[n("table",[t._t("default")],2)])},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(394),n(395),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(11),a=i(o),r=n(36),s=i(r);e.default={name:"md-table-row",props:{mdAutoSelect:Boolean,mdSelection:Boolean,mdItem:Object},data:function(){return{parentTable:{},headRow:!1,checkbox:!1,index:0,uuid:"mdrow_uuid_"+(0,s.default)()}},computed:{isDisabled:function(){return!this.mdSelection&&!this.headRow},hasSelection:function(){return this.mdSelection||this.headRow&&this.parentTable.hasRowSelection},classes:function(){return{"md-selected":this.checkbox}}},watch:{mdItem:function(t,e){this.parentTable.data[this.index]=this.mdItem,this.handleMultipleSelection(t===e)}},methods:{setRowSelection:function(t,e){this.parentTable.setRowSelection(t,e)},setHeadRowSelection:function(){this.hasSelection&&(this.parentTable.$children[0].checkbox=this.parentTable.numberOfSelected>0&&this.parentTable.numberOfSelected===this.parentTable.numberOfRows)},handleSingleSelection:function(t){this.parentTable.setRowSelection(t,this.mdItem),this.setHeadRowSelection()},handleMultipleSelection:function(t){var e=this;this.parentTable.numberOfRows>25&&this.parentTable.$el.classList.add("md-transition-off"),this.parentTable.$children.forEach((function(e){e.checkbox=t})),this.parentTable.setMultipleRowSelection(t),this.setHeadRowSelection(),window.setTimeout((function(){return e.parentTable.$el.classList.remove("md-transition-off")}),100)},select:function(t){this.hasSelection&&(this.headRow?this.handleMultipleSelection(t):this.handleSingleSelection(t),this.parentTable.emitSelection(),this.$emit(t?"selected":"deselected",t))},autoSelect:function(){this.mdAutoSelect&&this.hasSelection&&(this.checkbox=!this.checkbox,this.handleSingleSelection(this.checkbox),this.parentTable.emitSelection())},startTableRow:function(){if(this.parentTable=(0,a.default)(this.$parent,"md-table"),"thead"===this.$el.parentNode.tagName.toLowerCase())this.headRow=!0;else{if(!this.mdItem&&this.mdSelection)throw new Error('You should set the md-item property when using mdSelection. Example: <md-table-row md-selection :md-item="ITEM" ...>');this.mdSelection&&(this.parentTable.hasRowSelection=!0),this.parentTable.data.push(this.mdItem)}}},destroyed:function(){this.parentTable.removeRow(this.mdItem),this.setHeadRowSelection()},mounted:function(){this.startTableRow()}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",{staticClass:"md-table-row",class:t.classes,on:{click:t.autoSelect},nativeOn:{click:function(e){t.autoSelect(e)}}},[t.hasSelection?n("md-table-cell",{staticClass:"md-table-selection"},[n("md-checkbox",{attrs:{disabled:t.isDisabled},on:{change:t.select},nativeOn:{change:function(e){t.select(e)}},model:{value:t.checkbox,callback:function(e){t.checkbox=e},expression:"checkbox"}})],1):t._e(),t._v(" "),t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(397),n(398),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(11),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-table-head",props:{mdNumeric:Boolean,mdSortBy:String,mdTooltip:String},data:function(){return{sortType:null,sorted:!1,parentTable:{}}},computed:{classes:function(){var t=this.hasMatchSort();return t||(this.sorted=!1),{"md-numeric":this.mdNumeric,"md-sortable":this.mdSortBy,"md-sorted":t&&this.sorted,"md-sorted-descending":t&&"desc"===this.sortType}}},methods:{hasMatchSort:function(){return this.parentTable.sortBy===this.mdSortBy},changeSort:function(){this.mdSortBy&&("asc"===this.sortType&&this.sorted?this.sortType="desc":this.sortType="asc",this.sorted=!0,this.parentTable.sortType=this.sortType,this.parentTable.emitSort(this.mdSortBy))},initSort:function(){this.hasMatchSort()&&(this.sorted=!0,this.sortType=this.parentTable.sortType||"asc")}},mounted:function(){var t=this;this.parentTable=(0,o.default)(this.$parent,"md-table"),this.initSort(),this.parentTable.$on("sortInput",(function(){t.initSort()}))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("th",{staticClass:"md-table-head",class:t.classes,on:{click:t.changeSort}},[n("div",{staticClass:"md-table-head-container"},[n("div",{staticClass:"md-table-head-text md-test"},[t.mdSortBy?n("md-icon",{staticClass:"md-sortable-icon"},[t._v("arrow_upward")]):t._e(),t._v(" "),t._t("default"),t._v(" "),t.mdTooltip?n("md-tooltip",[t._v(t._s(t.mdTooltip))]):t._e()],2),t._v(" "),n("md-ink-ripple",{attrs:{"md-disabled":!t.mdSortBy}})],1)])},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(400),n(401),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-table-cell",props:{mdNumeric:Boolean},data:function(){return{hasAction:!1}},computed:{classes:function(){return{"md-numeric":this.mdNumeric,"md-has-action":this.hasAction}}},mounted:function(){this.$children.length>0&&(this.hasAction=!0)}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("td",{staticClass:"md-table-cell",class:t.classes},[n("div",{staticClass:"md-table-cell-container"},[t._t("default")],2)])},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(403),n(404),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-table-edit",props:{value:[String,Number],mdLarge:Boolean,mdId:String,mdName:String,mdPlaceholder:String,mdMaxlength:[Number,String]},data:function(){return{active:!1}},computed:{triggerClasses:function(){return{"md-edited":this.value}},dialogClasses:function(){return{"md-active":this.active,"md-large":this.mdLarge}},realValue:function(){console.log(this.value)}},methods:{openDialog:function(){this.active=!0,this.$refs.input.$el.focus(),document.addEventListener("click",this.closeDialogOnOffClick)},closeDialog:function(){this.active&&(this.active=!1,this.$refs.input.$el.blur(),document.removeEventListener("click",this.closeDialogOnOffClick))},closeDialogOnOffClick:function(t){this.$refs.dialog.contains(t.target)||this.closeDialog()},confirmDialog:function(){var t=this.$refs.input.$el.value;this.closeDialog(),this.$emit("input",t),this.$emit("edited",t)}}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table-edit",on:{keydown:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27))return null;t.closeDialog(e)}}},[n("div",{staticClass:"md-table-edit-trigger",class:t.triggerClasses,on:{click:function(e){e.stopPropagation(),t.openDialog(e)}}},[t._v("\n    "+t._s(t.value||t.mdPlaceholder)+"\n  ")]),t._v(" "),n("div",{ref:"dialog",staticClass:"md-table-dialog",class:t.dialogClasses},[n("md-input-container",[n("md-input",{ref:"input",attrs:{id:t.mdId,name:t.mdName,maxlength:t.mdMaxlength,value:t.value,placeholder:t.mdPlaceholder},nativeOn:{keydown:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;t.confirmDialog(e)}}})],1)],1)])},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(406),n(407),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-table-card",mixins:[o.default]},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("md-card",{staticClass:"md-table-card",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(409),n(410),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),r=n(11),s=i(r);e.default={name:"md-table-alternate-header",mixins:[a.default],props:{mdSelectedLabel:{type:String,default:"selected"}},data:function(){return{classes:{},tableInstance:{}}},computed:{numberOfSelected:function(){return this.tableInstance.numberOfSelected||0}},mounted:function(){var t=this;this.parentCard=(0,s.default)(this.$parent,"md-table-card"),this.$nextTick((function(){t.tableInstance=t.parentCard.tableInstance,t.$watch("tableInstance.numberOfSelected",(function(){t.$refs.counter.textContent=t.tableInstance.numberOfSelected,t.classes={"md-active":t.tableInstance.numberOfSelected>0}}))}))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table-alternate-header",class:[t.themeClass,t.classes]},[n("md-toolbar",[n("div",{staticClass:"md-counter"},[n("span",{ref:"counter"},[t._v(t._s(t.numberOfSelected))]),t._v(" "),n("span",[t._v(t._s(t.mdSelectedLabel))])]),t._v(" "),t._t("default")],2)],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(412),n(416),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(413),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-table-pagination",props:{mdSize:{type:[Number,String],default:10},mdPageOptions:{type:[Array,Boolean],default:function(){return[10,25,50,100]}},mdPage:{type:[Number,String],default:1},mdTotal:{type:[Number,String],default:"Many"},mdLabel:{type:String,default:"Rows per page"},mdSeparator:{type:String,default:"of"}},data:function(){return{totalItems:0,currentPage:parseInt(this.mdPage,10),currentSize:parseInt(this.mdSize,10)}},watch:{mdTotal:function(t){this.totalItems=isNaN(t)?o.default:parseInt(t,10)},mdSize:function(t){this.currentSize=parseInt(t,10)},mdPage:function(t){this.currentPage=parseInt(t,10)}},computed:{lastPage:function(){return!1},shouldDisable:function(){return this.currentSize*this.currentPage>=this.totalItems},subTotal:function(){var t=this.currentPage*this.currentSize;return t>this.mdTotal?this.mdTotal:t}},methods:{emitPaginationEvent:function(){this.canFireEvents&&this.$emit("pagination",{size:this.currentSize,page:this.currentPage})},changeSize:function(){this.canFireEvents&&(this.$emit("size",this.currentSize),this.emitPaginationEvent())},previousPage:function(){this.canFireEvents&&(this.currentPage--,this.$emit("page",this.currentPage),this.emitPaginationEvent())},nextPage:function(){this.canFireEvents&&(this.currentPage++,this.$emit("page",this.currentPage),this.emitPaginationEvent())}},mounted:function(){var t=this;this.$nextTick((function(){t.totalItems=isNaN(t.mdTotal)?o.default:parseInt(t.mdTotal,10),t.mdPageOptions?t.currentSize=t.mdPageOptions.includes(t.currentSize)?t.currentSize:t.mdPageOptions[0]:t.currentSize=t.mdSize,t.canFireEvents=!0}))}},t.exports=e.default}),(function(t,e,n){t.exports={default:n(414),__esModule:!0}}),(function(t,e,n){n(415),t.exports=9007199254740991}),(function(t,e,n){var i=n(16);i(i.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-table-pagination"},[!1!==t.mdPageOptions?[n("span",{staticClass:"md-table-pagination-label"},[t._v(t._s(t.mdLabel)+":")]),t._v(" "),n("md-select",{attrs:{"md-menu-class":"md-pagination-select"},on:{change:t.changeSize},model:{value:t.currentSize,callback:function(e){t.currentSize=e},expression:"currentSize"}},t._l(t.mdPageOptions,(function(e){return n("md-option",{key:e,attrs:{value:e}},[t._v(t._s(e))])})))]:t._e(),t._v(" "),n("span",[t._v(t._s((t.currentPage-1)*t.currentSize+1)+"-"+t._s(t.subTotal)+" "+t._s(t.mdSeparator)+" "+t._s(t.mdTotal))]),t._v(" "),n("md-button",{staticClass:"md-icon-button md-table-pagination-previous",attrs:{disabled:1===t.currentPage},on:{click:t.previousPage}},[n("md-icon",[t._v("keyboard_arrow_left")])],1),t._v(" "),n("md-button",{staticClass:"md-icon-button md-table-pagination-next",attrs:{disabled:t.shouldDisable},on:{click:t.nextPage}},[n("md-icon",[t._v("keyboard_arrow_right")])],1)],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-table-card .md-toolbar{background-color:BACKGROUND-COLOR;color:BACKGROUND-CONTRAST}.THEME_NAME.md-table-alternate-header{background-color:BACKGROUND-COLOR}.THEME_NAME.md-table-alternate-header .md-toolbar{background-color:ACCENT-COLOR-A100-0.2;color:ACCENT-CONTRAST-A100}.THEME_NAME.md-table-alternate-header .md-counter{color:ACCENT-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-tabs",r.default),t.component("md-tab",d.default),t.material.styles.push(c.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(419),r=i(a),s=n(426),d=i(s),l=n(429),c=i(l);t.exports=e.default}),(function(t,e,n){function i(t){n(420)}var o=n(0)(n(421),n(425),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(38),a=i(o),r=n(422),s=i(r),d=n(1),l=i(d),c=n(59),u=i(c);e.default={name:"md-tabs",props:{mdFixed:Boolean,mdCentered:Boolean,mdRight:Boolean,mdNavigation:{type:Boolean,default:!0},mdDynamicHeight:{type:Boolean,default:!0},mdElevation:{type:[String,Number],default:0}},mixins:[l.default],data:function(){return{tabList:{},activeTab:null,activeTabNumber:0,hasIcons:!1,hasLabel:!1,hasNavigationScroll:!1,isNavigationOnStart:!0,isNavigationOnEnd:!1,transitionControl:null,transitionOff:!1,contentHeight:"0px",contentWidth:"0px"}},computed:{tabClasses:function(){return{"md-dynamic-height":this.mdDynamicHeight,"md-transition-off":this.transitionOff}},navigationClasses:function(){return{"md-has-icon":this.hasIcons,"md-has-label":this.hasLabel,"md-fixed":this.mdFixed,"md-right":!this.mdCentered&&this.mdRight,"md-centered":this.mdCentered||this.mdFixed,"md-has-navigation-scroll":this.hasNavigationScroll}},indicatorClasses:function(){var t=this.lastIndicatorNumber>this.activeTabNumber;return this.lastIndicatorNumber=this.activeTabNumber,{"md-transition-off":this.transitionOff,"md-to-right":!t,"md-to-left":t}},navigationLeftButtonClasses:function(){return{"md-disabled":this.isNavigationOnStart}},navigationRightButtonClasses:function(){return{"md-disabled":this.isNavigationOnEnd}}},methods:{getHeaderClass:function(t){return{"md-active":this.activeTab===t.id,"md-disabled":t.disabled}},registerTab:function(t){var e=!1,n=!0,i=!1,o=void 0;try{for(var r,d=(0,s.default)((0,a.default)(this.tabList));!(n=(r=d.next()).done);n=!0){var l=r.value;if(this.tabList[l].active){e=!0;break}}}catch(t){i=!0,o=t}finally{try{!n&&d.return&&d.return()}finally{if(i)throw o}}this.$set(this.tabList,t.id,t),e||t.disabled||(this.tabList[t.id].active=!0)},unregisterTab:function(t){this.$delete(this.tabList,t.id)},updateTab:function(t){if(this.registerTab(t),t.active)if(t.disabled){if((0,a.default)(this.tabList).length){var e=(0,a.default)(this.tabList),n=e.indexOf(t.id)+1,i=e[n];i?this.setActiveTab(this.tabList[i]):this.setActiveTab(this.tabList[0])}}else this.setActiveTab(t)},observeElementChanges:function(){this.parentObserver=new MutationObserver((0,u.default)(this.calculateOnWatch,50)),this.parentObserver.observe(this.$refs.tabContent,{childList:!0,attributes:!0,subtree:!0})},getTabIndex:function(t){return(0,a.default)(this.tabList).indexOf(t)},calculateIndicatorPos:function(){if(this.$refs.tabHeader&&this.$refs.tabHeader[this.activeTabNumber]){var t=this.$el.offsetWidth,e=this.$refs.tabHeader[this.activeTabNumber],n=e.offsetLeft-this.$refs.tabsContainer.scrollLeft,i=t-n-e.offsetWidth;this.$refs.indicator.style.left=n+"px",this.$refs.indicator.style.right=i+"px"}},calculateTabsWidthAndPosition:function(){var t=this.$el.offsetWidth,e=0;this.contentWidth=t*this.activeTabNumber+"px";for(var n in this.tabList){var i=this.tabList[n];i.ref.width=t+"px",i.ref.left=t*e+"px",e++}},calculateContentHeight:function(){var t=this;this.$nextTick((function(){if((0,a.default)(t.tabList).length){var e=t.tabList[t.activeTab].ref.$el.offsetHeight;t.contentHeight=e+"px"}}))},calculatePosition:function(){var t=this;window.requestAnimationFrame((function(){t._destroyed||(t.calculateIndicatorPos(),t.calculateTabsWidthAndPosition(),t.calculateContentHeight(),t.checkNavigationScroll())}))},debounceTransition:function(){var t=this;window.clearTimeout(this.transitionControl),this.transitionControl=window.setTimeout((function(){t.calculatePosition(),t.transitionOff=!1}),200)},calculateOnWatch:function(){this.calculatePosition(),this.debounceTransition()},calculateOnResize:function(){this.transitionOff=!0,this.calculateOnWatch()},calculateScrollPos:function(){var t=this.$refs.tabsContainer,e=t.scrollLeft,n=t.scrollWidth,i=t.clientWidth;this.isNavigationOnStart=e<32,this.isNavigationOnEnd=n-e-32<i},handleNavigationScroll:function(){var t=this;window.requestAnimationFrame((function(){t._destroyed||(t.calculateIndicatorPos(),t.calculateScrollPos())}))},checkNavigationScroll:function(){var t=this.$refs.tabsContainer,e=t.scrollWidth,n=t.clientWidth;this.hasNavigationScroll=e>n},setActiveTab:function(t){this.hasIcons=!!t.icon||!!t.iconset||!!t.iconSrc,this.hasLabel=!!t.label,this.activeTab=t.id,this.activeTabNumber=this.getTabIndex(this.activeTab),this.calculatePosition(),this.$emit("change",this.activeTabNumber)},navigationScrollLeft:function(){var t=this.$refs.tabsContainer,e=t.scrollLeft,n=t.clientWidth;this.$refs.tabsContainer.scrollLeft=Math.max(0,e-n)},navigationScrollRight:function(){var t=this.$refs.tabsContainer,e=t.scrollLeft,n=t.clientWidth,i=t.scrollWidth;this.$refs.tabsContainer.scrollLeft=Math.min(i,e+n)}},activated:function(){this.calculateOnResize()},mounted:function(){var t=this;this.$nextTick((function(){if(t.observeElementChanges(),window.addEventListener("resize",t.calculateOnResize),(0,a.default)(t.tabList).length&&!t.activeTab){var e=(0,a.default)(t.tabList)[0];t.setActiveTab(t.tabList[e])}}))},beforeDestroy:function(){this.parentObserver&&this.parentObserver.disconnect(),window.removeEventListener("resize",this.calculateOnResize),this._destroyed=!0}},t.exports=e.default}),(function(t,e,n){t.exports={default:n(423),__esModule:!0}}),(function(t,e,n){n(68),n(48),t.exports=n(424)}),(function(t,e,n){var i=n(13),o=n(60);t.exports=n(4).getIterator=function(t){var e=o(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return i(e.call(t))}}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"md-tabs",class:[t.themeClass,t.tabClasses]},[n("md-whiteframe",{ref:"tabNavigation",staticClass:"md-tabs-navigation",class:t.navigationClasses,attrs:{"md-tag":"nav","md-elevation":t.mdElevation}},[n("div",{ref:"tabsContainer",staticClass:"md-tabs-navigation-container",on:{scroll:t.handleNavigationScroll}},[n("div",{staticClass:"md-tabs-navigation-scroll-container"},[t._l(t.tabList,(function(e){return n("button",{key:e.id,ref:"tabHeader",refInFor:!0,staticClass:"md-tab-header",class:t.getHeaderClass(e),attrs:{type:"button",disabled:e.disabled},on:{click:function(n){t.setActiveTab(e)}}},[n("md-ink-ripple",{attrs:{"md-disabled":e.disabled}}),t._v(" "),n("div",{staticClass:"md-tab-header-container"},[t._t("header-item",[e.icon?n("md-icon",[t._v(t._s(e.icon))]):e.iconset?n("md-icon",{attrs:{"md-iconset":e.iconset}},[t._v(t._s(e.icon))]):e.iconSrc?n("md-icon",{attrs:{"md-src":e.iconSrc}}):t._e(),t._v(" "),e.label?n("span",[t._v(t._s(e.label))]):t._e()],{header:e})],2),t._v(" "),e.tooltip?n("md-tooltip",{attrs:{"md-direction":e.tooltipDirection,"md-delay":e.tooltipDelay}},[t._v(t._s(e.tooltip))]):t._e()],1)})),t._v(" "),n("span",{ref:"indicator",staticClass:"md-tab-indicator",class:t.indicatorClasses})],2)]),t._v(" "),t.mdNavigation&&t.hasNavigationScroll?n("button",{staticClass:"md-tab-header-navigation-button md-left",class:t.navigationLeftButtonClasses,on:{click:t.navigationScrollLeft}},[n("md-icon",[t._v("keyboard_arrow_left")])],1):t._e(),t._v(" "),t.mdNavigation&&t.hasNavigationScroll?n("button",{staticClass:"md-tab-header-navigation-button md-right",class:t.navigationRightButtonClasses,on:{click:t.navigationScrollRight}},[n("md-icon",[t._v("keyboard_arrow_right")])],1):t._e()]),t._v(" "),n("div",{ref:"tabContent",staticClass:"md-tabs-content",style:{height:t.contentHeight}},[n("div",{staticClass:"md-tabs-wrapper",style:{transform:"translate3D(-"+t.contentWidth+", 0, 0)"}},[t._t("default")],2)])],1)},staticRenderFns:[]}}),(function(t,e,n){var i=n(0)(n(427),n(428),null,null,null);t.exports=i.exports}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(36),a=i(o),r=n(11),s=i(r);e.default={name:"md-tab",props:{id:[String,Number],mdLabel:[String,Number],mdIcon:String,mdIconset:String,mdIconSrc:String,mdActive:Boolean,mdDisabled:Boolean,mdOptions:{default:void 0},mdTooltip:String,mdTooltipDelay:{type:String,default:"0"},mdTooltipDirection:{type:String,default:"bottom"}},data:function(){return{mounted:!1,tabId:this.id||"tab-"+(0,a.default)(),width:"0px",left:"0px"}},watch:{mdActive:function(){this.updateTabData()},mdDisabled:function(){this.updateTabData()},mdIcon:function(){this.updateTabData()},mdIconset:function(){this.updateTabData()},mdIconSrc:function(){this.updateTabData()},mdOptions:{deep:!0,handler:function(){this.updateTabData()}},mdLabel:function(){this.updateTabData()},mdTooltip:function(){this.updateTabData()},mdTooltipDelay:function(){this.updateTabData()},mdTooltipDirection:function(){this.updateTabData()}},computed:{styles:function(){return{width:this.width,left:this.left}}},methods:{getTabData:function(){return{id:this.tabId,label:this.mdLabel,icon:this.mdIcon,iconset:this.mdIconset,iconSrc:this.mdIconSrc,options:this.mdOptions,active:this.mdActive,disabled:this.mdDisabled,tooltip:this.mdTooltip,tooltipDelay:this.mdTooltipDelay,tooltipDirection:this.mdTooltipDirection,ref:this}},updateTabData:function(){this.parentTabs.updateTab(this.getTabData())}},mounted:function(){var t=this.getTabData();if(this.parentTabs=(0,s.default)(this.$parent,"md-tabs"),!this.parentTabs)throw new Error("You must wrap the md-tab in a md-tabs");this.mounted=!0,this.parentTabs.updateTab(t),this.mdActive&&this.parentTabs.setActiveTab(t)},beforeDestroy:function(){this.parentTabs.unregisterTab(this.getTabData())}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-tab",style:t.styles,attrs:{id:t.tabId}},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-tabs>.md-tabs-navigation{background-color:PRIMARY-COLOR}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header:focus{color:PRIMARY-CONTRAST}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header.md-disabled{color:PRIMARY-CONTRAST-0.26}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-indicator{background-color:ACCENT-COLOR}.THEME_NAME.md-tabs>.md-tabs-navigation .md-tab-header-navigation-button{color:PRIMARY-CONTRAST-0.54;background-color:PRIMARY-COLOR}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation{background-color:transparent;border-bottom:1px solid BACKGROUND-CONTRAST-0.12}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header:focus{color:PRIMARY-COLOR}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-header.md-disabled{color:BACKGROUND-CONTRAST-0.26}.THEME_NAME.md-tabs.md-transparent>.md-tabs-navigation .md-tab-indicator{background-color:PRIMARY-COLOR}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation{background-color:ACCENT-COLOR}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header:focus{color:ACCENT-CONTRAST}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-header.md-disabled{color:ACCENT-CONTRAST-0.26}.THEME_NAME.md-tabs.md-accent>.md-tabs-navigation .md-tab-indicator{background-color:BACKGROUND-COLOR}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation{background-color:WARN-COLOR}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header{color:WARN-CONTRAST-0.54}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header.md-active,.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header:focus{color:WARN-CONTRAST}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-header.md-disabled{color:WARN-CONTRAST-0.26}.THEME_NAME.md-tabs.md-warn>.md-tabs-navigation .md-tab-indicator{background-color:BACKGROUND-COLOR}\n"}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){t.component("md-toolbar",r.default),t.material.styles.push(d.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o;var a=n(431),r=i(a),s=n(435),d=i(s);t.exports=e.default}),(function(t,e,n){function i(t){n(432)}var o=n(0)(n(433),n(434),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=(function(t){return t&&t.__esModule?t:{default:t}})(i);e.default={name:"md-toolbar",mixins:[o.default]},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md-toolbar",class:[t.themeClass]},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e){t.exports=".THEME_NAME.md-toolbar{background-color:PRIMARY-COLOR;color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar .md-input-container.md-input-focused textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container:after{background-color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container input,.THEME_NAME.md-toolbar .md-input-container textarea{color:PRIMARY-CONTRAST;text-shadow:0 0 0 PRIMARY-CONTRAST}.THEME_NAME.md-toolbar .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar .md-input-container textarea::-webkit-input-placeholder{color:PRIMARY-CONTRAST-0.54}.THEME_NAME.md-toolbar .md-input-container label,.THEME_NAME.md-toolbar .md-input-container .md-icon:not(.md-icon-delete){color:PRIMARY-CONTRAST}.THEME_NAME.md-toolbar.md-accent{background-color:ACCENT-COLOR;color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar.md-accent .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container:after{background-color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container input,.THEME_NAME.md-toolbar.md-accent .md-input-container textarea{color:ACCENT-CONTRAST;text-shadow:0 0 0 ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-accent .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar.md-accent .md-input-container textarea::-webkit-input-placeholder{color:ACCENT-CONTRAST-0.54}.THEME_NAME.md-toolbar.md-accent .md-input-container label,.THEME_NAME.md-toolbar.md-accent .md-input-container .md-icon:not(.md-icon-delete){color:ACCENT-CONTRAST}.THEME_NAME.md-toolbar.md-warn{background-color:WARN-COLOR;color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar.md-warn .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container:after{background-color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container input,.THEME_NAME.md-toolbar.md-warn .md-input-container textarea{color:WARN-CONTRAST;text-shadow:0 0 0 WARN-CONTRAST}.THEME_NAME.md-toolbar.md-warn .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar.md-warn .md-input-container textarea::-webkit-input-placeholder{color:WARN-CONTRAST-0.54}.THEME_NAME.md-toolbar.md-warn .md-input-container label,.THEME_NAME.md-toolbar.md-warn .md-input-container .md-icon:not(.md-icon-delete){color:WARN-CONTRAST}.THEME_NAME.md-toolbar.md-transparent{background-color:transparent;color:BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused input,.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused textarea{color:BACKGROUND-CONTRAST;text-shadow:0 0 0 BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused label,.THEME_NAME.md-toolbar.md-transparent .md-input-container.md-input-focused .md-icon:not(.md-icon-delete){color:BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container:after{background-color:BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container input,.THEME_NAME.md-toolbar.md-transparent .md-input-container textarea{color:BACKGROUND-CONTRAST;text-shadow:0 0 0 BACKGROUND-CONTRAST}.THEME_NAME.md-toolbar.md-transparent .md-input-container input::-webkit-input-placeholder,.THEME_NAME.md-toolbar.md-transparent .md-input-container textarea::-webkit-input-placeholder{color:BACKGROUND-CONTRAST-0.54}.THEME_NAME.md-toolbar.md-transparent .md-input-container label,.THEME_NAME.md-toolbar.md-transparent .md-input-container .md-icon:not(.md-icon-delete){color:BACKGROUND-CONTRAST}\n"}),(function(t,e,n){"use strict";function i(t){t.component("md-tooltip",a.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;var o=n(437),a=(function(t){return t&&t.__esModule?t:{default:t}})(o);t.exports=e.default}),(function(t,e,n){function i(t){n(438)}var o=n(0)(n(439),n(440),i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(66),a=i(o),r=n(42),s=i(r);e.default={name:"md-tooltip",props:{mdDirection:{type:String,default:"bottom"},mdDelay:{type:String,default:"0"}},data:function(){return{active:!1,parentClass:null,transitionOff:!1,topPosition:!1,leftPosition:!1}},computed:{classes:function(){var t={"md-active":this.active,"md-transition-off":this.transitionOff,"md-tooltip-top":"top"===this.mdDirection,"md-tooltip-right":"right"===this.mdDirection,"md-tooltip-bottom":"bottom"===this.mdDirection,"md-tooltip-left":"left"===this.mdDirection};return this.parentClass&&(t[this.parentClass]=!0),t},style:function(){return{"transition-delay":this.mdDelay+"ms",top:this.topPosition+"px",left:this.leftPosition+"px"}}},watch:{mdDirection:function(){this.calculateTooltipPosition()}},methods:{removeTooltips:function(){this.tooltipElement&&this.tooltipElement.parentNode&&(this.tooltipElement.removeEventListener(s.default,this.removeTooltips),this.tooltipElement.parentNode.removeChild(this.tooltipElement))},calculateTooltipPosition:function(){var t=this.parentElement.getBoundingClientRect(),e={};switch(this.mdDirection){case"top":e.top=t.top-this.$el.offsetHeight,e.left=t.left+t.width/2;break;case"right":e.top=t.top,e.left=t.left+t.width;break;case"bottom":e.top=t.bottom,e.left=t.left+t.width/2;break;case"left":e.top=t.top,e.left=t.left-this.$el.offsetWidth;break;default:console.warn("Invalid "+this.mdDirection+" option to md-direction option")}this.topPosition=e.top,this.leftPosition=e.left},generateTooltipClasses:function(){var t=[];[].concat((0,a.default)(this.parentElement.classList)).forEach((function(e){e.indexOf("md-")>=0&&"md-active"!==e&&t.push(e+"-tooltip")})),this.parentClass=t.join(" ")},open:function(){var t=this;this.removeTooltips(),this.$nextTick((function(){document.body.appendChild(t.tooltipElement),getComputedStyle(t.tooltipElement).top,t.transitionOff=!0,t.generateTooltipClasses(),t.calculateTooltipPosition(),window.setTimeout((function(){t.transitionOff=!1,t.active=!0}),10)}))},close:function(){this.active=!1,this.tooltipElement.removeEventListener(s.default,this.removeTooltips),this.tooltipElement.addEventListener(s.default,this.removeTooltips)}},mounted:function(){var t=this;this.$nextTick((function(){t.tooltipElement=t.$el,t.parentElement=t.tooltipElement.parentNode,t.$el.parentNode.removeChild(t.$el),t.parentElement.addEventListener("mouseenter",t.open),t.parentElement.addEventListener("focus",t.open),t.parentElement.addEventListener("mouseleave",t.close),t.parentElement.addEventListener("blur",t.close)}))},beforeDestroy:function(){this.active=!1,this.removeTooltips(),this.parentElement&&(this.parentElement.removeEventListener("mouseenter",this.open),this.parentElement.removeEventListener("focus",this.open),this.parentElement.removeEventListener("mouseleave",this.close),this.parentElement.removeEventListener("blur",this.close))}},t.exports=e.default}),(function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",{staticClass:"md-tooltip",class:t.classes,style:t.style},[t._t("default")],2)},staticRenderFns:[]}}),(function(t,e,n){"use strict";function i(t){t.component("md-whiteframe",a.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i;var o=n(442),a=(function(t){return t&&t.__esModule?t:{default:t}})(o);t.exports=e.default}),(function(t,e,n){function i(t){n(443)}var o=n(0)(n(444),null,i,null,null);t.exports=o.exports}),(function(t,e){}),(function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"md-whiteframe",props:{mdElevation:{type:[String,Number],default:1},mdTag:{type:String,default:"div"}},computed:{classes:function(){var t=parseInt(this.mdElevation,10),e="md-whiteframe-";return isNaN(t)||"number"!=typeof t?this.mdElevation.indexOf("dp")>-1&&(e+=this.mdElevation):(e+=t,e+="dp"),e}},render:function(t){return t(this.mdTag,{staticClass:"md-whiteframe",class:this.classes},this.$slots.default)}},t.exports=e.default}),(function(t,e,n){t.exports=n(446)}),(function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(80),a=i(o),r=n(94),s=i(r),d=n(100),l=i(d),c=n(105),u=i(c),m=n(114),f=i(m),h=n(120),p=i(h),b=n(126),v=i(b),g=n(159),E=i(g),_=n(165),C=i(_),M=n(174),T=i(M),A=n(198),x=i(A),y=n(203),N=i(y),O=n(209),S=i(O),R=n(215),w=i(R),k=n(221),H=i(k),P=n(242),L=i(P),$=n(246),I=i($),B=n(287),D=i(B),F=n(301),j=i(F),W=n(310),Y=i(W),V=n(316),U=i(V),G=n(322),z=i(G),q=n(328),K=i(q),X=n(337),J=i(X),Q=n(343),Z=i(Q),tt=n(351),et=i(tt),nt=n(357),it=i(nt),ot=n(363),at=i(ot),rt=n(376),st=i(rt),dt=n(382),lt=i(dt),ct=n(388),ut=i(ct),mt=n(418),ft=i(mt),ht=n(430),pt=i(ht),bt=n(436),vt=i(bt),gt=n(441),Et=i(gt),_t={MdCore:a.default,MdAvatar:s.default,MdBackdrop:l.default,MdBottomBar:u.default,MdButton:f.default,MdButtonToggle:p.default,MdCard:v.default,MdCheckbox:E.default,MdChips:C.default,MdDialog:T.default,MdDivider:x.default,MdFile:N.default,MdIcon:S.default,MdImage:w.default,MdInputContainer:H.default,MdLayout:L.default,MdList:I.default,MdMenu:D.default,MdOnboarding:j.default,MdProgress:Y.default,MdRadio:U.default,MdRatingBar:z.default,MdSelect:K.default,MdSidenav:J.default,MdSnackbar:Z.default,MdSpeedDial:et.default,MdSpinner:it.default,MdStepper:at.default,MdSubheader:st.default,MdSwitch:lt.default,MdTable:ut.default,MdTabs:ft.default,MdToolbar:pt.default,MdTooltip:vt.default,MdWhiteframe:Et.default};_t.install=function(t){for(var e in _t){var n=_t[e];n&&"install"!==e&&t.use(n)}},e.default=_t,t.exports=e.default})])}));

/***/ }),

/***/ "./node_modules/_vue-router@3.0.1@vue-router/dist/vue-router.esm.js":
/*!**************************************************************************!*\
  !*** ./node_modules/_vue-router@3.0.1@vue-router/dist/vue-router.esm.js ***!
  \**************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if ("development" !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (true) {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "development" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (true) {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (true) {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (true) {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ("development" !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (true) {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (true) {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (true) {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (true) {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (true) {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (true) {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (true) {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (true) {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "development" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (true) {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "development" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);


/***/ }),

/***/ "./node_modules/_vue@2.5.13@vue/dist/vue.esm.js":
/*!******************************************************!*\
  !*** ./node_modules/_vue@2.5.13@vue/dist/vue.esm.js ***!
  \******************************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (true) {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.13';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (true) {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (true) {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (true) {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (true) {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (true) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = { value: value };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (true) {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (true) {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  if (true) {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    if (value$1) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (true) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (true) {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        if (true) {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (true) {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (true) {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (true) {
      warn$2(
        ("Invalid v-for expression: " + exp)
      );
    }
  }
}

function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '');
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (true) {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (true) {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$2 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$2
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    return ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    /* istanbul ignore if */
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
    }
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    if (true) {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (true) {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (true) {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (true) {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (true) {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

/* harmony default export */ __webpack_exports__["default"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../_webpack@3.10.0@webpack/buildin/global.js */ "./node_modules/_webpack@3.10.0@webpack/buildin/global.js"), __webpack_require__(/*! ./../../_timers-browserify@2.0.4@timers-browserify/main.js */ "./node_modules/_timers-browserify@2.0.4@timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/index.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! exports used: validationMixin */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withParams = exports.validationMixin = exports.Vuelidate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _vval = __webpack_require__(/*! ./vval */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/vval.js");

var _params = __webpack_require__(/*! ./params */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/params.js");

var NUL = function NUL() {
  return null;
};

var buildFromKeys = function buildFromKeys(keys, fn, keyFn) {
  return keys.reduce(function (build, key) {
    build[keyFn ? keyFn(key) : key] = fn(key);
    return build;
  }, {});
};

function isFunction(val) {
  return typeof val === 'function';
}

function isObject(val) {
  return val !== null && (typeof val === 'object' || isFunction(val));
}

function isPromise(object) {
  return isObject(object) && isFunction(object.then);
}

var getPath = function getPath(ctx, obj, path, fallback) {
  if (typeof path === 'function') {
    return path.call(ctx, obj, fallback);
  }

  path = Array.isArray(path) ? path : path.split('.');
  for (var i = 0; i < path.length; i++) {
    if (obj && typeof obj === 'object') {
      obj = obj[path[i]];
    } else {
      return fallback;
    }
  }

  return typeof obj === 'undefined' ? fallback : obj;
};

var __isVuelidateAsyncVm = '__isVuelidateAsyncVm';
function makePendingAsyncVm(Vue, promise) {
  var asyncVm = new Vue({
    data: {
      p: true, // pending
      v: false // value
    }
  });

  promise.then(function (value) {
    asyncVm.p = false;
    asyncVm.v = value;
  }, function (error) {
    asyncVm.p = false;
    asyncVm.v = false;
    throw error;
  });

  asyncVm[__isVuelidateAsyncVm] = true;
  return asyncVm;
}

var validationGetters = {
  $invalid: function $invalid() {
    var _this = this;

    var proxy = this.proxy;
    return this.nestedKeys.some(function (nested) {
      return _this.refProxy(nested).$invalid;
    }) || this.ruleKeys.some(function (rule) {
      return !proxy[rule];
    });
  },
  $dirty: function $dirty() {
    var _this2 = this;

    if (this.dirty) {
      return true;
    }
    if (this.nestedKeys.length === 0) {
      return false;
    }

    return this.nestedKeys.every(function (key) {
      return _this2.refProxy(key).$dirty;
    });
  },
  $error: function $error() {
    return this.$dirty && !this.$pending && this.$invalid;
  },
  $pending: function $pending() {
    var _this3 = this;

    return this.ruleKeys.some(function (key) {
      return _this3.getRef(key).$pending;
    }) || this.nestedKeys.some(function (key) {
      return _this3.refProxy(key).$pending;
    });
  },
  $params: function $params() {
    var _this4 = this;

    var vals = this.validations;
    return _extends({}, buildFromKeys(this.nestedKeys, function (key) {
      return vals[key] && vals[key].$params || null;
    }), buildFromKeys(this.ruleKeys, function (key) {
      return _this4.getRef(key).$params;
    }));
  }
};

function setDirtyRecursive(newState) {
  this.dirty = newState;
  var proxy = this.proxy;
  var method = newState ? '$touch' : '$reset';
  this.nestedKeys.forEach(function (key) {
    proxy[key][method]();
  });
}

var validationMethods = {
  $touch: function $touch() {
    setDirtyRecursive.call(this, true);
  },
  $reset: function $reset() {
    setDirtyRecursive.call(this, false);
  },
  $flattenParams: function $flattenParams() {
    var proxy = this.proxy;
    var params = [];
    for (var key in this.$params) {
      if (this.isNested(key)) {
        var childParams = proxy[key].$flattenParams();
        for (var j = 0; j < childParams.length; j++) {
          childParams[j].path.unshift(key);
        }
        params = params.concat(childParams);
      } else {
        params.push({ path: [], name: key, params: this.$params[key] });
      }
    }
    return params;
  }
};

var getterNames = Object.keys(validationGetters);
var methodNames = Object.keys(validationMethods);

var _cachedComponent = null;
var getComponent = function getComponent(Vue) {
  if (_cachedComponent) {
    return _cachedComponent;
  }

  var VBase = Vue.extend({
    beforeCreate: function beforeCreate() {
      this._vval = null;
    },
    beforeDestroy: function beforeDestroy() {
      if (this._vval) {
        (0, _vval.patchChildren)(this._vval);
      }
    },

    methods: {
      getModel: function getModel() {
        return this.lazyModel ? this.lazyModel(this.prop) : this.model;
      },
      getModelKey: function getModelKey(key) {
        var model = this.getModel();
        if (model) {
          return model[key];
        }
      }
    },
    computed: {
      refs: function refs() {
        var oldVval = this._vval;
        this._vval = this.children;
        (0, _vval.patchChildren)(oldVval, this._vval);
        var refs = {};
        this._vval.forEach(function (c) {
          refs[c.key] = c.vm;
        });
        return refs;
      }
    }
  });

  var ValidationRule = VBase.extend({
    data: function data() {
      return {
        rule: null,
        lazyModel: null,
        model: null,
        lazyParentModel: null,
        rootModel: null
      };
    },

    methods: {
      runRule: function runRule(parent) {
        // Avoid using this.lazyParentModel to not get dependent on it.
        // Passed as an argument for workaround
        var model = this.getModel();
        (0, _params.pushParams)();
        var rawOutput = this.rule.call(this.rootModel, model, parent);
        var output = isPromise(rawOutput) ? makePendingAsyncVm(Vue, rawOutput) : rawOutput;

        var rawParams = (0, _params.popParams)();
        var params = rawParams && rawParams.$sub ? rawParams.$sub.length > 1 ? rawParams : rawParams.$sub[0] : null;

        return { output: output, params: params };
      }
    },
    computed: {
      run: function run() {
        return this.runRule(this.lazyParentModel());
      },
      $params: function $params() {
        return this.run.params;
      },
      proxy: function proxy() {
        var output = this.run.output;
        if (output[__isVuelidateAsyncVm]) {
          return !!output.v;
        }
        return !!output;
      },
      $pending: function $pending() {
        var output = this.run.output;
        if (output[__isVuelidateAsyncVm]) {
          return output.p;
        }
        return false;
      }
    }
  });

  var Validation = VBase.extend({
    data: function data() {
      return {
        dirty: false,
        validations: null,
        lazyModel: null,
        model: null,
        prop: null,
        lazyParentModel: null,
        rootModel: null
      };
    },

    methods: _extends({}, validationMethods, {
      refProxy: function refProxy(key) {
        return this.getRef(key).proxy;
      },
      getRef: function getRef(key) {
        return this.refs[key];
      },
      isNested: function isNested(key) {
        return typeof this.validations[key] !== 'function';
      }
    }),
    computed: _extends({}, validationGetters, {
      nestedKeys: function nestedKeys() {
        return this.keys.filter(this.isNested);
      },
      ruleKeys: function ruleKeys() {
        var _this5 = this;

        return this.keys.filter(function (k) {
          return !_this5.isNested(k);
        });
      },
      keys: function keys() {
        return Object.keys(this.validations).filter(function (k) {
          return k !== '$params';
        });
      },
      proxy: function proxy() {
        var _this6 = this;

        var keyDefs = buildFromKeys(this.keys, function (key) {
          return {
            enumerable: true,
            configurable: false,
            get: function get() {
              return _this6.refProxy(key);
            }
          };
        });

        var getterDefs = buildFromKeys(getterNames, function (key) {
          return {
            enumerable: true,
            configurable: false,
            get: function get() {
              return _this6[key];
            }
          };
        });

        var methodDefs = buildFromKeys(methodNames, function (key) {
          return {
            enumerable: false,
            configurable: false,
            get: function get() {
              return _this6[key];
            }
          };
        });

        return Object.defineProperties({}, _extends({}, keyDefs, getterDefs, methodDefs));
      },
      children: function children() {
        var _this7 = this;

        return [].concat(this.nestedKeys.map(function (key) {
          return renderNested(_this7, key);
        }), this.ruleKeys.map(function (key) {
          return renderRule(_this7, key);
        })).filter(Boolean);
      }
    })
  });

  var GroupValidation = Validation.extend({
    methods: {
      isNested: function isNested(key) {
        return typeof this.validations[key]() !== 'undefined';
      },
      getRef: function getRef(key) {
        var vm = this;
        return {
          get proxy() {
            // default to invalid
            return vm.validations[key]() || false;
          }
        };
      }
    }
  });

  var EachValidation = Validation.extend({
    computed: {
      keys: function keys() {
        var model = this.getModel();
        if (isObject(model)) {
          return Object.keys(model);
        } else {
          return [];
        }
      },
      tracker: function tracker() {
        var _this8 = this;

        var trackBy = this.validations.$trackBy;
        return trackBy ? function (key) {
          return '' + getPath(_this8.rootModel, _this8.getModelKey(key), trackBy);
        } : function (x) {
          return '' + x;
        };
      },
      eagerParentModel: function eagerParentModel() {
        var parent = this.lazyParentModel();
        return function () {
          return parent;
        };
      },
      children: function children() {
        var _this9 = this;

        var def = this.validations;
        var model = this.getModel();

        var validations = _extends({}, def);
        delete validations['$trackBy'];

        var usedTracks = {};

        return this.keys.map(function (key) {
          var track = _this9.tracker(key);
          if (usedTracks.hasOwnProperty(track)) {
            return null;
          }
          usedTracks[track] = true;
          return (0, _vval.h)(Validation, track, {
            validations: validations,
            prop: key,
            lazyParentModel: _this9.eagerParentModel,
            model: model[key],
            rootModel: _this9.rootModel
          });
        }).filter(Boolean);
      }
    },
    methods: {
      isNested: function isNested() {
        return true;
      },
      getRef: function getRef(key) {
        return this.refs[this.tracker(key)];
      }
    }
  });

  var renderNested = function renderNested(vm, key) {
    if (key === '$each') {
      return (0, _vval.h)(EachValidation, key, {
        validations: vm.validations[key],
        lazyParentModel: vm.lazyParentModel,
        prop: key,
        lazyModel: vm.getModel,
        rootModel: vm.rootModel
      });
    }
    var validations = vm.validations[key];
    if (Array.isArray(validations)) {
      var root = vm.rootModel;
      var refVals = buildFromKeys(validations, function (path) {
        return function () {
          return getPath(root, root.$v, path);
        };
      }, function (v) {
        return Array.isArray(v) ? v.join('.') : v;
      });
      return (0, _vval.h)(GroupValidation, key, {
        validations: refVals,
        lazyParentModel: NUL,
        prop: key,
        lazyModel: NUL,
        rootModel: root
      });
    }
    return (0, _vval.h)(Validation, key, {
      validations: validations,
      lazyParentModel: vm.getModel,
      prop: key,
      lazyModel: vm.getModelKey,
      rootModel: vm.rootModel
    });
  };

  var renderRule = function renderRule(vm, key) {
    return (0, _vval.h)(ValidationRule, key, {
      rule: vm.validations[key],
      lazyParentModel: vm.lazyParentModel,
      lazyModel: vm.getModel,
      rootModel: vm.rootModel
    });
  };

  _cachedComponent = { VBase: VBase, Validation: Validation };
  return _cachedComponent;
};

var _cachedVue = null;
function getVue(rootVm) {
  if (_cachedVue) return _cachedVue;
  var Vue = rootVm.constructor;
  /* istanbul ignore next */
  while (Vue.super) {
    Vue = Vue.super;
  }_cachedVue = Vue;
  return Vue;
}

var validateModel = function validateModel(model, validations) {
  var Vue = getVue(model);

  var _getComponent = getComponent(Vue),
      Validation = _getComponent.Validation,
      VBase = _getComponent.VBase;

  var root = new VBase({
    computed: {
      children: function children() {
        var vals = typeof validations === 'function' ? validations.call(model) : validations;

        return [(0, _vval.h)(Validation, '$v', {
          validations: vals,
          lazyParentModel: NUL,
          prop: '$v',
          model: model,
          rootModel: model
        })];
      }
    }
  });
  return root;
};

var validationMixin = {
  data: function data() {
    var vals = this.$options.validations;
    if (vals) {
      this._vuelidate = validateModel(this, vals);
    }
    return {};
  },
  beforeCreate: function beforeCreate() {
    var _this10 = this;

    var options = this.$options;
    var vals = options.validations;
    if (!vals) return;
    if (!options.computed) options.computed = {};
    options.computed.$v = function () {
      return _this10._vuelidate.refs.$v.proxy;
    };
  },
  beforeDestroy: function beforeDestroy() {
    if (this._vuelidate) {
      this._vuelidate.$destroy();
      this._vuelidate = null;
    }
  }
};

function Vuelidate(Vue) {
  Vue.mixin(validationMixin);
}

exports.Vuelidate = Vuelidate;
exports.validationMixin = validationMixin;
exports.withParams = _params.withParams;
exports.default = Vuelidate;

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/params.js":
/*!***************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/params.js ***!
  \***************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.pushParams = pushParams;
exports.popParams = popParams;
exports.withParams = withParams;

var stack = [];

// exported for tests
var target = exports.target = null;
var _setTarget = exports._setTarget = function _setTarget(x) {
  exports.target = target = x;
};

function pushParams() {
  if (target !== null) {
    stack.push(target);
  }
  exports.target = target = {};
}

function popParams() {
  var lastTarget = target;
  var newTarget = exports.target = target = stack.pop() || null;
  if (newTarget) {
    if (!Array.isArray(newTarget.$sub)) {
      newTarget.$sub = [];
    }
    newTarget.$sub.push(lastTarget);
  }
  return lastTarget;
}

function addParams(params) {
  if (typeof params === 'object' && !Array.isArray(params)) {
    exports.target = target = _extends({}, target, params);
  } else {
    throw new Error('params must be an object');
  }
}

function withParamsDirect(params, validator) {
  return withParamsClosure(function (add) {
    return function () {
      add(params);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return validator.apply(this, args);
    };
  });
}

function withParamsClosure(closure) {
  var validator = closure(addParams);
  return function () {
    pushParams();
    try {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return validator.apply(this, args);
    } finally {
      popParams();
    }
  };
}

function withParams(paramsOrClosure, maybeValidator) {
  if (typeof paramsOrClosure === 'object' && maybeValidator !== undefined) {
    return withParamsDirect(paramsOrClosure, maybeValidator);
  }
  return withParamsClosure(paramsOrClosure);
}

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/alpha.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/alpha.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = (0, _common.regex)('alpha', /^[a-zA-Z]*$/);

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/alphaNum.js":
/*!****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/alphaNum.js ***!
  \****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = (0, _common.regex)('alphaNum', /^[a-zA-Z0-9]*$/);

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/and.js":
/*!***********************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/and.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function () {
  for (var _len = arguments.length, validators = Array(_len), _key = 0; _key < _len; _key++) {
    validators[_key] = arguments[_key];
  }

  return (0, _common.withParams)({ type: 'and' }, function () {
    var _this = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return validators.length > 0 && validators.reduce(function (valid, fn) {
      return valid && fn.apply(_this, args);
    }, true);
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/between.js":
/*!***************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/between.js ***!
  \***************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (min, max) {
  return (0, _common.withParams)({ type: 'between', min: min, max: max }, function (value) {
    return !(0, _common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +min <= +value && +max >= +value;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js":
/*!**************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js ***!
  \**************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regex = exports.ref = exports.len = exports.req = exports.withParams = undefined;

var _withParams = __webpack_require__(/*! ../withParams */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/withParams.js");

var _withParams2 = _interopRequireDefault(_withParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.withParams = _withParams2.default;

// "required" core, used in almost every validator to allow empty values

var req = exports.req = function req(value) {
  if (Array.isArray(value)) return !!value.length;
  if (value === undefined || value === null || value === false) {
    return false;
  }

  if (value instanceof Date) {
    // invalid date won't pass
    return !isNaN(value.getTime());
  }

  if (typeof value === 'object') {
    for (var _ in value) {
      return true;
    }return false;
  }

  return !!String(value).length;
};

// get length in type-agnostic way
var len = exports.len = function len(value) {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'object') {
    return Object.keys(value).length;
  }
  return String(value).length;
};

// resolve referenced value
var ref = exports.ref = function ref(reference, vm, parentVm) {
  return typeof reference === 'function' ? reference.call(vm, parentVm) : parentVm[reference];
};

// regex based validator template
var regex = exports.regex = function regex(type, expr) {
  return (0, _withParams2.default)({ type: type }, function (value) {
    return !req(value) || expr.test(value);
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/email.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/email.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

var emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

exports.default = (0, _common.regex)('email', emailRegex);

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/index.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! exports used: required */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maxValue = exports.minValue = exports.and = exports.or = exports.url = exports.sameAs = exports.requiredUnless = exports.requiredIf = exports.required = exports.minLength = exports.maxLength = exports.macAddress = exports.ipAddress = exports.email = exports.between = exports.numeric = exports.alphaNum = exports.alpha = undefined;

var _alpha = __webpack_require__(/*! ./alpha */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/alpha.js");

var _alpha2 = _interopRequireDefault(_alpha);

var _alphaNum = __webpack_require__(/*! ./alphaNum */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/alphaNum.js");

var _alphaNum2 = _interopRequireDefault(_alphaNum);

var _numeric = __webpack_require__(/*! ./numeric */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/numeric.js");

var _numeric2 = _interopRequireDefault(_numeric);

var _between = __webpack_require__(/*! ./between */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/between.js");

var _between2 = _interopRequireDefault(_between);

var _email = __webpack_require__(/*! ./email */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/email.js");

var _email2 = _interopRequireDefault(_email);

var _ipAddress = __webpack_require__(/*! ./ipAddress */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/ipAddress.js");

var _ipAddress2 = _interopRequireDefault(_ipAddress);

var _macAddress = __webpack_require__(/*! ./macAddress */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/macAddress.js");

var _macAddress2 = _interopRequireDefault(_macAddress);

var _maxLength = __webpack_require__(/*! ./maxLength */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/maxLength.js");

var _maxLength2 = _interopRequireDefault(_maxLength);

var _minLength = __webpack_require__(/*! ./minLength */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/minLength.js");

var _minLength2 = _interopRequireDefault(_minLength);

var _required = __webpack_require__(/*! ./required */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/required.js");

var _required2 = _interopRequireDefault(_required);

var _requiredIf = __webpack_require__(/*! ./requiredIf */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/requiredIf.js");

var _requiredIf2 = _interopRequireDefault(_requiredIf);

var _requiredUnless = __webpack_require__(/*! ./requiredUnless */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/requiredUnless.js");

var _requiredUnless2 = _interopRequireDefault(_requiredUnless);

var _sameAs = __webpack_require__(/*! ./sameAs */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/sameAs.js");

var _sameAs2 = _interopRequireDefault(_sameAs);

var _url = __webpack_require__(/*! ./url */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/url.js");

var _url2 = _interopRequireDefault(_url);

var _or = __webpack_require__(/*! ./or */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/or.js");

var _or2 = _interopRequireDefault(_or);

var _and = __webpack_require__(/*! ./and */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/and.js");

var _and2 = _interopRequireDefault(_and);

var _minValue = __webpack_require__(/*! ./minValue */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/minValue.js");

var _minValue2 = _interopRequireDefault(_minValue);

var _maxValue = __webpack_require__(/*! ./maxValue */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/maxValue.js");

var _maxValue2 = _interopRequireDefault(_maxValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.alpha = _alpha2.default;
exports.alphaNum = _alphaNum2.default;
exports.numeric = _numeric2.default;
exports.between = _between2.default;
exports.email = _email2.default;
exports.ipAddress = _ipAddress2.default;
exports.macAddress = _macAddress2.default;
exports.maxLength = _maxLength2.default;
exports.minLength = _minLength2.default;
exports.required = _required2.default;
exports.requiredIf = _requiredIf2.default;
exports.requiredUnless = _requiredUnless2.default;
exports.sameAs = _sameAs2.default;
exports.url = _url2.default;
exports.or = _or2.default;
exports.and = _and2.default;
exports.minValue = _minValue2.default;
exports.maxValue = _maxValue2.default;

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/ipAddress.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/ipAddress.js ***!
  \*****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = (0, _common.withParams)({ type: 'ipAddress' }, function (value) {
  if (!(0, _common.req)(value)) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  var nibbles = value.split('.');
  return nibbles.length === 4 && nibbles.every(nibbleValid);
});


var nibbleValid = function nibbleValid(nibble) {
  if (nibble.length > 3 || nibble.length === 0) {
    return false;
  }

  if (nibble[0] === '0' && nibble !== '0') {
    return false;
  }

  if (!nibble.match(/^\d+$/)) {
    return false;
  }

  var numeric = +nibble | 0;
  return numeric >= 0 && numeric <= 255;
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/macAddress.js":
/*!******************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/macAddress.js ***!
  \******************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function () {
  var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ':';
  return (0, _common.withParams)({ type: 'macAddress' }, function (value) {
    if (!(0, _common.req)(value)) {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    var parts = typeof separator === 'string' && separator !== '' ? value.split(separator) : value.length === 12 || value.length === 16 ? value.match(/.{2}/g) : null;

    return parts !== null && (parts.length === 6 || parts.length === 8) && parts.every(hexValid);
  });
};

var hexValid = function hexValid(hex) {
  return hex.toLowerCase().match(/^[0-9a-f]{2}$/);
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/maxLength.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/maxLength.js ***!
  \*****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (length) {
  return (0, _common.withParams)({ type: 'maxLength', max: length }, function (value) {
    return !(0, _common.req)(value) || (0, _common.len)(value) <= length;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/maxValue.js":
/*!****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/maxValue.js ***!
  \****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (max) {
  return (0, _common.withParams)({ type: 'maxValue', max: max }, function (value) {
    return !(0, _common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +value <= +max;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/minLength.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/minLength.js ***!
  \*****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (length) {
  return (0, _common.withParams)({ type: 'minLength', min: length }, function (value) {
    return !(0, _common.req)(value) || (0, _common.len)(value) >= length;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/minValue.js":
/*!****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/minValue.js ***!
  \****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (min) {
  return (0, _common.withParams)({ type: 'minValue', min: min }, function (value) {
    return !(0, _common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +value >= +min;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/numeric.js":
/*!***************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/numeric.js ***!
  \***************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = (0, _common.regex)('numeric', /^[0-9]*$/);

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/or.js":
/*!**********************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/or.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function () {
  for (var _len = arguments.length, validators = Array(_len), _key = 0; _key < _len; _key++) {
    validators[_key] = arguments[_key];
  }

  return (0, _common.withParams)({ type: 'or' }, function () {
    var _this = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return validators.length > 0 && validators.reduce(function (valid, fn) {
      return valid || fn.apply(_this, args);
    }, false);
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/required.js":
/*!****************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/required.js ***!
  \****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = (0, _common.withParams)({ type: 'required' }, _common.req);

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/requiredIf.js":
/*!******************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/requiredIf.js ***!
  \******************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (prop) {
  return (0, _common.withParams)({ type: 'requiredIf', prop: prop }, function (value, parentVm) {
    return (0, _common.ref)(prop, this, parentVm) ? (0, _common.req)(value) : true;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/requiredUnless.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/requiredUnless.js ***!
  \**********************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (prop) {
  return (0, _common.withParams)({ type: 'requiredUnless', prop: prop }, function (value, parentVm) {
    return !(0, _common.ref)(prop, this, parentVm) ? (0, _common.req)(value) : true;
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/sameAs.js":
/*!**************************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/sameAs.js ***!
  \**************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

exports.default = function (equalTo) {
  return (0, _common.withParams)({ type: 'sameAs', eq: equalTo }, function (value, parentVm) {
    return value === (0, _common.ref)(equalTo, this, parentVm);
  });
};

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/url.js":
/*!***********************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/url.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = __webpack_require__(/*! ./common */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/validators/common.js");

var urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;

exports.default = (0, _common.regex)('url', urlRegex);

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/vval.js":
/*!*************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/vval.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchChildren = patchChildren;
exports.h = h;
// a minimial single-layer implementation
// of virtual-validation patching,
// based on Vue's snabbdom clone

function isUndef(v) {
  return v === null || v === undefined;
}

function isDef(v) {
  return v !== null && v !== undefined;
}

function sameVval(oldVval, vval) {
  return vval.tag === oldVval.tag && vval.key === oldVval.key;
}

function createVm(vval) {
  var Vm = vval.tag;
  vval.vm = new Vm({ data: vval.args });
}

function updateVval(vval) {
  var keys = Object.keys(vval.args);
  for (var i = 0; i < keys.length; i++) {
    keys.forEach(function (k) {
      vval.vm[k] = vval.args[k];
    });
  }
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i = void 0,
      key = void 0;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

function updateChildren(oldCh, newCh) {
  var oldStartIdx = 0;
  var newStartIdx = 0;
  var oldEndIdx = oldCh.length - 1;
  var oldStartVval = oldCh[0];
  var oldEndVval = oldCh[oldEndIdx];
  var newEndIdx = newCh.length - 1;
  var newStartVval = newCh[0];
  var newEndVval = newCh[newEndIdx];
  var oldKeyToIdx = void 0,
      idxInOld = void 0,
      elmToMove = void 0;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVval)) {
      oldStartVval = oldCh[++oldStartIdx]; // Vval has been moved left
    } else if (isUndef(oldEndVval)) {
      oldEndVval = oldCh[--oldEndIdx];
    } else if (sameVval(oldStartVval, newStartVval)) {
      patchVval(oldStartVval, newStartVval);
      oldStartVval = oldCh[++oldStartIdx];
      newStartVval = newCh[++newStartIdx];
    } else if (sameVval(oldEndVval, newEndVval)) {
      patchVval(oldEndVval, newEndVval);
      oldEndVval = oldCh[--oldEndIdx];
      newEndVval = newCh[--newEndIdx];
    } else if (sameVval(oldStartVval, newEndVval)) {
      // Vval moved right
      patchVval(oldStartVval, newEndVval);
      oldStartVval = oldCh[++oldStartIdx];
      newEndVval = newCh[--newEndIdx];
    } else if (sameVval(oldEndVval, newStartVval)) {
      // Vval moved left
      patchVval(oldEndVval, newStartVval);
      oldEndVval = oldCh[--oldEndIdx];
      newStartVval = newCh[++newStartIdx];
    } else {
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      idxInOld = isDef(newStartVval.key) ? oldKeyToIdx[newStartVval.key] : null;
      if (isUndef(idxInOld)) {
        // New element
        createVm(newStartVval);
        newStartVval = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        if (sameVval(elmToMove, newStartVval)) {
          patchVval(elmToMove, newStartVval);
          oldCh[idxInOld] = undefined;
          newStartVval = newCh[++newStartIdx];
        } else {
          // same key but different element. treat as new element
          createVm(newStartVval);
          newStartVval = newCh[++newStartIdx];
        }
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    addVvals(newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    removeVvals(oldCh, oldStartIdx, oldEndIdx);
  }
}

function addVvals(vvals, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createVm(vvals[startIdx]);
  }
}

function removeVvals(vvals, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    var ch = vvals[startIdx];
    if (isDef(ch)) {
      ch.vm.$destroy();
      ch.vm = null;
    }
  }
}

function patchVval(oldVval, vval) {
  if (oldVval === vval) {
    return;
  }
  vval.vm = oldVval.vm;
  updateVval(vval);
}

function patchChildren(oldCh, ch) {
  if (isDef(oldCh) && isDef(ch)) {
    if (oldCh !== ch) updateChildren(oldCh, ch);
  } else if (isDef(ch)) {
    addVvals(ch, 0, ch.length - 1);
  } else if (isDef(oldCh)) {
    removeVvals(oldCh, 0, oldCh.length - 1);
  }
}

function h(tag, key, args) {
  return { tag: tag, key: key, args: args };
}

/***/ }),

/***/ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/withParams.js":
/*!*******************************************************************!*\
  !*** ./node_modules/_vuelidate@0.6.1@vuelidate/lib/withParams.js ***!
  \*******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* istanbul ignore next */
var withParams =  false ? require('./withParamsBrowser').withParams : __webpack_require__(/*! ./params */ "./node_modules/_vuelidate@0.6.1@vuelidate/lib/params.js").withParams;

exports.default = withParams;

/***/ }),

/***/ "./node_modules/_webpack@3.10.0@webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./web/vue/App.vue":
/*!*************************!*\
  !*** ./web/vue/App.vue ***!
  \*************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_cacheDirectory_true_presets_env_modules_false_targets_browsers_1_uglify_true_useBuiltIns_true_plugins_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(/*! !babel-loader?{"cacheDirectory":true,"presets":[["env",{"modules":false,"targets":{"browsers":"> 1%","uglify":true},"useBuiltIns":true}]],"plugins":[]}!../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=script&index=0!./App.vue */ "./node_modules/_babel-loader@7.1.2@babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":\"> 1%\",\"uglify\":true},\"useBuiltIns\":true}]],\"plugins\":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/App.vue");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_0_vue_loader_lib_template_compiler_index_id_data_v_5ea8ff9f_hasScoped_false_buble_transforms_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(/*! !../../node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index?{"id":"data-v-5ea8ff9f","hasScoped":false,"buble":{"transforms":{}}}!../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=template&index=0!./App.vue */ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-5ea8ff9f\",\"hasScoped\":false,\"buble\":{\"transforms\":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/App.vue");
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(/*! !../../node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{"omit":1,"remove":true}!vue-style-loader?sourceMap!css-loader?{"minimize":false,"sourceMap":true,"importLoaders":0}!../../node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index?{"vue":true,"id":"data-v-5ea8ff9f","scoped":false,"hasInlineConfig":false}!../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=styles&index=0!./App.vue */ "./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader/index.js?sourceMap!./node_modules/_css-loader@0.26.4@css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"importLoaders\":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5ea8ff9f\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/App.vue")
}
var normalizeComponent = __webpack_require__(/*! ../../node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer */ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer.js")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_cacheDirectory_true_presets_env_modules_false_targets_browsers_1_uglify_true_useBuiltIns_true_plugins_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_0_vue_loader_lib_template_compiler_index_id_data_v_5ea8ff9f_hasScoped_false_buble_transforms_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "web/vue/App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ea8ff9f", Component.options)
  } else {
    hotAPI.reload("data-v-5ea8ff9f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "./web/vue/assets/logo.png":
/*!*********************************!*\
  !*** ./web/vue/assets/logo.png ***!
  \*********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "/build/images/logo.49710c02.png";

/***/ }),

/***/ "./web/vue/components/HelloWorld.vue":
/*!*******************************************!*\
  !*** ./web/vue/components/HelloWorld.vue ***!
  \*******************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_cacheDirectory_true_presets_env_modules_false_targets_browsers_1_uglify_true_useBuiltIns_true_plugins_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_script_index_0_HelloWorld_vue__ = __webpack_require__(/*! !babel-loader?{"cacheDirectory":true,"presets":[["env",{"modules":false,"targets":{"browsers":"> 1%","uglify":true},"useBuiltIns":true}]],"plugins":[]}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=script&index=0!./HelloWorld.vue */ "./node_modules/_babel-loader@7.1.2@babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":\"> 1%\",\"uglify\":true},\"useBuiltIns\":true}]],\"plugins\":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/components/HelloWorld.vue");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_0_vue_loader_lib_template_compiler_index_id_data_v_5aa8a2b7_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_template_index_0_HelloWorld_vue__ = __webpack_require__(/*! !../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index?{"id":"data-v-5aa8a2b7","hasScoped":true,"buble":{"transforms":{}}}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=template&index=0!./HelloWorld.vue */ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-5aa8a2b7\",\"hasScoped\":true,\"buble\":{\"transforms\":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/components/HelloWorld.vue");
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(/*! !../../../node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{"omit":1,"remove":true}!vue-style-loader?sourceMap!css-loader?{"minimize":false,"sourceMap":true,"importLoaders":0}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index?{"vue":true,"id":"data-v-5aa8a2b7","scoped":true,"hasInlineConfig":false}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=styles&index=0!./HelloWorld.vue */ "./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader/index.js?sourceMap!./node_modules/_css-loader@0.26.4@css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"importLoaders\":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5aa8a2b7\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/components/HelloWorld.vue")
}
var normalizeComponent = __webpack_require__(/*! ../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer */ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer.js")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5aa8a2b7"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_cacheDirectory_true_presets_env_modules_false_targets_browsers_1_uglify_true_useBuiltIns_true_plugins_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_script_index_0_HelloWorld_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_0_vue_loader_lib_template_compiler_index_id_data_v_5aa8a2b7_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_template_index_0_HelloWorld_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "web/vue/components/HelloWorld.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5aa8a2b7", Component.options)
  } else {
    hotAPI.reload("data-v-5aa8a2b7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "./web/vue/components/Login.vue":
/*!**************************************!*\
  !*** ./web/vue/components/Login.vue ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_cacheDirectory_true_presets_env_modules_false_targets_browsers_1_uglify_true_useBuiltIns_true_plugins_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_script_index_0_Login_vue__ = __webpack_require__(/*! !babel-loader?{"cacheDirectory":true,"presets":[["env",{"modules":false,"targets":{"browsers":"> 1%","uglify":true},"useBuiltIns":true}]],"plugins":[]}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=script&index=0!./Login.vue */ "./node_modules/_babel-loader@7.1.2@babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":\"> 1%\",\"uglify\":true},\"useBuiltIns\":true}]],\"plugins\":[]}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=script&index=0!./web/vue/components/Login.vue");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_0_vue_loader_lib_template_compiler_index_id_data_v_fe76003c_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_template_index_0_Login_vue__ = __webpack_require__(/*! !../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index?{"id":"data-v-fe76003c","hasScoped":true,"buble":{"transforms":{}}}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=template&index=0!./Login.vue */ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-fe76003c\",\"hasScoped\":true,\"buble\":{\"transforms\":{}}}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=template&index=0!./web/vue/components/Login.vue");
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(/*! !../../../node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{"omit":1,"remove":true}!vue-style-loader?sourceMap!css-loader?{"minimize":false,"sourceMap":true,"importLoaders":0}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index?{"vue":true,"id":"data-v-fe76003c","scoped":true,"hasInlineConfig":false}!resolve-url-loader?{"sourceMap":true}!sass-loader?{"sourceMap":true}!../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/selector?type=styles&index=0!./Login.vue */ "./node_modules/_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin/dist/loader.js?{\"omit\":1,\"remove\":true}!./node_modules/_vue-style-loader@3.1.0@vue-style-loader/index.js?sourceMap!./node_modules/_css-loader@0.26.4@css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"importLoaders\":0}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fe76003c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/_resolve-url-loader@2.2.1@resolve-url-loader/index.js?{\"sourceMap\":true}!./node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js?{\"sourceMap\":true}!./node_modules/_vue-loader@13.7.0@vue-loader/lib/selector.js?type=styles&index=0!./web/vue/components/Login.vue")
}
var normalizeComponent = __webpack_require__(/*! ../../../node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer */ "./node_modules/_vue-loader@13.7.0@vue-loader/lib/component-normalizer.js")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-fe76003c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_cacheDirectory_true_presets_env_modules_false_targets_browsers_1_uglify_true_useBuiltIns_true_plugins_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_script_index_0_Login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_0_vue_loader_lib_template_compiler_index_id_data_v_fe76003c_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_0_vue_loader_lib_selector_type_template_index_0_Login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "web/vue/components/Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fe76003c", Component.options)
  } else {
    hotAPI.reload("data-v-fe76003c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "./web/vue/main.js":
/*!*************************!*\
  !*** ./web/vue/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(/*! vue */ "./node_modules/_vue@2.5.13@vue/dist/vue.esm.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App__ = __webpack_require__(/*! ./App */ "./web/vue/App.vue");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__(/*! ./router */ "./web/vue/router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_material__ = __webpack_require__(/*! vue-material */ "./node_modules/_vue-material@0.8.1@vue-material/dist/vue-material.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_material___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_material__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_axios__ = __webpack_require__(/*! axios */ "./node_modules/_axios@0.17.1@axios/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vue_axios__ = __webpack_require__(/*! vue-axios */ "./node_modules/_vue-axios@2.0.2@vue-axios/dist/vue-axios.min.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vue_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_vue_axios__);
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.






__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_5_vue_axios___default.a, __WEBPACK_IMPORTED_MODULE_4_axios___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_3_vue_material___default.a);

__WEBPACK_IMPORTED_MODULE_0_vue__["default"].config.productionTip = false;

/* eslint-disable no-new */
new __WEBPACK_IMPORTED_MODULE_0_vue__["default"]({
  el: '#app',
  router: __WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */],
  components: { App: __WEBPACK_IMPORTED_MODULE_1__App__["a" /* default */] },
  template: '<App/>'
});

/***/ }),

/***/ "./web/vue/router/index.js":
/*!*********************************!*\
  !*** ./web/vue/router/index.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(/*! vue */ "./node_modules/_vue@2.5.13@vue/dist/vue.esm.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(/*! vue-router */ "./node_modules/_vue-router@3.0.1@vue-router/dist/vue-router.esm.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_HelloWorld__ = __webpack_require__(/*! ../components/HelloWorld */ "./web/vue/components/HelloWorld.vue");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Login__ = __webpack_require__(/*! ../components/Login */ "./web/vue/components/Login.vue");





__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
  routes: [{
    path: '/user/login',
    name: 'login',
    component: __WEBPACK_IMPORTED_MODULE_3__components_Login__["a" /* default */]
  }, {
    path: '/',
    name: 'HelloWorld',
    component: __WEBPACK_IMPORTED_MODULE_2__components_HelloWorld__["a" /* default */]
  }]
}));

/***/ })

/******/ });