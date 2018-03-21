var bn = require('bignumber.js')
var sizeHex = (bytes) => {
        return bytes * 2;
    }
    module.exports = {
        decode: (hex) => {
            hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
            console.log(hex)
            var offset = hex.length;
            offset -= 32*2;
            //console.log(hex.substring(offset, 64))
           // hex = hex.match(/.{2}/g).reverse().join("");
          //  var hCountTokens = 
            //var buf = new Buffer(, 'hex')

           // console.log(buf.toString('hex'))
        }
    }

var hex = "737570706f72744064746f6b656e322e65746800000000000000000000000000687474703a2f2f7777772e64746f6b656e322e6574680000000000000000000044756d6d7920546f6b656e20320000000000000000000000000000000000000000000000000000000000000000000000000000000000000627aa52389b5f55012870441670705c6e24efa6b144543200000000000000000000000000737570706f72744064746f6b656e312e65746800000000000000000000000000687474703a2f2f7777772e64746f6b656e312e6574680000000000000000000044756d6d7920546f6b656e20310000000000000000000000000000000000000000000000000000000001c6bf52634000000000000000000531284dd9b04450ac07d44f3d4f93c71a536a6971445431000000000000000000000000000101010000000000000000000000000000000000000000000000000000000000000002"
var offset = hex.length
offset -= sizeHex(32)
var countTokens = hex.substr(offset, sizeHex(32))
offset -= sizeHex(1)
var isName = hex.substr(offset, sizeHex(1))
offset -= sizeHex(1)
var isWebSite = hex.substr(offset, sizeHex(1))
offset -= sizeHex(1)
var isEmail = hex.substr(offset, sizeHex(1))
offset -= sizeHex(1)
console.log(isName, isWebSite, isEmail)
var numTokens = new bn('0x' + countTokens).toNumber()
for (var i = 0; i < numTokens; i++) {
    var token = {}
    console.log(offset)
    token.symbol = hex.substr(offset, sizeHex(16))
    offset -= sizeHex(16)
    token.addr = hex.substr(offset, sizeHex(20))
    offset -= sizeHex(20)
    token.decimals = hex.substr(offset, sizeHex(8))
    offset -= sizeHex(8)
    token.balance = hex.substr(offset, sizeHex(32))
    offset -= sizeHex(32)
    if(isName) {
        token.name = hex.substr(offset, sizeHex(16))
        offset -= sizeHex(16)
    }
    if(isWebSite) {
        token.website = hex.substr(offset, sizeHex(32))
        offset -= sizeHex(32)
    }
    if(isEmail){
        token.email = hex.substr(offset, sizeHex(32))
        offset -= sizeHex(32)
    }
    console.log(token)
}