pragma solidity ^0.4.24;
import "../Seriality/Seriality.sol";
import "./DummyERC721Token.sol";
contract NFTBalances is Seriality{
    constructor() public {}
    modifier only_contract(address addr) {
        uint32 size;
        assembly {
            size := extcodesize(addr)
        }
        require(size > 0, "Not a contract");
        _;
    }
    function getTokenBalance(address tokenAddr, address addr) public view returns (uint bal) {
        bytes4 sig = bytes4(keccak256("balanceOf(address)"));
        assembly {
            // move pointer to free memory spot
            let ptr := mload(0x40)
            // put function sig at memory spot
            mstore(ptr,sig)
            // append argument after function sig
            mstore(add(ptr,0x04), addr)

            let result := call(
              150000, // gas limit
              tokenAddr,  // to addr. append var to _slot to access storage variable
              0, // not transfer any ether
              ptr, // Inputs are stored at location ptr
              0x24, // Inputs are 36 bytes long
              ptr,  //Store output over input
              0x20) //Outputs are 32 bytes long

             if iszero(result) {
                 bal := 0 // return 0 on error and 0 balance
             }
             if gt(result, 0) {
                 bal := mload(ptr) // Assign output to answer var
             }
            mstore(0x40,add(ptr,0x20)) // Set storage pointer to new space
        }
    }
    function tokenOfOwnerByIndex(address tokenAddr, address owner, uint tokenId) public view returns (uint token) {
        bytes4 sig = bytes4(keccak256("tokenOfOwnerByIndex(address,uint256)"));
        assembly {
            // move pointer to free memory spot
            let ptr := mload(0x40)
            // put function sig at memory spot
            mstore(ptr,sig)
            // append argument after function sig
            mstore(add(ptr,0x04), owner)
            // append argument after first parameter
            mstore(add(ptr,0x24), tokenId)

            let result := call(
              150000, // gas limit
              tokenAddr,  // to addr. append var to _slot to access storage variable
              0, // not transfer any ether
              ptr, // Inputs are stored at location ptr
              0x44, // Inputs are 36 bytes long
              ptr,  //Store output over input
              0x20) //Outputs are 32 bytes long

             if iszero(result) {
                 token := 0 // return 0 on error
             }
             if gt(result, 0) {
                 token := mload(ptr) // Assign output to answer var
             }
            mstore(0x40,add(ptr,0x20)) // Set storage pointer to new space
        }
    }
    function getByteSize(uint number) public view returns(uint8) {
        uint8 bitpos = 0;
        while(number != 0){
            bitpos++;
            number = number >> 1;
        }
        if(bitpos % 8 == 0) return (bitpos/8);
        else return (bitpos/8)+1;
    }
    function getTokenBalances(address[] memory _tokenAddresses, address _owner) public view returns (bytes memory) {
        uint bufferSize = 33; //define start + Data length
        bufferSize += 32; //to save the itemcount
        uint[] memory tokenBalances = new uint[](_tokenAddresses.length);
        for(uint i = 0; i < _tokenAddresses.length; i++){
            tokenBalances[i] = getTokenBalance(_tokenAddresses[i], _owner);
            bufferSize += 1; //save the bytesize
            bufferSize += getByteSize(tokenBalances[i]);
        }
        bytes memory result = new bytes(bufferSize);
        uint offset = bufferSize;
    	//serialize
        boolToBytes(offset, true, result); 
        offset -= 1;
        uintToBytes(offset, _tokenAddresses.length, result); 
        offset -= 32;
        for(i = 0; i < _tokenAddresses.length; i++){
            uint8 numBytes = getByteSize(tokenBalances[i]);
            uintToBytes(offset, numBytes, result); 
            offset -= 1;
            uintToBytes(offset, tokenBalances[i], result); 
            offset -= numBytes;
        }
        return result;
    }
    function getOwnedTokens(address _tokenAddress, address _owner, uint idxOffset, uint count) public view only_contract(_tokenAddress) returns (bytes memory) {
        uint bufferSize = 33; //define start + Data length
        bufferSize += 32; //to save the itemcount
        uint tokenBalance = getTokenBalance(_tokenAddress, _owner);
        uint itemCount = count;
        if((idxOffset+count)> tokenBalance) {
            itemCount =  tokenBalance - idxOffset;
        }
        uint[] memory ownedTokens = new uint[](itemCount);
        for(uint i = 0; i < itemCount; i++){
            ownedTokens[i] = tokenOfOwnerByIndex(_tokenAddress, _owner, i+idxOffset);
            bufferSize += 1; //save the bytesize
            bufferSize += getByteSize(ownedTokens[i]);
        }
        bytes memory result = new bytes(bufferSize);
        uint offset = bufferSize;
    	//serialize
        boolToBytes(offset, true, result); 
        offset -= 1;
        uintToBytes(offset, itemCount, result); 
        offset -= 32;
        for(i = 0; i < itemCount; i++){
            uint8 numBytes = getByteSize(ownedTokens[i]);
            uintToBytes(offset, numBytes, result); 
            offset -= 1;
            uintToBytes(offset, ownedTokens[i], result); 
            offset -= numBytes;
        }
        return result;
    }
}