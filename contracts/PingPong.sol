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

    modifier onlySelf() {
      require(msg.sender == address(this), "!self");
        _;
    }

    // ============ Constructor ============
    constructor(address _connectionManager) {
      // TODO: Move to Router
        __XAppConnectionClient_initialize(_connectionManager);
    }

    function handlePing(uint32 _origin) external onlySelf {
      emit Received(_localDomain(), _origin, true);
      _sendPong(_origin);
    }

    function handlePong(uint32 _origin) external onlySelf {
      emit Received(_localDomain(), _origin, false);
      _sendPing(_origin);
    }

    function pingRemote(uint32 _destination) external onlySelf {
        _sendPing(_destination);
    }

    function _sendPing(uint32 _destination) internal {
      _send(_destination, true);
    }

    function _sendPong(uint32 _destination) internal {
      _send(_destination, false);
    }

    function _send(uint32 _destination, bool _isPing) internal {
      uint32 localDomain = _localDomain();
      _dispatchToRemoteRouter(
        _destination,
        abi.encodeCall(
          _isPing ? PingPong.handlePong : PingPong.handlePing,
          (localDomain)
        )
      );
      emit Sent(localDomain, _destination, _isPing);
    }

    function _handle(
        bytes calldata _message
    ) internal override returns (bool, bytes memory) { 
        return address(this).call(_message);
    }
}
