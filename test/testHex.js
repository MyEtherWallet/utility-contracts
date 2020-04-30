var PublicTokens = artifacts.require("PublicTokens");
var TokenBalances = artifacts.require("TokenBalances");
var Web3 = require("web3");
var web3 = new Web3();
var bd = require("./binaryDecoder.js");

contract("PublicTokens", function (accounts) {
  let pt, tb;
  before(async function () {
    pt = await PublicTokens.new();
    console.log(pt.address, "public token address");
    tb = await TokenBalances.new(pt.address);
  });
  xit("rune me", async function () {
    const balances = await tb.getAllBalance.call(
      "0xa68d397873862Dc4b1e1533bE4C9D67b0B6EBe51",
      true,
      true,
      true
    );
    console.log(balances);
    assert.equal(1, 1);
  });
});
