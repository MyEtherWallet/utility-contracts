"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _binaryDecoder = _interopRequireDefault(require("./binaryDecoder"));

var _abi = _interopRequireDefault(require("./abi"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var contractAddress = {
  // Mainnet
  "1": "0x2783c0A4Bfd3721961653a9e9939Fc63687bf07f",
  "3": "0xB8E1Bbc50FD87Ea00D8ce73747Ac6F516aF26dAC"
};

var TokenBalance =
/*#__PURE__*/
function () {
  function TokenBalance(ethProvider) {
    var _this = this;

    _classCallCheck(this, TokenBalance);

    if (ethProvider.currentProvider) {
      ethProvider = ethProvider.currentProvider;
    }

    this.web3 = new _web["default"](ethProvider);
    this.tokenContract = new this.web3.eth.Contract(_abi["default"]);
    this.tokenPromise = new Promise(function (resolve, reject) {
      _this.web3.eth.net.getId().then(function (version) {
        if (!contractAddress[version]) {
          return reject(new Error("Network not supported"));
        }

        _this.tokenContract.options.address = contractAddress[version];
        resolve();
      });
    });
  }

  _createClass(TokenBalance, [{
    key: "getBalance",
    value: function getBalance(address) {
      var _this2 = this;

      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var website = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var email = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var extraParams = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      return new Promise(function (resolve, reject) {
        _this2.tokenPromise.then(function () {
          _this2.tokenContract.methods.getAllBalance(address, name, website, email, count).call(extraParams).then(function (res) {
            resolve((0, _binaryDecoder["default"])(res));
          })["catch"](reject);
        })["catch"](reject);
      });
    }
  }]);

  return TokenBalance;
}();

var _default = TokenBalance;
exports["default"] = _default;