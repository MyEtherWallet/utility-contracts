"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sizeHex = function sizeHex(bytes) {
  return bytes * 2;
};

function trim(str) {
  return str.replace(/\0[\s\S]*$/g, "");
}

function getAscii(hex) {
  hex = hex.substring(0, 2) == "0x" ? hex : "0x" + hex;
  return trim(_web["default"].utils.toAscii(hex));
}

var _default = function _default(hex) {
  var tokens = [];
  hex = hex.substring(0, 2) == "0x" ? hex.substring(2) : hex;
  hex = hex.substring(0, hex.lastIndexOf("1") - 1); //starting point

  var offset = hex.length;
  offset -= sizeHex(32);
  var countTokens = hex.substr(offset, sizeHex(32));
  offset -= sizeHex(1);
  var isName = parseInt(hex.substr(offset, sizeHex(1)));
  offset -= sizeHex(1);
  var isWebSite = parseInt(hex.substr(offset, sizeHex(1)));
  offset -= sizeHex(1);
  var isEmail = parseInt(hex.substr(offset, sizeHex(1)));
  var numTokens = new _bignumber["default"]("0x" + countTokens).toNumber();

  for (var i = 0; i < numTokens; i++) {
    var token = {};
    offset -= sizeHex(16);
    token.symbol = getAscii(hex.substr(offset, sizeHex(16)));
    offset -= sizeHex(20);
    token.addr = "0x" + hex.substr(offset, sizeHex(20));
    offset -= sizeHex(1);
    token.decimals = new _bignumber["default"]("0x" + hex.substr(offset, sizeHex(1))).toNumber();
    offset -= sizeHex(32);
    token.balance = new _bignumber["default"]("0x" + hex.substr(offset, sizeHex(32))).toFixed();

    if (isName) {
      offset -= sizeHex(16);
      token.name = getAscii(hex.substr(offset, sizeHex(16)));
    }

    if (isWebSite) {
      offset -= sizeHex(32);
      token.website = getAscii(hex.substr(offset, sizeHex(32)));
    }

    if (isEmail) {
      offset -= sizeHex(32);
      token.email = getAscii(hex.substr(offset, sizeHex(32)));
    }

    tokens.push(token);
  }

  return tokens;
};

exports["default"] = _default;