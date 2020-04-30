import decode from "./binaryDecoder";
import abi from "./abi";
import Web3 from "web3";
var contractAddress = {
  // Mainnet
  "1": "0x73bedb6dd7fd3edd9928f55f6acc20877f2551eb",
  "3": "0x936717fb92984c63f22AdB3E31d494b5471AeDc8",
};

class TokenBalance {
  constructor(ethProvider) {
    if (ethProvider.currentProvider) {
      ethProvider = ethProvider.currentProvider;
    }
    this.web3 = new Web3(ethProvider);
    this.tokenContract = new this.web3.eth.Contract(abi);
    this.tokenPromise = new Promise((resolve, reject) => {
      this.web3.eth.net.getId().then((version) => {
        if (!contractAddress[version]) {
          return reject(new Error("Network not supported"));
        }
        this.tokenContract.options.address = contractAddress[version];
        resolve();
      });
    });
  }
  getBalance(
    address,
    name = true,
    website = true,
    email = true,
    extraParams = {}
  ) {
    return new Promise((resolve, reject) => {
      this.tokenPromise
        .then(() => {
          this.tokenContract.methods
            .getAllBalance(address, name, website, email)
            .call(extraParams)
            .then((res) => {
              resolve(decode(res));
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }
}
export default TokenBalance;
