// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transfer {
    function transferEther(address payable _recipient, uint256 _amount) external payable {
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Invalid amount");
        require(msg.value >= _amount, "Insufficient Ether sent");

        _recipient.transfer(_amount);
    }
}
