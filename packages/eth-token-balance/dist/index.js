"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _binaryDecoder = _interopRequireDefault(require("./binaryDecoder"));

var _abi = _interopRequireDefault(require("./abi"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contractAddress = {
  // Mainnet
  "1": "0xdAFf2b3BdC710EB33A847CCb30A24789c0Ef9c5b",
  "3": "0xB8E1Bbc50FD87Ea00D8ce73747Ac6F516aF26dAC"
};

class TokenBalance {
  constructor(ethProvider) {
    if (ethProvider.currentProvider) {
      ethProvider = ethProvider.currentProvider;
    }

    this.web3 = new _web.default(ethProvider);
    this.tokenContract = new this.web3.eth.Contract(_abi.default);
    this.tokenPromise = new Promise((resolve, reject) => {
      this.web3.eth.net.getId().then(version => {
        if (!contractAddress[version]) {
          return reject(new Error("Network not supported"));
        }

        this.tokenContract.options.address = contractAddress[version];
        resolve();
      });
    });
  }

  getBalance(address) {
    let name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let website = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let email = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    let count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    return new Promise((resolve, reject) => {
      this.tokenPromise.then(() => {
        this.tokenContract.methods.getAllBalance(address, name, website, email, count).call().then(res => {
          resolve((0, _binaryDecoder.default)(res));
        }).catch(reject);
        ;
      }).catch(reject);
    });
  }

}

var _default = TokenBalance;
exports.default = _default;