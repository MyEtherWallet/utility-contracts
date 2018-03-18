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
        	console.log(web3.fromAscii("Dummy Token 1", 16))
            return pt.addSetToken(
            	web3.fromAscii("Dummy Token 1", 16), 
            	web3.fromAscii("DT1", 16), 
            	dTokens[0].address, 
            	5, 
            	web3.fromAscii("http://www.dtoken1.eth", 32), 
            	web3.fromAscii("support@dtoken1.eth", 32))
            /*    .then(function() {
                	        	console.log(web3.fromAscii("Dummy Token 1", 16))
                    return pt.addSetToken(web3.fromAscii("Dummy Token 1", 16), web3.fromAscii("DT1", 16), dTokens[0].address, 5, web3.fromAscii("http://www.dtoken1.eth", 32), web3.fromAscii("support@dtoken1.eth", 32))
                })
                .then(function() {
                    return pt.addSetToken(web3.fromAscii("Dummy Token 1", 16), web3.fromAscii("DT1", 16), dTokens[0].address, 5, web3.fromAscii("http://www.dtoken1.eth", 32), web3.fromAscii("support@dtoken1.eth", 32))
                }) */
        })
    })
};