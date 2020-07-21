require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const fetch = require("node-fetch");
// const BigNumber = require("bignumber.js");
const abi = require("./contractABI.js");
const ethUtil = require("ethereumjs-util");
const ethTx = require("ethereumjs-tx");
const privateKey = Buffer.from(process.env.PRIV, 'hex');
let web3 = new Web3(process.env.RPC);
const TokenBalance = require('@myetherwallet/eth-token-balance').default;
const tb = new TokenBalance(web3.currentProvider);


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

async function getContractTokens() {
	const tokens = await tb.getBalance(process.env.ACCOUNT_CONTRACT_ADDR);
	return tokens;
}

async function differenceTokenList(arr) {;
  fs.writeFileSync("./notInContractTokens.json", JSON.stringify(arr));
  // console.log(arr.length)
	if(arr.length > 0) {
		const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
		const FROM = "0x" + ethUtil.privateToAddress("0x"+process.env.PRIV).toString("hex");
		for (let i = 20; i < 50; i++) {
			let txCount = await web3.eth.getTransactionCount(FROM);
			let name = arr[i].name.length > 7 ? web3.utils.utf8ToHex(arr[i].symbol) : web3.utils.utf8ToHex(arr[i].name);
			let symbol = web3.utils.utf8ToHex(arr[i].symbol);
			let address = web3.utils.toChecksumAddress(arr[i].address.toLowerCase());
			let decimal = arr[i].decimals;
			let website = web3.utils.asciiToHex(arr[i].website, 32).length > 64 ? '0x': web3.utils.asciiToHex(arr[i].website, 32);
			let email = web3.utils.asciiToHex(arr[i].support.email, 32).length > 64 ? '0x': web3.utils.asciiToHex(arr[i].email, 32);
			let dataStr = contract.methods.addSetToken(name, symbol, address, decimal, website, email).encodeABI();
			// console.log(name, symbol, address, decimal, website, email)
			const params = {
				nonce: web3.utils.toHex(txCount + i),
				gasPrice: web3.utils.toHex(process.env.GAS_PRICE),
				gasLimit: web3.utils.toHex(process.env.GAS),
				to: web3.utils.toHex(process.env.CONTRACT_ADDRESS),
				value: 0x0,
				data: dataStr,
				chainId: 1
			}

			const tx = new ethTx(params);
			tx.sign(privateKey);
			const serializedTx = tx.serialize();
			const actualTransactionParams = '0x' + serializedTx.toString('hex');
			web3.eth.sendSignedTransaction(actualTransactionParams).on('transactionHash', (hash) => {
				console.log(`Added token ${arr[i].symbol} ${hash}"`);
			}).on('error', e => {
				console.log(e);
			});
		}
	}
}

async function run() {
	const mewTokens = await getMEWTokens(),
				contractTokens = await getContractTokens(),
				excludedTokens = ['PCLOLD2', 'KICK', 'CARD', 'BWX'];
	let diffTokens = [];
	mewTokens.forEach((mewTokes, idx) => {
		if (excludedTokens.indexOf(mewTokes.symbol) >= 0) {
			mewTokens.splice(idx, 1);
			return;
		}

		const foundToken = contractTokens.find(conTokes => {
			return web3.utils.toChecksumAddress(conTokes.addr.toLowerCase()) === web3.utils.toChecksumAddress(mewTokes.address.toLowerCase())
		});

		if (foundToken === undefined) {
			diffTokens.push(mewTokes);
		}
	})

	diffTokens.sort(sortAlphabetically);
	differenceTokenList(diffTokens);
	fs.writeFileSync("./contractTokens.json", JSON.stringify(contractTokens));
	fs.writeFileSync("./mewTokens.json", JSON.stringify(mewTokens));
}

run();
