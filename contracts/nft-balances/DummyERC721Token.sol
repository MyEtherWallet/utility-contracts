pragma solidity ^0.4.24;
contract DummyToken {
    constructor() public {
        owner = msg.sender;
        tokens[4] = owner;
        balances[owner] = 1;
    }
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable returns (bool success) {
        require(tokens[_tokenId] == msg.sender && msg.sender == _from);
        balances[msg.sender] -= 1;
        balances[_to] += 1;
        return true;
    }
    function ownerOf(uint256 _tokenId) external view returns (address) {
        return tokens[_tokenId];
    }
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
    function killMe() public {
        selfdestruct(owner);
    }
    uint256 public totalSupply = 1;
    address public owner;
    mapping (address => uint256) balances;
    mapping (uint256 => address) tokens;
    mapping (address => mapping (address => uint256)) allowed;
}