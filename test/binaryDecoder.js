const bn = require("bignumber.js");
const Web3 = require("web3");
var sizeHex = (bytes) => {
  return bytes * 2;
};

function trim(str) {
  return str.replace(/\0[\s\S]*$/g, "");
}

function getAscii(hex) {
  hex = hex.substring(0, 2) == "0x" ? hex : "0x" + hex;
  return trim(Web3.utils.toAscii(hex));
}
module.exports = (hex) => {
  var tokens = [];
  hex = hex.substring(0, 2) == "0x" ? hex.substring(2) : hex;
  var offset = 0;
  var countTokens = hex.substr(offset, sizeHex(32));
  offset += sizeHex(32);
  var isName = parseInt(hex.substr(offset, sizeHex(1)));
  offset += sizeHex(1);
  var isWebSite = parseInt(hex.substr(offset, sizeHex(1)));
  offset += sizeHex(1);
  var isEmail = parseInt(hex.substr(offset, sizeHex(1)));
  offset += sizeHex(1);
  var numTokens = new bn("0x" + countTokens).toNumber();
  for (var i = 0; i < numTokens; i++) {
    var token = {};
    token.symbol = getAscii(hex.substr(offset, sizeHex(16)));
    offset += sizeHex(16);
    token.addr = "0x" + hex.substr(offset, sizeHex(20));
    offset += sizeHex(20);
    token.decimals = new bn("0x" + hex.substr(offset, sizeHex(1))).toNumber();
    offset += sizeHex(1);
    token.balance = new bn("0x" + hex.substr(offset, sizeHex(32))).toFixed();
    offset += sizeHex(32);
    if (isName) {
      token.name = getAscii(hex.substr(offset, sizeHex(16)));
      offset += sizeHex(16);
    }
    if (isWebSite) {
      token.website = getAscii(hex.substr(offset, sizeHex(32)));
      offset += sizeHex(32);
    }
    if (isEmail) {
      token.email = getAscii(hex.substr(offset, sizeHex(32)));
      offset += sizeHex(32);
    }
    tokens.push(token);
  }
  console.log(tokens);
  return tokens;
};
