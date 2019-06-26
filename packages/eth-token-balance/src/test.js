import TokenBalance from "./index";
import Web3 from "web3";
const web3 = new Web3("wss://ws-eth.mewapi.io");
const tb = new TokenBalance(web3.currentProvider);
tb.getBalance("0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D").then(balances => {
  balances.forEach(element => {
    if (element.symbol === "REP") console.log(element);
  });
});
