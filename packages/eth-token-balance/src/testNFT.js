import hexDecoder from "./binaryDecoderNFT";
import nftABI from "./abiNFT";
import Web3 from "web3";
const web3 = new Web3("https://api.myetherwallet.com/eth");
const tokenContract = new web3.eth.Contract(nftABI);
tokenContract.options.address = "0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14";
tokenContract.methods
  .getOwnedTokens(
    "0x8bc67d00253fd60b1afcce88b78820413139f4c6",
    "0x669cb6e8e464fd445df692db25d69c37e3f2621f",
    0,
    1000
  )
  .call()
  .then(res => {
    console.log(res, hexDecoder(res).length);
    console.log(
      hexDecoder(res).map(val => {
        return val.toNumber();
      })
    );
  });

tokenContract.methods
  .getTokenBalances(
    [
      "0x8bc67d00253fd60b1afcce88b78820413139f4c6",
      "0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab",
      "0x8bc67d00253fd60b1afcce88b78820413139f4c6"
    ],
    "0x669cb6e8e464fd445df692db25d69c37e3f2621f"
  )
  .call()
  .then(res => {
    console.log(res, hexDecoder(res).length);
    console.log(
      hexDecoder(res).map(val => {
        return val.toNumber();
      })
    );
  });
