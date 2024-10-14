import React, { useState, useEffect } from "react";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
import { ethers } from "ethers";
import Stack from "@mui/material/Stack";
import { fetchJsonFromIpf } from "./mmcc";
import Grid from "@mui/material/Grid";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import contractABI from "../chain-info/contracts/MoralisGovernor.json";
import tokencontractABI from "../chain-info/contracts/GovernanceToken.json";
import contractAddress from "../chain-info/deployments/map.json";
import MyComponent from "./mc";
import Appp from "./mcc";
import NFTComponent from "./mmcc";
import Box from "@mui/material/Box";
import axios from "axios";
import tokenLogo from "./token_logo.png";
import NFTABI from "../chain-info/contracts/MyTokennew.json";
export const Member = () => {
  const [members, setMembers] = useState([]);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [MemberAddresstodelete, deleteMemberAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [memberBalances, setMemberBalances] = useState({});
  const [memberNFTs, setMemberNFTs] = useState({});
  const [nftMetadata, setNftMetadata] = useState({});
  const [signer, setsigner] = useState({});
  const [nftImages, setNftImages] = useState([]);
  const nftContractAddress = "0xFE4A2b15703B37c72F6c41d3f1Ff2a876207C541";
  const axios = require("axios");
  const colors = [
    "#E38627",
    "#C13C37",
    "#6A2135",
    "#63C132",
    "#327EC1",
    "#C16332",
  ]; // Add more colors if needed

  // Your existing useEffect hooks...

  // Create data array for the pie chart
  const pieChartData = Object.keys(memberBalances).map((member) => ({
    name: member, // Member address as name
    value: parseFloat(memberBalances[member]), // Balance as value
  }));

  const userAddress = "0xD760A17210b61900F696ad0C21a6e11dc8884198";
  const nftContractInstance = new ethers.Contract(
    nftContractAddress,
    NFTABI.abi,
    provider
  );
  //0x723397FCbfFdF24f1E2B9F1B2bD8254eef2898c6
  const handleFetchNFTMetadata = async () => {
    try {
      await fetchNFTMetadata();
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  };
  async function fetchNFTMetadata() {
    try {
      if (provider && members.length > 0) {
      }
      const nftContractAddress = "0xf579B4BDc91089758F555178044dEfB2Cb21205c";
      const nftContractInstance = new ethers.Contract(
        nftContractAddress,
        NFTABI.abi,
        provider
      );
      console.log("hi");

      const totalSupply = await nftContractInstance.totalSupply();

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = i;
        const owner = await nftContractInstance.ownerOf(tokenId);

        if (owner === account) {
          const tokenURI = await nftContractInstance.tokenURI(tokenId);
          console.log(`Token ID: ${tokenId}, Token URI: ${tokenURI}`);
        }
      }
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  }
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
        setsigner(signer);
        const address = await signer.getAddress();
        setAccount(address);

        //console.log(contract);

        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  useEffect(() => {
    async function fetchNFTs() {
      const totalTokens = await nftContractInstance.balanceOf(userAddress);
      const images = [];
      for (let i = 0; i < totalTokens.toNumber(); i++) {
        const tokenId = await nftContractInstance.tokenOfOwnerByIndex(
          userAddress,
          i
        );
        const tokenURI = await nftContractInstance.tokenURI(tokenId);
        images.push(tokenURI);
      }
      setNftImages(images);
    }
    fetchNFTs();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
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
          setProvider(provider);
        } else {
          console.error("Metamask is not installed");
        }
      } catch (error) {
        console.error("Error fetching account and provider:", error);
      }
    }
    fetchData();
  }, []);
  const sample = () => {
    // Open the URL specified in the gourl function in a new tab
    console.log("placeholder");
  };

  // Fetch members and balances when provider changes
  useEffect(() => {
    async function fetchMembersAndBalances() {
      try {
        if (provider) {
          const contract = contractAddress["11155111"]["MoralisGovernor"][0];
          const ABI = contractABI.abi;
          const contractInstance = new ethers.Contract(contract, ABI, provider);
          const membersArray = await contractInstance.getMembers();
          setMembers(membersArray);

          const tokenContractAddress =
            contractAddress["11155111"]["GovernanceToken"][0];
          const tokenContractABI = tokencontractABI.abi;
          const tokenContractInstance = new ethers.Contract(
            tokenContractAddress,
            tokenContractABI,
            provider
          );
          const balances = {};
          const nfts = {};
          for (const member of membersArray) {
            const balance1 = await tokenContractInstance.balanceOf(member);
            const balance = balance1 / 1000000000000000000;
            balances[member] = balance.toString(); // Convert BigNumber to string for easier handling
          }
          setMemberBalances(balances);
          setMemberNFTs(nfts);
        }
      } catch (error) {
        console.error("Error fetching members and balances:", error);
      }
    }
    fetchMembersAndBalances();
  }, [provider]);
  useEffect(() => {
    async function fetchNFTMetadata() {
      try {
        if (provider) {
          const contract = contractAddress["11155111"]["MoralisGovernor"][0];
          const ABI = contractABI.abi;
          const contractInstance = new ethers.Contract(contract, ABI, provider);
          const membersArray = await contractInstance.getMembers();

          setMembers(membersArray);

          const tokenContractAddress =
            contractAddress["11155111"]["GovernanceToken"][0];
          const tokenContractABI = tokencontractABI.abi;
          const tokenContractInstance = new ethers.Contract(
            tokenContractAddress,
            tokenContractABI,
            provider
          );
          const balances = {};
          const nfts = {};
          for (const member of membersArray) {
            const balance1 = await tokenContractInstance.balanceOf(member);
            const balance = balance1 / 1000000000000000000;
            balances[member] = balance.toString(); // Convert BigNumber to string for easier handling

            // Check if member owns NFT
            const nftContractAddress =
              contractAddress["11155111"]["MyTokennew"][0];
            const nftContractInstance = new ethers.Contract(
              nftContractAddress,
              NFTABI.abi,
              provider
            );
            const nftBalance = await nftContractInstance.balanceOf(member);
            nfts[member] = nftBalance > 0;
          }
          setMemberBalances(balances);
          setMemberNFTs(nfts); // Update memberNFTs state
        }
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
      }
    }

    fetchNFTMetadata();
  }, [provider, members, memberNFTs]);

  return (
    <div>
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        p={2}
        className="retro-box" // Add a class for retro style
        maxWidth="fit-content" // Set maximum width to fit the content
        margin="auto" // Center the box horizontally
        display="flex"
        flexDirection="column"
        alignItems="center" // Center the content vertically
        mt={2}
      >
        {" "}
        <Stack spacing={2} direction="row" justifyContent="center">
          <AwesomeButton type="linkedin" onPress={sample}>
            Add member
          </AwesomeButton>
          <AwesomeButton type="danger" onPress={sample}>
            Remove member
          </AwesomeButton>
        </Stack>
      </Box>
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        p={2}
        className="retro-box" // Add a class for retro style
        maxWidth="fit-content" // Set maximum width to fit the content
        margin="auto" // Center the box horizontally
        display="flex"
        flexDirection="column"
        alignItems="center" // Center the content vertically
        mt={2}
      >
        <h1>DAO members</h1>
        <div>
          <span style={{ marginRight: "100px", fontWeight: "bold" }}>
            Address
          </span>
          &nbsp;
          <span style={{ marginLeft: "280px", fontWeight: "bold" }}>
            Governance Token
          </span>
        </div>
        {members.map((member, index) => (
          <Grid container spacing={2} alignItems="center" key={index}>
            <Grid item xs={8}>
              {/* Adjust width of user box */}
              <Box
                boxShadow={4}
                bgcolor="background.default"
                p={2}
                mb={0} // Reduce margin-bottom for user box
                borderRadius={8} // Add border radius for a rounded look
                style={{ width: "100%" }} // Adjust width to fill the container
              >
                <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>
                  {member}
                </h2>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {/* Adjust width of token balance box */}
              <Box
                boxShadow={1}
                bgcolor="background.default"
                p={2}
                mt={-1} // Reduce margin-top for token balance box
                borderRadius={8} // Add border radius for a rounded look
                style={{ width: "80%" }} // Adjust width to fill the container
              >
                <img
                  src={tokenLogo}
                  alt="Token Logo"
                  style={{
                    width: "55px",
                    height: "50px",
                    verticalAlign: "middle",
                  }}
                />
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: "1px",
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor(memberBalances[member])} BFHT
                </p>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* <div>
        {
          <Box
            boxShadow={3}
            bgcolor="background.paper"
            p={2}
            className="retro-box" // Add a class for retro style
            maxWidth="fit-content" // Set maximum width to fit the content
            margin="auto" // Center the box horizontally
            display="flex"
            flexDirection="column"
            alignItems="center" // Center the content vertically
            mt={10}
          >
            <PieChart width={2000} height={1000}>
              <Pie
                data={pieChartData}
                cx={500}
                cy={500}
                outerRadius={200}
                fill="#8884d8"
                label={({ name, value }) => `${name} (${value})`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </Box>
        }
      </div> */}
      <div>
        {/* Existing JSX code... */}

        {/* Button to fetch NFT metadata */}
        {/* <button onClick={handleFetchNFTMetadata}>Fetch NFT Metadata</button> */}

        {/* Existing JSX code... */}
      </div>
    </div>
  );
};
