var Web3 = require("web3");
var web3 = new Web3();
var PublicTokens = artifacts.require("PublicTokens");
var TokenBalances = artifacts.require("TokenBalances");
var DT1 = artifacts.require("DummyToken");
var DT2 = artifacts.require("DummyToken");
var DT3 = artifacts.require("DummyToken");
var DC = artifacts.require("DummyContract");
var ethTokens = require("../tokens/tokens-eth.json");
var getHex = str => {
  return "0x" + Buffer.from(str, "utf8").toString("hex");
};
module.exports = function(deployer, network, accounts) {
  if (network == "development") {
    deployer
      .deploy(PublicTokens)
      .then(function() {
        return PublicTokens.deployed();
      })
      .then(function(pt) {
        return deployer
          .deploy([[DT1, accounts[0]], [DT2, accounts[1]], [DT3, accounts[2]]])
          .then(function() {
            return [DT1.deployed(), DT2.deployed(), DT3.deployed()];
          })
          .then(function(dTokens) {
            return deployer.deploy(TokenBalances, pt.address).then(function() {
              return deployer.deploy(DC);
            });
          });
      });
  } else if (network == "live") {
    deployer
      .deploy(PublicTokens)
      .then(function() {
        return PublicTokens.deployed({ gas: "0x7a120" });
      })
      .then(function(pt) {
        ethTokens.forEach(async _token => {
          try {
            await pt.addSetToken(
              getHex(_token.name.substr(0, 16)),
              getHex(_token.symbol),
              _token.address,
              _token.decimals,
              getHex(_token.website),
              getHex(_token.support.email),
              { gas: "0x493e0" }
            );
          } catch (e) {
            console.log(_token, e);
          }
        });
      })
      .then(function() {
        deployer.deploy(TokenBalances, pt.address);
      });
  } else if (network == "ropsten") {
    deployer
      .deploy(PublicTokens)
      .then(function() {
        return PublicTokens.deployed({ gas: "0x7a120" });
      })
      .then(function(pt) {
        ethTokens.forEach(async _token => {
          try {
            await pt.addSetToken(
              getHex(_token.name.substr(0, 16)),
              getHex(_token.symbol),
              _token.address,
              _token.decimals,
              getHex(_token.website),
              getHex(_token.support.email),
              { gas: "0x493e0" }
            );
          } catch (e) {
            console.log(_token, e);
          }
        });
      });
  }
};
