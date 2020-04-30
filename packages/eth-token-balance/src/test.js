import TokenBalance from "./index";
import Web3 from "web3";
const web3 = new Web3("https://nodes.mewapi.io/rpc/eth");
const tb = new TokenBalance(web3.currentProvider);
tb.getBalance(
  "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
  false,
  true,
  true
).then((balances) => {
  console.log(balances.length);
  balances.forEach((element) => {
    console.log(element);
  });
});
