// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import {RemoteIdentityProxy} from "./RemoteIdentityProxy.sol";

// ============ External Imports ============
import {Router} from "@abacus-network/app/contracts/Router.sol";
import {TypeCasts} from "@abacus-network/core/contracts/libs/TypeCasts.sol";
import "hardhat/console.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

/*
 * @title The Hello World App
 * @dev You can use this simple app as a starting point for your own application.
 */
contract RemoteIdentityProxyRouter is Router {
    constructor(
        address _abacusConnectionManager,
        address _interchainGasPaymaster
    ) {
        // Transfer ownership of the contract to deployer
        _transferOwnership(msg.sender);
        // Set the addresses for the ACM and IGP
        // Alternatively, this could be done later in an initialize method
        _setAbacusConnectionManager(_abacusConnectionManager);
        _setInterchainGasPaymaster(_interchainGasPaymaster);
    }

    function dispatch(
        uint32 _destinationDomain,
        RemoteIdentityProxy.Call[] calldata calls
    ) public {
        _dispatch(
            _destinationDomain,
            abi.encode(TypeCasts.addressToBytes32(msg.sender), calls)
        );
    }

    function getRIPAddress(uint32 _origin, bytes32 _sender)
        public
        view
        returns (address)
    {
        bytes32 salt = keccak256(abi.encodePacked(_origin, _sender));
        bytes memory initCode = abi.encodePacked(
            type(RemoteIdentityProxy).creationCode,
            abi.encode(_origin, _sender)
        );
        return Create2.computeAddress(salt, keccak256(initCode));
    }

    function _handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) internal override {
        (bytes32 _originSender, RemoteIdentityProxy.Call[] memory calls) = abi
            .decode(_message, (bytes32, RemoteIdentityProxy.Call[]));
        bytes32 salt = keccak256(abi.encodePacked(_origin, _originSender));
        bytes memory initCode = abi.encodePacked(
            type(RemoteIdentityProxy).creationCode,
            abi.encode(_origin, _originSender)
        );
        address proxyAddress = Create2.computeAddress(
            salt,
            keccak256(initCode)
        );
        RemoteIdentityProxy proxy = RemoteIdentityProxy(proxyAddress);
        if (!Address.isContract(proxyAddress)) {
            Create2.deploy(0, salt, initCode);
        }
        proxy.proxyCalls(calls);
    }
}
