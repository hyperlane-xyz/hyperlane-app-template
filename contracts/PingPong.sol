// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.13;

// ============ External Imports ============
import {Router} from "@abacus-network/app/contracts/Router.sol";

/*
============ PingPong ============
The PingPong app is capable of initiating PingPong "matches" between two chains.
A match consists of "volleys" sent back-and-forth between the two chains via Abacus.

The first volley in a match is always a Ping volley.
When a contract receives a Ping volley, it returns a Pong.
When a contract receives a Pong volley, it returns a Ping.

The contracts keep track of the number of volleys in a given match,
and emit events for each Sent and Received volley so that spectators can watch.
*/
contract PingPong is Router {
    uint256 public sent;
    uint256 public received;

    // ============ Events ============
    event Sent(
        uint32 indexed origin,
        uint32 indexed destination,
        bool isPing
    );

    event Received(
        uint32 indexed origin,
        uint32 indexed destination,
        bool isPing
    );

    // ============ Constructor ============
    constructor(address _connectionManager) {
        __Router_initialize(_connectionManager);
    }

    function pingRemote(uint32 _destination) external {
      _send(_destination, true);
    }

    function _handle(
        bytes calldata _message
    ) internal override returns (bool, bytes memory) { 
        received += 1;
        (uint32 _origin, bool _isPing) = abi.decode(_message, (uint32, bool));
        emit Received(_origin, _localDomain(), _isPing);
        _send(_origin, !_isPing);
        return (true, "");
    }

    function _send(uint32 _destination, bool _isPing) internal {
      address recipient = address(uint160(uint256(_mustHaveRemoteRouter(_destination))));
      sent += 1;
      uint32 localDomain = _localDomain();
      _dispatchToRemoteRouter(
        _destination,
        abi.encode(localDomain, _isPing)
      );
      emit Sent(localDomain, _destination, _isPing);
    }
  }