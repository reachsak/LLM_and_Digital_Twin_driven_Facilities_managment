// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherTransfer {
    address payable public recipient = payable(0xcA36EB5091e0fe1c40005e30D5C4e047b668F3fa);

    function transferEther(uint256 amount) external payable {
        require(msg.value == amount, "Incorrect amount sent");
        recipient.transfer(amount);
    }
}
