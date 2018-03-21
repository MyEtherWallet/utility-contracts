var bn = require('bignumber.js')
var Web3 = require('web3')
var web3 = new Web3()
var sizeHex = (bytes) => {
    return bytes * 2;
}

function trim(str) {
    return str.replace(/\0[\s\S]*$/g, '')
}

function getAscii(hex) {
    hex = hex.substring(0, 2) == '0x' ? hex : '0x' + hex;
    return trim(web3.toAscii(hex))
}
module.exports = {
    decode: (hex) => {
        var tokens = []
        hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
        var offset = hex.length
        offset -= sizeHex(32)
        var countTokens = hex.substr(offset, sizeHex(32))
        offset -= sizeHex(1)
        var isName = parseInt(hex.substr(offset, sizeHex(1)))
        offset -= sizeHex(1)
        var isWebSite = parseInt(hex.substr(offset, sizeHex(1)))
        offset -= sizeHex(1)
        var isEmail = parseInt(hex.substr(offset, sizeHex(1)))
        var numTokens = new bn('0x' + countTokens).toNumber()
        for (var i = 0; i < numTokens; i++) {
            var token = {}
            offset -= sizeHex(16)
            token.symbol = getAscii(hex.substr(offset, sizeHex(16)))
            offset -= sizeHex(20)
            token.addr = '0x' + hex.substr(offset, sizeHex(20))
            offset -= sizeHex(8)
            token.decimals = new bn('0x' + hex.substr(offset, sizeHex(8))).toNumber()
            offset -= sizeHex(32)
            token.balance = new bn('0x' + hex.substr(offset, sizeHex(32))).toFixed()
            if (isName) {
                offset -= sizeHex(16)
                token.name = getAscii(hex.substr(offset, sizeHex(16)))

            }
            if (isWebSite) {
                offset -= sizeHex(32)
                token.website = getAscii(hex.substr(offset, sizeHex(32)))
            }
            if (isEmail) {
                offset -= sizeHex(32)
                token.email = getAscii(hex.substr(offset, sizeHex(32)))

            }
            tokens.push(token)
        }
        return tokens
    }
}

/*
737570706f72744064746f6b656e322e65746800000000000000000000000000
687474703a2f2f7777772e64746f6b656e322e65746800000000000000000000
44756d6d7920546f6b656e2032000000
0000000000000000000000000000000000000000000000000000000000000000
0000000000000006
27aa52389b5f55012870441670705c6e24efa6b1
44543200000000000000000000000000


737570706f72744064746f6b656e312e65746800000000000000000000000000
687474703a2f2f7777772e64746f6b656e312e65746800000000000000000000
44756d6d7920546f6b656e203100000000000000000000000000000000000000
00000000000000000001c6bf52634000
0000000000000005
31284dd9b04450ac07d44f3d4f93c71a536a6971
44543100000000000000000000000000
010101
0000000000000000000000000000000000000000000000000000000000000002
*/

//var hex = "737570706f72744064746f6b656e322e65746800000000000000000000000000687474703a2f2f7777772e64746f6b656e322e6574680000000000000000000044756d6d7920546f6b656e20320000000000000000000000000000000000000000000000000000000000000000000000000000000000000627aa52389b5f55012870441670705c6e24efa6b144543200000000000000000000000000737570706f72744064746f6b656e312e65746800000000000000000000000000687474703a2f2f7777772e64746f6b656e312e6574680000000000000000000044756d6d7920546f6b656e20310000000000000000000000000000000000000000000000000000000001c6bf52634000000000000000000531284dd9b04450ac07d44f3d4f93c71a536a6971445431000000000000000000000000000101010000000000000000000000000000000000000000000000000000000000000002"