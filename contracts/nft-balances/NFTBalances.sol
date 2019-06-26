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
    function getTokenSupply(address tokenAddr) public view returns (uint supply) {
        bytes4 sig = bytes4(keccak256("totalSupply()"));
        assembly {
            // move pointer to free memory spot
            let ptr := mload(0x40)
            // put function sig at memory spot
            mstore(ptr,sig)

            let result := call(
              150000, // gas limit
              tokenAddr,  // to addr. append var to _slot to access storage variable
              0, // not transfer any ether
              ptr, // Inputs are stored at location ptr
              0x04, // Inputs are 4 bytes long
              ptr,  //Store output over input
              0x20) //Outputs are 32 bytes long

             if iszero(result) {
                 supply := 0 // return 0 on error and 0 balance
             }
             if gt(result, 0) {
                 supply := mload(ptr) // Assign output to answer var
             }
            mstore(0x40,add(ptr,0x20)) // Set storage pointer to new space
        }
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
    function getTokenOwner(address tokenAddr, uint256 tokenId) public view returns (address owner) {
        bytes4 sig = bytes4(keccak256("ownerOf(uint256)"));
        assembly {
            // move pointer to free memory spot
            let ptr := mload(0x40)
            // put function sig at memory spot
            mstore(ptr,sig)
            // append argument after function sig
            mstore(add(ptr,0x04), tokenId)

            let result := call(
              150000, // gas limit
              tokenAddr,  // to addr. append var to _slot to access storage variable
              0, // not transfer any ether
              ptr, // Inputs are stored at location ptr
              0x24, // Inputs are 36 bytes long
              ptr,  //Store output over input
              0x20) //Outputs are 32 bytes long

             if iszero(result) {
                 owner := 0 // return 0 on error and 0 balance
             }
             if gt(result, 0) {
                 owner := mload(ptr) // Assign output to answer var
             }
            mstore(0x40,add(ptr,0x20)) // Set storage pointer to new space
        }
    }
    function getBufferSize(address _tokenAddress, address _owner) public view only_contract(_tokenAddress) returns (uint) {
        uint bufferSize = 1; //define start
        uint tokenBalance = getTokenBalance(_tokenAddress, _owner);
        uint tokenSupply = getTokenSupply(_tokenAddress);
        uint32[] memory ownedTokens = new uint32[](tokenBalance);
        uint32 countedTokens = 0;
        for(uint32 i = 0; i < tokenSupply && countedTokens < tokenBalance; i++){
            if(address(getTokenOwner(_tokenAddress, i)) == _owner){
                ownedTokens[countedTokens] = i;
                countedTokens++;
                bufferSize += 4; // tokenId (4)
    		}
        }
        return ownedTokens[1];
    }
    function getOwnedTokens(address _tokenAddress, address _owner) public view only_contract(_tokenAddress) returns (bytes memory) {
        uint bufferSize = 1; //define start
        uint tokenBalance = getTokenBalance(_tokenAddress, _owner);
        uint tokenSupply = getTokenSupply(_tokenAddress);
        uint[] memory ownedTokens = new uint[](tokenBalance);
        uint countedTokens = 0;
        for(uint i = 0; i < tokenSupply && countedTokens < tokenBalance; i++){
            if(address(getTokenOwner(_tokenAddress, i)) == _owner){
                ownedTokens[countedTokens] = i;
                countedTokens++;
                bufferSize += 32; // tokenId (4)
    		}
        }
        bytes memory result = new bytes(bufferSize);
        uint offset = bufferSize;
    	//serialize
        boolToBytes(offset, true, result); 
        offset -= 1;
        for(i = 0; i < tokenBalance; i++){
            uint _tokenId = ownedTokens[i];
            uintToBytes(offset, _tokenId, result); 
            offset -= 32;
        }
        return result;
    }
}