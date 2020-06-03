"use strict";

var _index = _interopRequireDefault(require("./index"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var web3 = new _web["default"]("https://ethrpc.mewapi.io");
var tb = new _index["default"](web3.currentProvider);
tb.getBalance("0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D").then(function (balances) {
  balances.forEach(function (element) {
    if (element.symbol === "REP") console.log(element);
  });
});