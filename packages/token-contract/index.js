require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const fetch = require("node-fetch");
const BigNumber = require("bignumber.js");
const abi = require("./contractABI.js");
const ethUtil = require("ethereumjs-util");
const ethTx = require("ethereumjs-tx");
const privateKey = Buffer.from(process.env.PRIV, "hex");
let web3 = new Web3(process.env.RPC);
var sizeHex = (bytes) => {
  return bytes * 2;
};

function trim(str) {
  return str.replace(/\0[\s\S]*$/g, "");
}

function getAscii(hex) {
  hex = hex.substring(0, 2) == "0x" ? hex : "0x" + hex;
  return trim(web3.utils.toAscii(hex));
}

// const TokenBalance = require("@myetherwallet/eth-token-balance").default;
// const tb = new TokenBalance(web3.currentProvider);


function sortAlphabetically(a, b) {
  const first = a.symbol.toUpperCase();
  const second = b.symbol.toUpperCase();
  return first < second ? -1 : first > second ? 1 : 0;
}

async function getMEWTokens() {
  const response = await fetch(process.env.TOKEN_LIST_SRC);
  const mewTokens = await response.json();
  return mewTokens;
}

async function getContractTokens(addr) {
  const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
  const token = await contract.methods.getToken(addr).call();
  const name = getAscii(token['0'])
  const symbol = getAscii(token['1'])
  const address = token['2']
  const decimals = new BigNumber(token['3']).toNumber();
  const website = getAscii(token['4'])
  const email = getAscii(token['5'])
  const actualToken = {
    name: name,
    symbol: symbol,
    addr: address,
    decimals: decimals,
    website: website,
    email: email
  }
  return actualToken;
}

async function differenceTokenList(arr) {
  fs.writeFileSync("./notInContractTokens.json", JSON.stringify(arr));
  // console.log(arr.length);
  if (arr.length > 0) {
    const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
    const FROM =
      "0x" + ethUtil.privateToAddress("0x" + process.env.PRIV).toString("hex");
    for (let i = 150; i < 300; i++) {
      let txCount = await web3.eth.getTransactionCount(FROM);
      let name =
        arr[i].name.length > 7
          ? web3.utils.utf8ToHex(arr[i].symbol)
          : web3.utils.utf8ToHex(arr[i].name);
      let symbol = web3.utils.utf8ToHex(arr[i].symbol);
      let address = web3.utils.toChecksumAddress(arr[i].address.toLowerCase());
      let decimal = arr[i].decimals;
      let website =
        web3.utils.asciiToHex(arr[i].website, 32).length > 64
          ? "0x"
          : web3.utils.asciiToHex(arr[i].website, 32);
      let email =
        web3.utils.asciiToHex(arr[i].support.email, 32).length > 64
          ? "0x"
          : web3.utils.asciiToHex(arr[i].email, 32);
      let dataStr = contract.methods
        .addSetToken(name, symbol, address, decimal, website, email)
        .encodeABI();
      // console.log(name, symbol, address, decimal, website, email)
      const params = {
        nonce: web3.utils.toHex(txCount + i),
        gasPrice: web3.utils.toHex(process.env.GAS_PRICE),
        gasLimit: web3.utils.toHex(process.env.GAS),
        to: web3.utils.toHex(process.env.CONTRACT_ADDRESS),
        value: 0x0,
        data: dataStr,
        chainId: 1,
      };

      const tx = new ethTx(params);
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      const actualTransactionParams = "0x" + serializedTx.toString("hex");
      web3.eth
        .sendSignedTransaction(actualTransactionParams)
        .on("transactionHash", (hash) => {
          console.log(`Added token ${arr[i].symbol} ${hash}"`);
        })
        .on("error", (e) => {
          console.log(e);
        });
    }
  }
}

async function run() {
  const mewTokens = await getMEWTokens();
  const diffTokens = [];
  for(let i = 0; i < mewTokens.length; i++) {
    const foundToken = await getContractTokens(mewTokens[i].address);
    const matchingEmail = foundToken.email === mewTokens[i].support.email;
    const matchingWebsite = foundToken.website === mewTokens[i].website;
    const matchingName = foundToken.name === mewTokens[i].name;
    const matchingSymbol = foundToken.symbol === mewTokens[i].symbol;
    const matchingDecimal = foundToken.decimals === mewTokens[i].decimals;
    const matchingAddress = web3.utils.toChecksumAddress(foundToken.addr) === web3.utils.toChecksumAddress(mewTokens[i].address);
    if(foundToken.addr === '0x0000000000000000000000000000000000000000' && foundToken.name === '' && foundToken.decimals === 0 && foundToken.symbol === '') {
      // treat token as new
      diffTokens.push(mewTokens[i]);
    } else if(!matchingEmail || !matchingWebsite || !matchingName || !matchingSymbol || !matchingDecimal) {
      // checks for updates
      mewTokens[i].support.email = matchingEmail ? mewTokens[i].support.email : foundToken.email;
      mewTokens[i].website = matchingWebsite ? mewTokens[i].website : foundToken.website;
      mewTokens[i].name = matchingName ? mewTokens[i].name : foundToken.name;
      mewTokens[i].symbol = matchingSymbol ? mewTokens[i].symbol : foundToken.symbol;
      mewTokens[i].decimals = matchingDecimal ? mewTokens[i].decimals : foundToken.decimals;
      mewTokens[i].address = matchingAddress ? mewTokens[i].address : foundToken.addr;
      diffTokens.push(mewTokens[i]);
    }
  }
  
  diffTokens.sort(sortAlphabetically);
  differenceTokenList(diffTokens);
  // fs.writeFileSync("./contractTokens.json", JSON.stringify(contractTokens));
  // fs.writeFileSync("./mewTokens.json", JSON.stringify(mewTokens));
}

run();
