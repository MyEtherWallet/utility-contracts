"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sizeHex = function sizeHex(bytes) {
  return bytes * 2;
};

var _default = function _default(hex) {
  hex = hex.substring(0, 2) == "0x" ? hex.substring(2) : hex;
  hex = hex.substring(0, hex.lastIndexOf("1") - 1); //starting point

  var offset = hex.length;
  offset -= sizeHex(32);
  var numValues = new _bignumber["default"]("0x" + hex.substr(offset, sizeHex(32))).toNumber();
  var values = [];

  for (var i = 0; i < numValues; i++) {
    offset -= sizeHex(1);
    var numBytes = new _bignumber["default"]("0x" + hex.substr(offset, sizeHex(1))).toNumber();
    offset -= sizeHex(numBytes);
    values.push(new _bignumber["default"]("0x" + hex.substr(offset, sizeHex(numBytes))));
  }

  return values;
};

exports["default"] = _default;