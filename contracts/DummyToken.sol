pragma solidity ^0.4.0;
contract DummyToken {
    function DummyToken(address addr) public {
        balances[addr] = 500000000000000;
    }
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
}