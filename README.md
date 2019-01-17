# utility-contracts

smart contracts which can be used as utility contracts to interact with the blockchain

### Mainnet deployment

> PublicTokens: `0x202549FCF4Cc855ACA456c39A839c4f202Ee5Cef`

> TokenBalances: `0x2783c0A4Bfd3721961653a9e9939Fc63687bf07f`

### Ropsten deployment

> PublicTokens: `0xf166098CBA584b3Ebf9B5014Dca4009E89F4485d`

> TokenBalances: `0xB8E1Bbc50FD87Ea00D8ce73747Ac6F516aF26dAC`

### Example to read all token balances

```
const Web3 = require("web3");
const hexDecoder = require("./libs/binaryDecoder");
const web3 = new Web3("https://api.myetherwallet.com/eth");
const abi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "name",
        type: "bool"
      },
      {
        name: "website",
        type: "bool"
      },
      {
        name: "email",
        type: "bool"
      },
      {
        name: "_count",
        type: "uint256"
      }
    ],
    name: "getAllBalance",
    outputs: [
      {
        name: "",
        type: "bytes"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
const balanceContract = new web3.eth.Contract(
  abi,
  "0xdAFf2b3BdC710EB33A847CCb30A24789c0Ef9c5b"
);
balanceContract.methods
  .getAllBalance(
    "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D",
    true,
    true,
    true,
    0
  )
  .call()
  .then(res => {
    console.log(hexDecoder.decode(res));
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
