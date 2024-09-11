import {
  require_react
} from "./chunk-JCH2SJW3.js";
import {
  __commonJS
} from "./chunk-BUSYA2B4.js";

// node_modules/react-speech-kit/dist/useSpeechRecognition.js
var require_useSpeechRecognition = __commonJS({
  "node_modules/react-speech-kit/dist/useSpeechRecognition.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _slicedToArray = /* @__PURE__ */ function() {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      return function(arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();
    var _react = require_react();
    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }
    var useEventCallback = function useEventCallback2(fn, dependencies) {
      var ref = (0, _react.useRef)(function() {
        throw new Error("Cannot call an event handler while rendering.");
      });
      (0, _react.useEffect)(function() {
        ref.current = fn;
      }, [fn].concat(_toConsumableArray(dependencies)));
      return (0, _react.useCallback)(function(args) {
        var fn2 = ref.current;
        return fn2(args);
      }, [ref]);
    };
    var useSpeechRecognition = function useSpeechRecognition2() {
      var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var _props$onEnd = props.onEnd, onEnd = _props$onEnd === void 0 ? function() {
      } : _props$onEnd, _props$onResult = props.onResult, onResult = _props$onResult === void 0 ? function() {
      } : _props$onResult, _props$onError = props.onError, onError = _props$onError === void 0 ? function() {
      } : _props$onError;
      var recognition = (0, _react.useRef)(null);
      var _useState = (0, _react.useState)(false), _useState2 = _slicedToArray(_useState, 2), listening = _useState2[0], setListening = _useState2[1];
      var _useState3 = (0, _react.useState)(false), _useState4 = _slicedToArray(_useState3, 2), supported = _useState4[0], setSupported = _useState4[1];
      var processResult = function processResult2(event) {
        var transcript = Array.from(event.results).map(function(result) {
          return result[0];
        }).map(function(result) {
          return result.transcript;
        }).join("");
        onResult(transcript);
      };
      var handleError = function handleError2(event) {
        if (event.error === "not-allowed") {
          recognition.current.onend = function() {
          };
          setListening(false);
        }
        onError(event);
      };
      var listen = useEventCallback(function() {
        var args = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (listening || !supported) return;
        var _args$lang = args.lang, lang = _args$lang === void 0 ? "" : _args$lang, _args$interimResults = args.interimResults, interimResults = _args$interimResults === void 0 ? true : _args$interimResults, _args$continuous = args.continuous, continuous = _args$continuous === void 0 ? false : _args$continuous, _args$maxAlternatives = args.maxAlternatives, maxAlternatives = _args$maxAlternatives === void 0 ? 1 : _args$maxAlternatives, grammars = args.grammars;
        setListening(true);
        recognition.current.lang = lang;
        recognition.current.interimResults = interimResults;
        recognition.current.onresult = processResult;
        recognition.current.onerror = handleError;
        recognition.current.continuous = continuous;
        recognition.current.maxAlternatives = maxAlternatives;
        if (grammars) {
          recognition.current.grammars = grammars;
        }
        recognition.current.onend = function() {
          return recognition.current.start();
        };
        recognition.current.start();
      }, [listening, supported, recognition]);
      var stop = useEventCallback(function() {
        if (!listening || !supported) return;
        recognition.current.onresult = function() {
        };
        recognition.current.onend = function() {
        };
        recognition.current.onerror = function() {
        };
        setListening(false);
        recognition.current.stop();
        onEnd();
      }, [listening, supported, recognition, onEnd]);
      (0, _react.useEffect)(function() {
        if (typeof window === "undefined") return;
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (window.SpeechRecognition) {
          setSupported(true);
          recognition.current = new window.SpeechRecognition();
        }
      }, []);
      return {
        listen,
        listening,
        stop,
        supported
      };
    };
    exports.default = useSpeechRecognition;
  }
});

// node_modules/react-speech-kit/dist/useSpeechSynthesis.js
var require_useSpeechSynthesis = __commonJS({
  "node_modules/react-speech-kit/dist/useSpeechSynthesis.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _slicedToArray = /* @__PURE__ */ function() {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      return function(arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();
    var _react = require_react();
    var useSpeechSynthesis = function useSpeechSynthesis2() {
      var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var _props$onEnd = props.onEnd, onEnd = _props$onEnd === void 0 ? function() {
      } : _props$onEnd;
      var _useState = (0, _react.useState)([]), _useState2 = _slicedToArray(_useState, 2), voices = _useState2[0], setVoices = _useState2[1];
      var _useState3 = (0, _react.useState)(false), _useState4 = _slicedToArray(_useState3, 2), speaking = _useState4[0], setSpeaking = _useState4[1];
      var _useState5 = (0, _react.useState)(false), _useState6 = _slicedToArray(_useState5, 2), supported = _useState6[0], setSupported = _useState6[1];
      var processVoices = function processVoices2(voiceOptions) {
        setVoices(voiceOptions);
      };
      var getVoices = function getVoices2() {
        var voiceOptions = window.speechSynthesis.getVoices();
        if (voiceOptions.length > 0) {
          processVoices(voiceOptions);
          return;
        }
        window.speechSynthesis.onvoiceschanged = function(event) {
          voiceOptions = event.target.getVoices();
          processVoices(voiceOptions);
        };
      };
      var handleEnd = function handleEnd2() {
        setSpeaking(false);
        onEnd();
      };
      (0, _react.useEffect)(function() {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          setSupported(true);
          getVoices();
        }
      }, []);
      var speak = function speak2() {
        var args = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var _args$voice = args.voice, voice = _args$voice === void 0 ? null : _args$voice, _args$text = args.text, text = _args$text === void 0 ? "" : _args$text, _args$rate = args.rate, rate = _args$rate === void 0 ? 1 : _args$rate, _args$pitch = args.pitch, pitch = _args$pitch === void 0 ? 1 : _args$pitch, _args$volume = args.volume, volume = _args$volume === void 0 ? 1 : _args$volume;
        if (!supported) return;
        setSpeaking(true);
        var utterance = new window.SpeechSynthesisUtterance();
        utterance.text = text;
        utterance.voice = voice;
        utterance.onend = handleEnd;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;
        window.speechSynthesis.speak(utterance);
      };
      var cancel = function cancel2() {
        if (!supported) return;
        setSpeaking(false);
        window.speechSynthesis.cancel();
      };
      return {
        supported,
        speak,
        speaking,
        cancel,
        voices
      };
    };
    exports.default = useSpeechSynthesis;
  }
});

// node_modules/react-speech-kit/dist/index.js
var require_dist = __commonJS({
  "node_modules/react-speech-kit/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _useSpeechRecognition = require_useSpeechRecognition();
    Object.defineProperty(exports, "useSpeechRecognition", {
      enumerable: true,
      get: function get() {
        return _interopRequireDefault(_useSpeechRecognition).default;
      }
    });
    var _useSpeechSynthesis = require_useSpeechSynthesis();
    Object.defineProperty(exports, "useSpeechSynthesis", {
      enumerable: true,
      get: function get() {
        return _interopRequireDefault(_useSpeechSynthesis).default;
      }
    });
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});
export default require_dist();
//# sourceMappingURL=react-speech-kit.js.map
