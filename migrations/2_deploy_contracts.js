var Web3 = require("web3")
var web3 = new Web3()
var PublicTokens = artifacts.require("PublicTokens")
var DT1 = artifacts.require("DummyToken")
var DT2 = artifacts.require("DummyToken")
var DT3 = artifacts.require("DummyToken")
module.exports = function(deployer, network, accounts) {
    deployer.deploy(PublicTokens).then(function() {
        return PublicTokens.deployed();
    }).then(function(pt) {
        return deployer.deploy([
            [DT1, accounts[0]],
            [DT2, accounts[1]],
            [DT3, accounts[2]]
        ]).then(function() {
            return [DT1.deployed(), DT2.deployed(), DT3.deployed()]
        }).then(function(dTokens) {
            return [dTokens[0].then(function(dt0) {
                return pt.addSetToken(
                    "Dummy Token 0",
                    "DT0",
                    dt0.address,
                    5,
                    "http://www.dtoken0.eth",
                    "support@dtoken0.eth", {
                        from: accounts[0]
                    })
            }), dTokens[1].then(function(dt1) {
                return pt.addSetToken(
                    "Dummy Token 1",
                    "DT1",
                    dt1.address,
                    6,
                    "http://www.dtoken1.eth",
                    "support@dtoken1.eth", {
                        from: accounts[0]
                    })
            }), dTokens[2].then(function(dt2) {
                return pt.addSetToken(
                    "Dummy Token 2",
                    "DT2",
                    dt2.address,
                    7,
                    "http://www.dtoken2.eth",
                    "support@dtoken2.eth", {
                        from: accounts[0]
                    })
            })]
        })
    })
};