pragma solidity ^0.6.4;
import "./Utils.sol";
import "./PublicTokens.sol";
import "./DummyToken.sol";


contract TokenBalances is Utils {
    struct Token {
        bytes16 name; // Name of the token
        bytes16 symbol; // Symbol of the token
        address addr; // Address of the token contract
        uint8 decimals; // decimals of the token
        bytes32 website; // website of the token
        bytes32 email; // support email of the token
        bool isValid; //whether the token is valid or not
    }
    PublicTokens pubT;

    constructor(address tokenStorage) public {
        pubT = PublicTokens(tokenStorage);
    }

    function getTokenStorage() public view returns (address) {
        return address(pubT);
    }

    function getToken(uint256 id) internal view returns (Token memory token) {
        (
            token.name,
            token.symbol,
            token.addr,
            token.decimals,
            token.website,
            token.email,
            token.isValid
        ) = pubT.pubTokens(id);
    }

    function numBytesEstimate(
        uint256 tokenCount,
        bool name,
        bool email,
        bool website
    ) internal pure returns (uint256) {
        uint256 bufferSize = 32 + 32; //set total number of bytes, total number of validTokens at the end
        bufferSize += 3; //set name, website, email
        uint256 iterCount = 0;
        if (name) iterCount += 32;
        if (website) iterCount += 32;
        if (email) iterCount += 32;
        iterCount += 69;
        return bufferSize + iterCount * tokenCount;
    }

    function getAllBalance(address _owner, bool name, bool website, bool email)
        public
        returns (bytes memory)
    {
        uint256 count = pubT.tokenCount();
        uint256 estimatedBufferSize = numBytesEstimate(
            count,
            name,
            email,
            website
        );
        bytes memory result = new bytes(estimatedBufferSize);
        uint256 offset = 32 + 32; //set total number of bytes, total number of validTokens at the end
        copyBool(offset, name, result);
        offset += 1;
        copyBool(offset, website, result);
        offset += 1;
        copyBool(offset, email, result);
        offset += 1;
        uint256 numValidTokens = 0;
        for (uint256 i = 1; i <= count; i++) {
            Token memory token = getToken(i);
            if (token.isValid && isContract(token.addr)) {
                uint256 balance = getTokenBalance(token.addr, _owner);
                if (balance == 0) continue;
                numValidTokens++;
                copyBytes16(offset, token.symbol, result);
                offset += 16;
                copyAddress(offset, token.addr, result);
                offset += 20;
                copyUint8(offset, token.decimals, result);
                offset += 1;
                copyUint(offset, balance, result);
                offset += 32;
                if (name) {
                    copyBytes16(offset, token.name, result);
                    offset += 16;
                }
                if (website) {
                    copyBytes32(offset, token.website, result);
                    offset += 32;
                }
                if (email) {
                    copyBytes32(offset, token.email, result);
                    offset += 32;
                }
            }
        }
        copyUint(0, offset - 32, result);
        copyUint(32, numValidTokens, result);
        return result;
    }
}
