import CssBaseline from "@mui/material/CssBaseline";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import contractABI from "../chain-info/contracts/MoralisGovernor.json";
import tokencontractABI from "../chain-info/contracts/GovernanceToken.json";
import contractAddress from "../chain-info/deployments/map.json";
import contracttimelockABI from "../chain-info/contracts/TimeLock.json";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { ethers } from "ethers";
import TextField from "@mui/material/TextField";
import NFTABI from "../chain-info/contracts/MyTokennew.json";
import Card from "@mui/material/Card";
import { VoteProposal } from "./VoteBox";
import { ExecuteProposal } from "./ExecuteBox";
import { useGetTotalVoters } from "../web3/GetVotersCount";
import { useGetProposals } from "../web3/GetProposalCount";
import WebPagedigitaltwin from "./webpagedigitaltwin";
import Bookingsys from "./bookingsys";
import FileUpload from "./FileUpload";
import Upload from "./Upload.json";
import Display from "./Display";
import "./Display.css";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
export const X = ({
  boxValue,
  getValue,
  userBalance,
  getBalance,
  signer,
  requestFunds,
  createProposal,
  proposal,
  newValue,
  proposalDescription,
}) => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [shortId, setShortId] = useState();
  const [propDesc, setPropDesc] = useState();
  const [propValue, setPropValue] = useState();

  const { voters, getVoters } = useGetTotalVoters();
  const { proposalCount, getProposalCount } = useGetProposals();
  const [tokenIdToBurn, setTokenIdToBurn] = useState("");
  const [transferFromAddress, setTransferFromAddress] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [tokenIdToTransfer, setTokenIdToTransfer] = useState("");

  const [params, setParams] = useState({
    proposalDescription: localStorage.getItem("proposalDescription") || "",
    proposalAmount: localStorage.getItem("proposalAmount") || 0,
  });
  const [tokenId, setTokenId] = useState("");
  const [uri, setUri] = useState("");
  const handleTokenIdChange = (event) => {
    setTokenId(event.target.value);
  };
  const handleTokenIdToBurnChange = (event) => {
    setTokenIdToBurn(event.target.value);
  };

  const handleBurn = async () => {
    try {
      if (window.ethereum && tokenIdToBurn) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const nftContractAddress = contractAddress["11155111"]["MyTokennew"][0]; // Replace with your actual contract address
        const nftContractInstance = new ethers.Contract(
          nftContractAddress,
          NFTABI.abi,
          signer
        );

        // Call the burn function from the contract
        await nftContractInstance.burn(tokenIdToBurn);

        alert("NFT burned successfully!");

        // Clear input field after burning NFT
        setTokenIdToBurn("");
      } else {
        alert("Please fill all the fields.");
      }
    } catch (error) {
      console.error("Error burning NFT:", error);
    }
  };

  const handleUriChange = (event) => {
    setUri(event.target.value);
  };

  const handleSafeMint = async () => {
    try {
      if (window.ethereum && recipientAddress && tokenId && uri) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const nftContractAddress = contractAddress["11155111"]["MyTokennew"][0]; // Replace with your actual contract address
        const nftContractInstance = new ethers.Contract(
          nftContractAddress,
          NFTABI.abi,
          signer
        );

        // Call the safeMint function from the contract
        await nftContractInstance.safeMint(recipientAddress, tokenId, uri);

        alert("NFT minted successfully!");

        // Clear input fields after minting NFT
        setRecipientAddress("");
        setTokenId("");
        setUri("");
      } else {
        alert("Please fill all the fields.");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
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

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  useEffect(() => {
    getValue();
  }, [boxValue]);
  useEffect(() => {
    setShortId(proposal ? proposal.slice(0, 11) + "..." : "0");
  }, [proposal]);
  useEffect(() => {
    getVoters();
  }, []);
  useEffect(() => {
    getProposalCount();
  }, []);
  useEffect(() => {
    if (signer) {
      getBalance(signer["_address"]);
    }
  }, [signer]);

  const handleParamsChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const updateParams = () => {
    setPropDesc(
      proposalDescription
        ? proposalDescription
        : localStorage.getItem("proposalDescription")
    );
    setPropValue(newValue ? newValue : localStorage.getItem("proposalAmount"));
  };
  const timelockcontract = contractAddress["11155111"]["TimeLock"][0];
  const [recipientAddress, setRecipientAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [ethBalance, setEthBalance] = useState(null);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [MemberAddresstodelete, deleteMemberAddress] = useState("");

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleEthAmountChange = (event) => {
    setEthAmount(event.target.value);
  };
  const gourl = () => {
    const newURL =
      "https://sepolia.etherscan.io/token/0xd0bcD44A1f11E96C06aBF08f973A775e1c09FecE";
    window.open(newURL, "_blank"); // '_blank' parameter specifies that the URL should open in a new window/tab
  };
  const handleCheckBalance = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = contractAddress["11155111"]["TimeLock"][0];
        // const contract1 = contractAddress["11155111"]["TimeLock"][0];
        // console.log(contract1);
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
  const handleRemoveMember = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = contractAddress["11155111"]["MoralisGovernor"][0];

        const ABI = contractABI.abi;
        const contractinstance = new ethers.Contract(contract, ABI, signer);
        let tx = await contractinstance.removeMember(MemberAddresstodelete);
        await tx.wait();
        alert("Member removed successfully!");
        setNewMemberAddress(""); // Clear the input field after removing member
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleAddressremove = (event) => {
    deleteMemberAddress(event.target.value);
  };
  const handleAddMember = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = contractAddress["11155111"]["MoralisGovernor"][0];
        const ABI = contractABI.abi;
        const contractinstance = new ethers.Contract(contract, ABI, signer);
        let tx = await contractinstance.addMember(newMemberAddress);
        await tx.wait();
        alert("New member added successfully!");
        setNewMemberAddress(""); // Clear the input field after adding member
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleAddressChange = (event) => {
    setNewMemberAddress(event.target.value);
  };

  const handleSendEth = async () => {
    try {
      if (window.ethereum && recipientAddress && ethAmount) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const daocontract = contractAddress["11155111"]["TimeLock"][0];
        console.log(daocontract);

        const ABI = contractABI.abi;
        const contractInstance = new ethers.Contract(daocontract, ABI, signer);

        // Convert ethAmount to Wei
        const amountInWei = ethers.utils.parseEther(ethAmount);

        // Call the sendEther function from the contract
        await contractInstance.sendEther(recipientAddress, amountInWei);

        alert("ETH sent successfully!");

        // Clear input fields after sending ETH
        setRecipientAddress("");
        setEthAmount("");
      } else {
        alert("Please fill all the fields.");
      }
    } catch (error) {
      console.error("Error sending ETH:", error);
    }
  };

  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <div className="presentation-container">
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
          mb={4}
        >
          <h1>To do list</h1>
          <p>
            🤖✅crew AI with , a group of AI have their own function tool. We
            can use function calling to activate the crew script, let them works
            on task, like analysis temp data in house
          </p>
          <p1>
            https://docs.crewai.com/core-concepts/Tools/#using-crewai-tools
          </p1>
          <p>🤖try ollamarag again</p>
          <p1>https://otmaneboughaba.com/posts/local-rag-api/</p1>
          <p>🤖✅RAG CHAT app with history for both TEXT and Image</p>
          <p>🤖✅Javascript RAG web app 🔴</p>
          <p>
            🤖🤖🤖 🤖🤖🤖 🤖🤖🤖 🤖🤖🤖 🤖🤖🤖 🤖🤖🤖 🤖🤖🤖 🤖🤖🤖 🤖🤖🤖
            🤖🤖🤖 🤖🤖🤖 🤖🤖🤖
          </p>
          <p>🤖🤖🤖Live AI for maintenance, with alert and function</p>
          <p>
            🤖AI LSTM , DL, RL, for automation facility, predication control
          </p>

          <p>
            🤖🤖🤖AI agent, tell ,bring visaulization of building enviroment
            from blockchain CSV file
          </p>
          <p1>🤖🅿️AI agent assisted DAO governance, Vote, Propose, execute</p1>
          <p>🔵emergency alert function for construction FM</p>

          <p1>🅿️CROSS CHAIN NFT TOKEN </p1>
          <p1>🅿️CROSS CHAIN DAO </p1>
          <p1>🅿️https://github.com/jboetticher/cross-chain-dao </p1>
          <p1>🅿️https://github.com/LayerZero-Labs/LayerZero-v2 </p1>
          <p1>
            🅿️https://docs.moonbeam.network/tutorials/interoperability/cross-chain-dao/{" "}
          </p1>

          <p>⚙️🔥Raspberry Pi and Sensor Done, Autodesk Tandem </p>
          <p>building control integration </p>
          <p>current TOKEN id 8</p>
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
          mb={4}
        >
          <div
            className="pres-buttons"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* Center the buttons horizontally */}
            <AwesomeButton
              type="primary"
              onPress={() => {
                window.open(
                  "https://tandem.autodesk.com/pages/facilities/urn:adsk.dtt:LudKiyWAQcCPqK2gQWxNfw/views/NFeai8pZR_GPMuNXPzY57g",
                  "_blank"
                );
              }}
            >
              Digital Twin
            </AwesomeButton>
            <AwesomeButton
              type="danger"
              onPress={() => {
                setActiveTab(9);
              }}
            >
              Autodesk Tandem
            </AwesomeButton>
            <AwesomeButton
              type="facebook"
              onPress={() => {
                window.open("http://localhost:9000/", "_blank");
              }}
            >
              Occupancy
            </AwesomeButton>
            <AwesomeButton
              type="whatsapp"
              onPress={() => {
                window.open("http://localhost:5173/", "_blank");
              }}
            >
              Reservation system
            </AwesomeButton>
            {activeTab === 9 && (
              <div>
                {" "}
                <WebPagedigitaltwin />
              </div>
            )}
          </div>
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
          mb={4}
        >
          <h1>Function</h1>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={handleRecipientAddressChange}
              placeholder="Enter recipient address"
            />
          </label>
          <br />
          <label>
            ETH Amount:
            <input
              type="text"
              value={ethAmount}
              onChange={handleEthAmountChange}
              placeholder="Enter ETH amount"
            />
          </label>
          <br />
          <button onClick={handleSendEth}>Send ETH from DAO </button>
          <div>
            <input
              type="text"
              value={newMemberAddress}
              onChange={handleAddressChange}
              placeholder="Enter new member address"
            />
            <button onClick={handleAddMember}>Add Member</button>
          </div>
          <div>
            <input
              type="text"
              value={MemberAddresstodelete}
              onChange={handleAddressremove}
              placeholder="Enter new member address to be removed"
            />
            <button onClick={handleRemoveMember}>Remove Member</button>
          </div>
        </Box>
        {activeTab === 0 && (
          <div style={{ textAlign: "center" }}>
            <h2>The state of the DAO</h2>
            <p>The current Value of the Box is: </p>
            <h2>{boxValue}</h2>
          </div>
        )}
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
            mb={4}
          >
            <h1>Mint NFT</h1>
            <label>
              Recipient Address:
              <input
                type="text"
                value={recipientAddress}
                onChange={handleRecipientAddressChange}
                placeholder="Enter recipient address"
              />
            </label>
            <br />
            <label>
              Token ID:
              <input
                type="number"
                value={tokenId}
                onChange={handleTokenIdChange}
                placeholder="Enter token ID"
              />
            </label>
            <br />
            <label>
              URI:
              <input
                type="text"
                value={uri}
                onChange={handleUriChange}
                placeholder="Enter URI"
              />
            </label>
            <br />
            <button onClick={handleSafeMint}>Mint NFT</button>
          </Box>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label>
            Token ID to Burn:
            <input
              type="text"
              value={tokenIdToBurn}
              onChange={handleTokenIdToBurnChange}
              placeholder="Enter Token ID"
            />
          </label>
          <button onClick={handleBurn}>Burn NFT</button>
        </div>

        <div>
          {" "}
          <div>
            {" "}
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
            >
              <h1>Booking system</h1>
              <Bookingsys />
            </Box>
          </div>
        </div>
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
        >
          <h1>My LLM/VLM</h1>
          <h1>Ollama</h1>
          <p1> ollama run mistral:7b-instruct-v0.2-fp16</p1>
          <p1>ollama run llava:34b</p1>
          <p1>ollama run sharegpt4v</p1>
          <p1>ollama run dolphin-mixtral:8x7b-v2.7-q3_K_L</p1>
          <p1> ollama run mxbai-embed-large</p1>
          <p1>
            from langchain_experimental.open_clip import OpenCLIPEmbeddings
          </p1>
          <h1>LLaMa.cpp</h1>
          <p1>
            ./llamafile-server-0.2.1 -m
            weight/Meta-Llama-3-8B-Instruct.Q8_0.gguf
          </p1>

          <p1>ShareGPTV13b</p1>
          <p1>
            ./llamafile-server-0.2.1 -m weight/ggml-model-Q4_K.gguf --mmproj
            weight/mmproj-model-f162.gguf
          </p1>
          <h1>Function Calling</h1>
          <p1>
            ./llamafile-server-0.2.1 -m
            weight/Meta-Llama-3-8B-Instruct.Q8_0.gguf
          </p1>
          <p1>
            ./llamafile-server-0.2.1 -m
            weight/gorilla-openfunctions-v2-q6_K.gguf
          </p1>
          <p1>
            ./llamafile-server-0.2.1 -m weight/Hermes-2-Pro-Mistral-7B.Q8_0.gguf
          </p1>
          <p1>
            ./llamafile-server-0.2.1 -m weight/natural-functions.Q8_0.gguf
          </p1>
          <p1>
            ./llamafile-server-0.2.1 -m
            weight/Hermes-2-Pro-Mistral-10.7B-Q8_0.gguf
          </p1>
        </Box>
      </div>
    </>
  );
};
