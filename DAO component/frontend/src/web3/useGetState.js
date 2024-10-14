import { ethers } from "ethers";
import { useState } from "react";

import contractAddress from "../chain-info/deployments/map.json";
import contractABI from "../chain-info/contracts/MoralisGovernor.json";
import proposalcontractABI from "../chain-info/contracts/ProposalContract.json";
export function useGetState() {
  async function getProposalState(proposalId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = contractAddress["11155111"]["MoralisGovernor"][0];
      const abi = contractABI.abi;
      const GovernorContract = new ethers.Contract(contract, abi, provider);
      const value = await GovernorContract.state(proposalId);
      return value.toString();
    } catch {
      console.log("error");
    }
  }

  return { getProposalState };
}
export function useGetproposaltype() {
  async function getProposaltype() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const proposalAbi = proposalcontractABI.abi;
      const proposalContractInstance = new ethers.Contract(
        "0xbf2E408Afa9Bc0E584d976140C08E84d74A56790",
        proposalAbi,
        provider
      );
      const proposalType = await proposalContractInstance.getProposalType();
      return proposalType;
    } catch {
      console.log("error");
    }
  }

  return { getProposaltype };
}
