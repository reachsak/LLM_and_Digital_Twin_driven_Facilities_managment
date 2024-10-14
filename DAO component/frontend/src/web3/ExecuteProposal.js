import { ethers } from "ethers";

import contractAddresses from "../chain-info/deployments/map.json";
import boxContractABI from "../chain-info/contracts/Box.json";
import moralisGovernorABI from "../chain-info/contracts/MoralisGovernor.json";
import governancetokenABI from "../chain-info/contracts/GovernanceToken.json";

export function useExecuteProposalsendtoken() {
  async function queueProposal(signer, value, proposalDescription, address) {
    try {
      const governancetokencontract =
        contractAddresses["11155111"]["GovernanceToken"][0];
      const moralisGovernor =
        contractAddresses["11155111"]["MoralisGovernor"][0];

      const GovAbi = governancetokenABI.abi;
      const moralisGovernorAbi = moralisGovernorABI.abi;
      const moralisGovernorContractInstance = new ethers.Contract(
        moralisGovernor,
        moralisGovernorAbi,
        signer
      );

      const governancetokeninterface = new ethers.utils.Interface(GovAbi);

      const encodedFunction2 = governancetokeninterface.encodeFunctionData(
        "sendTokens",
        [address, value]
      );

      const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(proposalDescription)
      );

      const queueTx = await moralisGovernorContractInstance.queue(
        [governancetokencontract],
        [0],
        [encodedFunction2],
        descriptionHash,
        { gasLimit: 1000000 }
      );
      const proposeReceipt = await queueTx.wait(5);
    } catch (err) {
      console.log(err);
    }
  }

  async function executeProposal(signer, value, proposalDescription, address) {
    try {
      const governancetokencontract =
        contractAddresses["11155111"]["GovernanceToken"][0];
      const moralisGovernor =
        contractAddresses["11155111"]["MoralisGovernor"][0];

      const GovAbi = governancetokenABI.abi;
      const moralisGovernorAbi = moralisGovernorABI.abi;
      const moralisGovernorContractInstance = new ethers.Contract(
        moralisGovernor,
        moralisGovernorAbi,
        signer
      );

      const governancetokeninterface = new ethers.utils.Interface(GovAbi);

      const encodedFunction2 = governancetokeninterface.encodeFunctionData(
        "sendTokens",
        [address, value]
      );

      const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(proposalDescription)
      );
      // const hexHash = ethers.utils.hexlify(descriptionHash)

      const executeTx = await moralisGovernorContractInstance.execute(
        [governancetokencontract],
        [0],
        [encodedFunction2],
        descriptionHash,
        { gasLimit: 1000000 }
      );
      const proposeReceipt = await executeTx.wait(5);
    } catch (err) {
      console.log(err);
    }
  }

  return { queueProposal, executeProposal };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function useExecuteProposal() {
  async function queueProposal(signer, value, proposalDescription) {
    try {
      const boxContract = contractAddresses["11155111"]["Box"][0];
      const moralisGovernor =
        contractAddresses["11155111"]["MoralisGovernor"][0];
      const boxAbi = boxContractABI.abi;
      const moralisGovernorAbi = moralisGovernorABI.abi;
      const moralisGovernorContractInstance = new ethers.Contract(
        moralisGovernor,
        moralisGovernorAbi,
        signer
      );
      const boxInterface = new ethers.utils.Interface(boxAbi);
      const encodedFunction = boxInterface.encodeFunctionData("store", [value]);
      const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(proposalDescription)
      );

      const queueTx = await moralisGovernorContractInstance.queue(
        [boxContract],
        [0],
        [encodedFunction],
        descriptionHash,
        { gasLimit: 1000000 }
      );
      const proposeReceipt = await queueTx.wait(5);
    } catch (err) {
      console.log(err);
    }
  }

  async function executeProposal(signer, value, proposalDescription) {
    try {
      const boxContract = contractAddresses["11155111"]["Box"][0];
      const moralisGovernor =
        contractAddresses["11155111"]["MoralisGovernor"][0];
      const boxAbi = boxContractABI.abi;
      const moralisGovernorAbi = moralisGovernorABI.abi;
      const moralisGovernorContractInstance = new ethers.Contract(
        moralisGovernor,
        moralisGovernorAbi,
        signer
      );
      const boxInterface = new ethers.utils.Interface(boxAbi);
      const encodedFunction = boxInterface.encodeFunctionData("store", [value]);

      const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(proposalDescription)
      );
      // const hexHash = ethers.utils.hexlify(descriptionHash)

      const executeTx = await moralisGovernorContractInstance.execute(
        [boxContract],
        [0],
        [encodedFunction],
        descriptionHash,
        { gasLimit: 1000000 }
      );
      const proposeReceipt = await executeTx.wait(5);
    } catch (err) {
      console.log(err);
    }
  }

  return { queueProposal, executeProposal };
}
///////////////////////////////////
