"use strict";

var _binaryDecoderNFT = _interopRequireDefault(require("./binaryDecoderNFT"));

var _abiNFT = _interopRequireDefault(require("./abiNFT"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var web3 = new _web["default"]("https://api.myetherwallet.com/eth");
var tokenContract = new web3.eth.Contract(_abiNFT["default"]);
tokenContract.options.address = "0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14";
tokenContract.methods.getOwnedTokens("0x8bc67d00253fd60b1afcce88b78820413139f4c6", "0x669cb6e8e464fd445df692db25d69c37e3f2621f", 0, 1000).call().then(function (res) {
  console.log(res, (0, _binaryDecoderNFT["default"])(res).length);
  console.log((0, _binaryDecoderNFT["default"])(res).map(function (val) {
    return val.toNumber();
  }));
});
tokenContract.methods.getTokenBalances(["0x8bc67d00253fd60b1afcce88b78820413139f4c6", "0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab", "0x8bc67d00253fd60b1afcce88b78820413139f4c6"], "0x669cb6e8e464fd445df692db25d69c37e3f2621f").call().then(function (res) {
  console.log(res, (0, _binaryDecoderNFT["default"])(res).length);
  console.log((0, _binaryDecoderNFT["default"])(res).map(function (val) {
    return val.toNumber();
  }));
});