var PublicTokens = artifacts.require("PublicTokens");
var TokenBalances = artifacts.require("TokenBalances");
var DummyToken = artifacts.require("DummyToken");
var DummyContract = artifacts.require("DummyContract");
var Web3 = require("web3");
var web3 = new Web3();
var bd = require("./binaryDecoder.js");

function trim(str) {
  return str.replace(/\0[\s\S]*$/g, "");
}
var getHex = (str) => {
  return "0x" + Buffer.from(str, "utf8").toString("hex");
};
contract("PublicTokens", function (accounts) {
  var pt = null;
  var tb = null;
  var dt1 = null;
  var dt2 = null;
  var dt3 = null;
  var dc = null;
  before(async function () {
    pt = await PublicTokens.new();
    console.log(pt.address, "public token address");
    tb = await TokenBalances.new(pt.address);
    dt1 = await DummyToken.new(accounts[1], {
      from: accounts[1],
    });
    dt2 = await DummyToken.new(accounts[2], {
      from: accounts[2],
    });
    dt3 = await DummyToken.new(accounts[3], {
      from: accounts[3],
    });
    dc = await DummyContract.new();
  });
  it("should add token contracts", async function () {
    await pt.addSetToken(
      getHex("Dummy Token 1"),
      getHex("DT1"),
      dt1.address,
      5,
      getHex("http://www.dtoken1.eth"),
      getHex("support@dtoken1.eth"),
      {
        from: accounts[0],
      }
    );
    await pt.addSetToken(
      getHex("Dummy Token 2"),
      getHex("DT2"),
      dt2.address,
      6,
      getHex("http://www.dtoken2.eth"),
      getHex("support@dtoken2.eth"),
      {
        from: accounts[0],
      }
    );
    var tokenInfo1 = await pt.getToken(dt1.address);
    var tokenInfo2 = await pt.getToken(dt2.address);

    assert.equal(trim(web3.utils.toAscii(tokenInfo1[0])), "Dummy Token 1");
    assert.equal(trim(web3.utils.toAscii(tokenInfo1[1])), "DT1");
    assert.equal(tokenInfo1[2], dt1.address);
    assert.equal(tokenInfo1[3].toNumber(), 5);
    assert.equal(
      trim(web3.utils.toAscii(tokenInfo1[4])),
      "http://www.dtoken1.eth"
    );
    assert.equal(
      trim(web3.utils.toAscii(tokenInfo1[5])),
      "support@dtoken1.eth"
    );

    assert.equal(trim(web3.utils.toAscii(tokenInfo2[0])), "Dummy Token 2");
    assert.equal(trim(web3.utils.toAscii(tokenInfo2[1])), "DT2");
    assert.equal(tokenInfo2[2], dt2.address);
    assert.equal(tokenInfo2[3].toNumber(), 6);
    assert.equal(
      trim(web3.utils.toAscii(tokenInfo2[4])),
      "http://www.dtoken2.eth"
    );
    assert.equal(
      trim(web3.utils.toAscii(tokenInfo2[5])),
      "support@dtoken2.eth"
    );
  });
  it("should fail to register a token from other addresses", async function () {
    try {
      var failingTx = await pt.addSetToken(
        getHex("Dummy Token 3"),
        getHex("DT3"),
        dt3.address,
        7,
        getHex(getHex("http://www.dtoken3.eth"), "support@dtoken3.eth"),
        {
          from: accounts[1],
        }
      );
      assert.fail("didnt fail the tx");
    } catch (e) {}
  });
  it("should have correct balances", async function () {
    var balance1 = await dt1.balanceOf(accounts[1]);
    var balance2 = await dt2.balanceOf(accounts[2]);
    assert.equal(balance1.toNumber(), 500000000000000);
    assert.equal(balance2.toNumber(), 500000000000000);
  });
  it("should get correct encoded string", async function () {
    var allBalance = await tb.getAllBalance.call(accounts[1], true, true, true);
    var tokens = bd(allBalance);
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].balance, 500000000000000);
  });
  it("kill one contract and should still work", async function () {
    await dt2.killMe();
    var allBalance = await tb.getAllBalance.call(accounts[1], true, true, true);
    var tokens = bd(allBalance);
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].balance, 500000000000000);
    assert.equal(tokens[0].symbol, "DT1");
  });
  it("set random contract and should still work", async function () {
    await pt.addSetToken(
      getHex("Dummy Contract"),
      getHex("DC"),
      dc.address,
      6,
      getHex("http://www.dcontract.eth"),
      getHex("support@dcontract.eth"),
      {
        from: accounts[0],
      }
    );
    var allBalance = await tb.getAllBalance.call(accounts[1], true, true, true);
    var tokens = bd(allBalance);
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].balance, 500000000000000);
    assert.equal(tokens[0].symbol, "DT1");
  });
});
