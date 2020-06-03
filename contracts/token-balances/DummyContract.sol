pragma solidity ^0.6.4;


contract DummyContract {
    constructor() public {}

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}
