"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let sizeHex = bytes => {
  return bytes * 2;
};

var _default = hex => {
  hex = hex.substring(0, 2) == "0x" ? hex.substring(2) : hex;
  hex = hex.substring(0, hex.lastIndexOf("1") - 1); //starting point

  let offset = hex.length;
  offset -= sizeHex(32);
  const numValues = new _bignumber.default("0x" + hex.substr(offset, sizeHex(32))).toNumber();
  const values = [];

  for (let i = 0; i < numValues; i++) {
    offset -= sizeHex(1);
    const numBytes = new _bignumber.default("0x" + hex.substr(offset, sizeHex(1))).toNumber();
    offset -= sizeHex(numBytes);
    values.push(new _bignumber.default("0x" + hex.substr(offset, sizeHex(numBytes))));
  }

  return values;
};

exports.default = _default;