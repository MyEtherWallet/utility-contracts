pragma solidity ^0.6.4;


contract Utils {
    function isContract(address addr) public view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function memcpy(
        bytes memory src,
        uint256 _offst,
        uint256 len,
        bytes memory result
    ) public pure {
        uint256 srcOffst = 0;
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(add(result, _offst), mload(add(src, srcOffst)))
            }
            _offst += 32;
            srcOffst += 32;
        }
        if (len == 0) return;
        uint256 mask = 256**(32 - len) - 1;
        assembly {
            let srcpart := and(mload(add(srcOffst, src)), not(mask))
            let destpart := and(mload(add(result, _offst)), mask)
            mstore(add(result, _offst), srcpart)
        }
    }

    function copyBool(uint256 _offst, bool _input, bytes memory result)
        public
        pure
    {
        uint8 x = _input == false ? 0 : 1;
        assembly {
            mstore8(add(_offst, result), x)
        }
    }

    function copyBytes16(uint256 _offst, bytes16 _input, bytes memory result)
        public
        pure
    {
        bytes memory b = new bytes(16);
        assembly {
            mstore(b, _input)
        }
        memcpy(b, _offst, 16, result);
    }

    function copyBytes32(uint256 _offst, bytes32 _input, bytes memory result)
        public
        pure
    {
        bytes memory b = new bytes(32);
        assembly {
            mstore(b, _input)
        }
        memcpy(b, _offst, 32, result);
    }

    function copyUint(uint256 _offst, uint256 _input, bytes memory result)
        public
        pure
    {
        bytes memory b = new bytes(32);
        assembly {
            mstore(b, _input)
        }
        memcpy(b, _offst, 32, result);
    }

    function copyUint8(uint256 _offst, uint8 _input, bytes memory result)
        public
        pure
    {
        assembly {
            mstore8(add(_offst, result), _input)
        }
    }

    function copyAddress(uint256 _offst, address _input, bytes memory result)
        public
        pure
    {
        bytes memory b = new bytes(32);
        bytes32 _address = bytes32(uint256(_input) << 96);
        assembly {
            mstore(b, _address)
        }
        memcpy(b, _offst, 20, result);
    }

    function getTokenBalance(address tokenAddr, address addr)
        public
        returns (uint256 bal)
    {
        bytes4 sig = bytes4(keccak256("balanceOf(address)"));
        assembly {
            // move pointer to free memory spot
            let ptr := mload(0x40)
            // put function sig at memory spot
            mstore(ptr, sig)
            // append argument after function sig
            mstore(add(ptr, 0x04), addr)

            let result := call(
                150000, // gas limit
                tokenAddr, // to addr. append var to _slot to access storage variable
                0, // not transfer any ether
                ptr, // Inputs are stored at location ptr
                0x24, // Inputs are 36 bytes long
                ptr, //Store output over input
                0x20
            ) //Outputs are 32 bytes long

            if iszero(result) {
                bal := 0 // return 0 on error and 0 balance
            }
            if gt(result, 0) {
                bal := mload(ptr) // Assign output to answer var
            }
            mstore(0x40, add(ptr, 0x20)) // Set storage pointer to new space
        }
    }
}
