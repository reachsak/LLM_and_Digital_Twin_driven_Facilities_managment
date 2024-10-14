import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { ethers } from "ethers";
import tokenLogo from "./token_logo.png";
import ethlogo from "./eth.png";
import contractABI from "../chain-info/contracts/MoralisGovernor.json";
import contractAddress from "../chain-info/deployments/map.json";
import contracttimelockABI from "../chain-info/contracts/TimeLock.json";
import Box from "@mui/material/Box";
import tokenABI from "../chain-info/contracts/GovernanceToken.json";
import NFTComponentdao from "./mmccdao";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
export const Treasury = () => {
  const timelockcontract = contractAddress["11155111"]["TimeLock"][0];
  const [account, setAccount] = useState("");
  const [tokenSupply, setTokenSupply] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [ethBalance, setEthBalance] = useState(null);
  const tokenContractAddress =
    contractAddress["11155111"]["GovernanceToken"][0];

  useEffect(() => {
    // Load DAO balance when component mounts
    handleCheckBalance();
  }, []); // Empty dependency array to trigger effect only once on mount

  const gourl = () => {
    const newURL = `https://sepolia.etherscan.io//token/tokenholderchart/${tokenContractAddress}`;

    window.open(newURL, "_blank");
  };
  const sample = () => {
    // Open the URL specified in the gourl function in a new tab
    console.log("placeholder");
  };
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x03171560292488897Be175ca23BC2333743c4F1A";
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  const handleCheckBalance = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = contractAddress["11155111"]["TimeLock"][0];
        const ABI = contracttimelockABI.abi;
        const contractInstance = new ethers.Contract(contract, ABI, signer);

        // Call the balance function from the contract to retrieve ETH balance
        const balance = await provider.getBalance(contract);

        // Convert balance from Wei to Ether
        const balanceInEth = ethers.utils.formatEther(balance);

        setEthBalance(balanceInEth);
      }
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  const handleViewContract = () => {
    // Construct the URL with the timelockcontract address
    const url = `https://sepolia.etherscan.io/address/${timelockcontract}`;
    // Open the URL in a new tab
    window.open(url, "_blank");
  };
  const handleTokenURL = () => {
    // Open the URL specified in the gourl function in a new tab
    gourl();
  };
  const getRemainingTokenSupply = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // Connect to your Ethereum provider
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        tokenABI.abi,
        provider
      );
      const totalSupply = await tokenContract.totalSupply();
      // If your token uses 18 decimal places (standard for most ERC20 tokens)
      // You might need to convert the total supply to its decimal representation
      // For example, if your token has 18 decimal places:
      const totalSupplyInDecimal = ethers.utils.formatUnits(totalSupply, 18);
      setTokenSupply(totalSupplyInDecimal);
      console.log("Total Supply:", totalSupplyInDecimal);
      // Now you can calculate remaining token supply based on your logic
      return totalSupplyInDecimal;
    } catch (error) {
      console.error("Error retrieving total supply:", error);
    }
  };
  useEffect(() => {
    // Function to fetch token supply
    const getTokenSupply = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new ethers.Contract(
          tokenContractAddress,
          tokenABI.abi,
          provider
        );
        const totalSupply = await tokenContract.totalSupply();
        // If your token uses 18 decimal places (standard for most ERC20 tokens)
        // You might need to convert the total supply to its decimal representation
        const totalSupplyInDecimal = ethers.utils.formatUnits(totalSupply, 18);
        console.log("Total Supply:", totalSupplyInDecimal);
        setTokenSupply(totalSupplyInDecimal); // Update state with token supply
      } catch (error) {
        console.error("Error retrieving total supply:", error);
      }
    };

    // Call the function to fetch token supply when the component mounts
    getTokenSupply();
  }, []); // Empty dependency array to trigger effect only once on mount

  return (
    <div>
      <Stack spacing={2} direction="row" justifyContent="center">
        <Box
          boxShadow={3}
          bgcolor="background.paper"
          p={2}
          className="retro-box"
          maxWidth="fit-content"
          margin="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
          mt={10}
        >
          <div>
            <h1 style={{ marginBottom: "-10px" }}>Finance </h1>
          </div>
          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <p
              style={{
                marginTop: "10px",
                marginBottom: "-20px",
                textAlign: "center",
                fontSize: "24px",
              }}
            >
              DAO ETH Balance:
            </p>
            {tokenSupply !== null && (
              <p
                style={{
                  margin: "-20px auto", // Adjusted margin
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {ethBalance !== null && <p> {ethBalance} ETH</p>}
              </p>
            )}
          </div>
          <div style={{ textAlign: "center", margin: "5px auto" }}>
            {" "}
            {/* Adjusted margin */}
            <img
              src={ethlogo}
              alt="Token Logo"
              style={{ width: "80px", height: "130x" }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <Box
              boxShadow={3}
              style={{ color: "black" }}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="fit-content" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={-1} // Center the content vertically
            >
              <Stack spacing={2} direction="row" justifyContent="center">
                <AwesomeButton type="primary" onPress={handleViewContract}>
                  See all transfer
                </AwesomeButton>
                <AwesomeButton type="whatsapp" onPress={handleViewContract}>
                  Deposit asset
                </AwesomeButton>
                <AwesomeButton type="danger" onPress={handleViewContract}>
                  Withdraw asset
                </AwesomeButton>
              </Stack>
            </Box>
          </div>
        </Box>
        <Box
          boxShadow={3}
          bgcolor="background.paper"
          p={2}
          className="retro-box"
          maxWidth="fit-content"
          margin="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
        >
          <div>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ marginBottom: "-10px" }}> Governance Token</h1>
            </div>
            <div style={{ textAlign: "center", marginBottom: "5px" }}>
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: "5px",
                  textAlign: "center",
                  fontSize: "24px",
                }}
              >
                Total Token Supply:
              </p>
              {tokenSupply !== null && (
                <p
                  style={{
                    margin: "5px auto", // Adjusted margin
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {parseFloat(tokenSupply).toFixed()}
                </p>
              )}
            </div>
            <div style={{ textAlign: "center", margin: "5px auto" }}>
              {" "}
              {/* Adjusted margin */}
              <img
                src={tokenLogo}
                alt="Token Logo"
                style={{ width: "110px", height: "100px" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <Box
                boxShadow={3}
                style={{ color: "black" }}
                bgcolor="background.paper"
                p={2}
                className="retro-box" // Add a class for retro style
                maxWidth="fit-content" // Set maximum width to fit the content
                margin="auto" // Center the box horizontally
                display="flex"
                flexDirection="column"
                alignItems="center" // Center the content vertically
              >
                {" "}
                <Stack spacing={2} direction="row" justifyContent="center">
                  <AwesomeButton type="primary" onPress={handleTokenURL}>
                    View token distribution
                  </AwesomeButton>
                  <AwesomeButton type="danger" onPress={handleViewContract}>
                    Transfer tokens
                  </AwesomeButton>
                </Stack>
              </Box>
            </div>
          </div>
        </Box>

        <Box
          boxShadow={3}
          bgcolor="background.paper"
          p={2}
          className="retro-box"
          maxWidth="fit-content"
          margin="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <div style={{ textAlign: "center" }}>
            <h1>Reputation NFT</h1>

            <p
              style={{
                marginTop: "-10px",
                marginBottom: "-20px",
                textAlign: "center",
                fontSize: "24px",
              }}
            >
              DAO NFT
            </p>
            <NFTComponentdao account={account} />
          </div>
          <div style={{ textAlign: "center" }}>
            <Box
              boxShadow={3}
              style={{ color: "black" }}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="fit-content" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={3}
              // Center the content vertically
            >
              {" "}
              <Stack spacing={2} direction="row" justifyContent="center">
                <AwesomeButton type="instagram" onPress={handleTokenURL}>
                  Mint WC NFT
                </AwesomeButton>
                <AwesomeButton type="danger" onPress={handleViewContract}>
                  Mint PL NFT
                </AwesomeButton>
                <AwesomeButton type="messenger" onPress={handleTokenURL}>
                  Mint UCL NFT
                </AwesomeButton>
                <AwesomeButton type="github" onPress={handleViewContract}>
                  Mint EU NFT
                </AwesomeButton>
              </Stack>
            </Box>
          </div>
        </Box>
      </Stack>
    </div>
  );
};
