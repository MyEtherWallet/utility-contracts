module.exports = {
  compilers: {
    solc: {
      version: "0.6.4",
    },
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: "0x12a05f200",
    },
    live: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gasPrice: "0x3b9aca00",
    },
    ropsten: {
      host: "https://api.myetherapi.com/rop",
      port: 443,
      network_id: "*", // Match any network id
      gasPrice: "0x3b9aca00",
    },
  },
};
