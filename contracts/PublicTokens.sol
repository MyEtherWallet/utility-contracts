pragma solidity ^0.4.0;
import "./Seriality/Seriality.sol";
import "./DummyToken.sol";

contract PublicTokens is Seriality{
	uint public tokenCount = 0; //total count of all added tokens
	uint public tokenValidCount = 0; //count of all valid tokens isValid!=false
	address public owner;
    struct Token {
        bytes16 name; // Name of the token
        bytes16 symbol;  // Symbol of the token
        address addr; // Address of the token contract
        uint8 decimals; // decimals of the token
        bytes32 website;   // website of the token
        bytes32 email; // support email of the token
        bool isValid; //whether the token is valid or not
    }
    mapping(uint => Token) public pubTokens;
    mapping(address => bool) public moderator;
    mapping(address => uint) public idMap;
    modifier owner_only() {
        require(owner == msg.sender);
        _;
    }
    modifier only_mod() {
        require(owner == msg.sender || moderator[msg.sender] == true);
        _;
    }
    modifier no_null(address addr) {
        require(addr != 0x0);
        _;
    }
    function PublicTokens () public {
    	owner = msg.sender;
    }
    function addModerator(address addr) public owner_only {
    	moderator[addr] = true;
    }
    function removeModerator(address addr) public owner_only {
    	moderator[addr] = false;
    }
    function addSetToken(
    	bytes16 name, 
    	bytes16 symbol, 
    	address addr, 
    	uint8 decimals, 
    	bytes32 website, 
    	bytes32 email) public only_mod no_null(addr) {
    	Token storage token = pubTokens[idMap[addr]];
    	if(token.addr == 0x0) {
    		tokenCount++;
        	tokenValidCount++;
    		token = pubTokens[tokenCount];
    		idMap[addr] = tokenCount;
    		token.isValid = true;
    	}
        token.name = name;
        token.symbol = symbol;
        token.addr = addr;
        token.decimals = decimals;
        token.website = website;
        token.email = email;
    }
    function disableToken(address addr) public only_mod no_null(addr) {
    	Token storage token = pubTokens[idMap[addr]];
    	if(token.addr == addr) {
    		token.isValid = false;
    		tokenValidCount--;
    	}
    }
    function enableToken(address addr) public only_mod no_null(addr) {
    	Token storage token = pubTokens[idMap[addr]];
    	if(token.addr == addr) {
    		token.isValid = false;
    		tokenValidCount++;
    	}
    }
    function getToken(address addr) public view returns (
    	bytes16, 
    	bytes16, 
    	address, 
    	uint8, 
    	bytes32, 
    	bytes32) {
    	Token memory token =  pubTokens[idMap[addr]];
        return (
        	token.name,
        	token.symbol,
        	token.addr,
        	token.decimals,
        	token.website,
        	token.email);
    }
    function getTokenById(uint id) public view returns (
    	bytes16, 
    	bytes16, 
    	address, 
    	uint8, 
    	bytes32, 
    	bytes32) {
    	Token memory token =  pubTokens[id];
        return (
        	token.name,
        	token.symbol,
        	token.addr,
        	token.decimals,
        	token.website,
        	token.email);
    }
    function getAllBalance(address _owner, bool name, bool website, bool email, uint count) public view returns (bytes) {
    	if(count == 0) count = tokenCount;
        uint bufferSize = 33; //assign 32 bytes to set the total number of tokens + define start
    	bufferSize += 3; //set name, website, email
        uint validCounter = 0;
    	for(uint i=1; i<=count; i++){
    		Token memory token = pubTokens[i];
    		if(token.isValid){
                validCounter++;
    			if(name) bufferSize+=16;
    			if(website) bufferSize+=32;
    			if(email) bufferSize+=32;
    			bufferSize+= 76; // address (20) + symbol(16) + balance(32) + decimals(8)
    		}
    	}
    	bytes memory result = new bytes(bufferSize);
    	uint offset = bufferSize;
    	//serialize
        boolToBytes(offset, true, result); offset -= 1;
    	uintToBytes(offset, validCounter, result); offset -= 32;
    	boolToBytes(offset, name, result); offset -= 1;
    	boolToBytes(offset, website, result); offset -= 1;
    	boolToBytes(offset, email, result); offset -= 1;
    	for(i=1; i<=count; i++){
    		token = pubTokens[i];
    		DummyToken basicToken = DummyToken(token.addr);
    		if(token.isValid){
    			bytes16ToBytesR(offset, token.symbol, result); offset -= 16;
    			addressToBytes(offset, token.addr, result); offset -= 20;
    			uintToBytes(offset, token.decimals, result); offset -= 8;
                uint256 balance = basicToken.balanceOf(_owner);
    			uintToBytes(offset, balance, result); offset -= 32;
    			if(name){
    				bytes16ToBytesR(offset, token.name, result); offset -= 16;
    			}
    			if(website) {
    				bytes32ToBytesR(offset, token.website, result); offset -= 32;
    			}
    			if(email) {
    				bytes32ToBytesR(offset, token.email, result); offset -= 32;
    			}
    		}
    	}
    	return result;
    }
}