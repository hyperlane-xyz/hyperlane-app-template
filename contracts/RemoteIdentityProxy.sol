// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

// ============ External Imports ============

import "hardhat/console.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/*
 * @title The Hello World App
 * @dev You can use this simple app as a starting point for your own application.
 */
contract RemoteIdentityProxy is OwnableUpgradeable {
    uint32 originDomain;
    bytes32 originOwner;

    struct Call {
        address to;
        bytes data;
    }

    constructor(uint32 _originDomain, bytes32 _originOwner) {
        _transferOwnership(msg.sender);
        originDomain = _originDomain;
        originOwner = _originOwner;
    }

    function proxyCalls(Call[] calldata calls) public onlyOwner {
        for (uint256 i = 0; i < calls.length; i += 1) {
            (bool success, bytes memory returnData) = calls[i].to.call(
                calls[i].data
            );
            if (!success) {
                assembly {
                    revert(add(returnData, 32), returnData)
                }
            }
        }
    }
}
