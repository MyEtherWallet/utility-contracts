pragma solidity ^0.6.4;


contract PublicTokens {
    uint256 public tokenCount = 0; //total count of all added tokens
    uint256 public tokenValidCount = 0; //count of all valid tokens isValid!=false
    address public owner;
    struct Token {
        bytes16 name; // Name of the token
        bytes16 symbol; // Symbol of the token
        address addr; // Address of the token contract
        uint8 decimals; // decimals of the token
        bytes32 website; // website of the token
        bytes32 email; // support email of the token
        bool isValid; //whether the token is valid or not
    }
    mapping(uint256 => Token) public pubTokens;
    mapping(address => bool) public moderator;
    mapping(address => uint256) public idMap;
    modifier owner_only() {
        require(owner == msg.sender, "only owner");
        _;
    }
    modifier only_mod() {
        require(
            owner == msg.sender || moderator[msg.sender] == true,
            "only moderetor"
        );
        _;
    }
    modifier only_contract(address addr) {
        uint32 size;
        assembly {
            size := extcodesize(addr)
        }
        require(size > 0, "Not a contract");
        _;
    }
    modifier no_null(address addr) {
        require(addr != address(0), "invalid address");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addModerator(address addr) public owner_only {
        moderator[addr] = true;
    }

    function removeModerator(address addr) public owner_only {
        moderator[addr] = false;
    }

    function loadTokensFromContract(address addr, uint256 from, uint256 amount)
        public
        owner_only
    {
        PublicTokens pubT = PublicTokens(addr);
        for (uint256 i = from; i < (from + amount); i++) {
            Token memory token;
            (
                token.name,
                token.symbol,
                token.addr,
                token.decimals,
                token.website,
                token.email,
                token.isValid
            ) = pubT.pubTokens(i);
            addSetToken(
                token.name,
                token.symbol,
                token.addr,
                token.decimals,
                token.website,
                token.email
            );
        }
    }

    function addSetToken(
        bytes16 name,
        bytes16 symbol,
        address addr,
        uint8 decimals,
        bytes32 website,
        bytes32 email
    ) public only_mod no_null(addr) only_contract(addr) {
        Token storage token = pubTokens[idMap[addr]];
        if (token.addr == address(0)) {
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
        if (token.addr == addr) {
            token.isValid = false;
            tokenValidCount--;
        }
    }

    function enableToken(address addr) public only_mod no_null(addr) {
        Token storage token = pubTokens[idMap[addr]];
        if (token.addr == addr) {
            token.isValid = true;
            tokenValidCount++;
        }
    }

    function getToken(address addr)
        public
        view
        returns (bytes16, bytes16, address, uint8, bytes32, bytes32)
    {
        Token memory token = pubTokens[idMap[addr]];
        return (
            token.name,
            token.symbol,
            token.addr,
            token.decimals,
            token.website,
            token.email
        );
    }

    function getTokenById(uint256 id)
        public
        view
        returns (bytes16, bytes16, address, uint8, bytes32, bytes32)
    {
        Token memory token = pubTokens[id];
        return (
            token.name,
            token.symbol,
            token.addr,
            token.decimals,
            token.website,
            token.email
        );
    }
}
