// import { ethers } from "ethers";
// import { useState } from "react";
// import axios from "axios";

// export function useGetBalance() {
//   const [userBalance, setUserBalance] = useState();

//   async function getBalance(walletAddress) {
//     await axios
//       .get(`/get_balance?address=${walletAddress}`)
//       .then((res) => {
//         const balance = res.data[0].balance;
//         const decimals = 18;
//         const balanceInMRST = ethers.utils.formatUnits(balance, decimals);
//         setUserBalance(balanceInMRST);
//       })
//       .catch((err) => console.log(err));
//   }

//   return { userBalance, getBalance };
// }

////////////////////////////////////////////////////////////////
import { useState } from "react";
import { ethers } from "ethers";

import gcontractABI from "../chain-info/contracts/MoralisGovernor.json";
import tokencontractABI from "../chain-info/contracts/GovernanceToken.json";
import contractAddress from "../chain-info/deployments/map.json";

export function useGetBalance() {
  const [userBalance, setUserBalance] = useState();

  async function getBalance(walletAddress) {
    try {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Instantiate the contract using its ABI and address
      const tokenabi = tokencontractABI.abi;
      const tokenAddress = contractAddress["11155111"]["GovernanceToken"][0];
      const contract = new ethers.Contract(tokenAddress, tokenabi, provider);

      // Call the contract's balanceOf function to get the balance
      const balance = await contract.balanceOf(walletAddress);

      // Format the balance (assuming 18 decimal places)
      const balanceInMRST = ethers.utils.formatUnits(balance, 18);

      // Set the user balance state
      setUserBalance(balanceInMRST);
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  }

  return { userBalance, getBalance };
}
