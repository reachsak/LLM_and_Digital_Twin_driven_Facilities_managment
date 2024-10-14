// The voting delay is the time between the proposal being created and the voting starts
// Voting Period is the time between the voting starting and the voting ending
// Proposal Treshold is the minimum amount of votes an account must have to be able to create a proposal
// Quorum is the minimum amount of votes a proposal must have to be able to be executed in percentage
// Updatable Settings allows to change the settings of the contract such as delay, period, treshold.
// Bravo Compatible allows to use the Bravo compatible functions such as getVotes and getReceipts

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract MoralisGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    // Proposal Counts
    uint256 public s_proposalCount;
    address[] public members;
    mapping(address => bool) public isMember;

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _quorumPercentage
    )
        Governor("Governor")
        
        GovernorSettings(
            _votingDelay, /* 1 => 1 block */
            _votingPeriod, /* 300 blocks => 1 hour */
            0 /* 0 => Because we want anyone to be able to create a proposal */
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage) /* 4 => 4% */
        GovernorTimelockControl(_timelock)
    {
        s_proposalCount = 0;
        members.push(msg.sender);
        isMember[msg.sender] = true;
    }
    fallback() external payable {}
    modifier onlyMember() {
        require(isMember[msg.sender], "Only members can call this function");
        _;
    }
    
    function sendEther(address payable receiver, uint256 amount) external {
        require(address(this).balance >= amount, "Insufficient balance in the contract");
        receiver.transfer(amount);
    }
    function getMembers() external view returns (address[] memory) {
        return members;
    }
    

    // The following functions are overrides required by Solidity.
    function addMember(address newMember) external onlyMember {
        require(!isMember[newMember], "Address is already a member");
        members.push(newMember);
        isMember[newMember] = true;
    }
    function removeMember(address member) external onlyMember {
        require(isMember[member], "Address is not a member");
        
        // Find the index of the member in the array
        uint256 index;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) {
                index = i;
                break;
            }
        }

        // Swap with the last element and then remove the last element to maintain order
        members[index] = members[members.length - 1];
        members.pop();
        isMember[member] = false;
    }
    function getMemberLength() external view returns (uint256) {
        return members.length;
    }
    

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        s_proposalCount++;
        return super.propose(targets, values, calldatas, description);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getNumberOfProposals() public view returns (uint256) {
        return s_proposalCount;
    }
}
