# eth-token-balance

npm library to read all token balances of an ethereum address

### Install

```
npm install @myetherwallet/eth-token-balance
```

### Example to read all token balances

```
import TokenBalance from "@myetherwallet/eth-token-balance";
const tb = new TokenBalance(web3.currentProvider);
tb.getBalance("0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D").then(balances => {
  console.log(balances);
});

```

### Output

```
[ { symbol: '$TEAK',
    addr: '0x7dd7f56d697cc0f2b52bd55c057f378f1fe6ab4b',
    decimals: 18,
    balance: '0',
    name: '$TEAK',
    website: 'https://steak.network',
    email: 'support@steak.network' },
  { symbol: 'DIVX',
    addr: '0x13f11c9905a08ca76e3e853be63d4f0944326c72',
    decimals: 18,
    balance: '0',
    name: 'DIVX',
    website: 'https://www.diviproject.org',
    email: 'support@diviproject.org' }, ...
```
