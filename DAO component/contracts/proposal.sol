// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProposalContract {
    string public proposalType;

    // Function to set the proposal type
    function setProposalType(string memory _proposalType) external {
        proposalType = _proposalType;
    }

    // Function to get the proposal type
    function getProposalType() external view returns (string memory) {
        return proposalType;
    }
}
