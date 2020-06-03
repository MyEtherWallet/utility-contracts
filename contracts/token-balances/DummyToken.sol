pragma solidity ^0.6.4;


contract DummyToken {
    address public owner;

    constructor(address addr) public {
        balances[addr] = 500000000000000;
        owner = msg.sender;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balances[msg.sender] >= _value, "low sender balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function killMe() public {
        selfdestruct(payable(owner));
    }

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
}
