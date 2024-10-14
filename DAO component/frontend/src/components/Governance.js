import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import contractABI from "../chain-info/contracts/MoralisGovernor.json";
import contractAddress from "../chain-info/deployments/map.json";
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { ethers } from "ethers";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { VoteProposal } from "./VoteBox";
import { ExecuteProposal } from "./ExecuteBox";
import { ExecuteProposalsendtoken } from "./ExecuteBox";
import { useGetTotalVoters } from "../web3/GetVotersCount";
import { useGetProposals } from "../web3/GetProposalCount";
import FileUpload from "./FileUpload";
import Upload from "./Upload.json";
import Display from "./Display";
import "react-awesome-button/dist/styles.css";
import { useCreateProposal } from "../web3/NewProposal";
import { useGetproposaltype } from "../web3/useGetState";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
export const Governance = ({
  boxValue,
  getValue,
  userBalance,
  getBalance,
  signer,
  requestFunds,
  createProposal,
  createProposalsendtoken,
  createProposalsendEther,
  createProposalremovemember,
  createProposaladdmember,
  createProposalmintnft,
  address,
  proposal,
  cal,

  newValue,
  proposalDescription,
}) => {
  const { getProposaltype } = useGetproposaltype();
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [shortId, setShortId] = useState();
  const [propDesc, setPropDesc] = useState();
  const [propValue, setPropValue] = useState();
  const [propAddress, setAddress] = useState();
  const [outputText, setOutputText] = useState("");
  const [members, setMembers] = useState([]);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [MemberAddresstodelete, deleteMemberAddress] = useState("");

  const { voters, getVoters } = useGetTotalVoters();
  const { proposalCount, getProposalCount } = useGetProposals();
  const updateOutputText = (text) => {
    setOutputText(text);
  };

  const [params, setParams] = useState({
    proposalDescription: localStorage.getItem("proposalDescription") || "",
    proposalAmount: localStorage.getItem("proposalAmount") || 0,
    address: localStorage.getItem("address") || "",
  });
  const [proposalType, setProposalType] = useState("default");

  const getThetype = async () => {
    const type = await getProposaltype();
    setProposalType(type);
  };
  useEffect(() => {
    getThetype();
  }, [proposalType]);

  // Function to handle proposal creation

  const requestAndUpdateBalance = async () => {
    await requestFunds(signer);
    await getBalance(signer["_address"]);
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
    setAddress(address ? address : localStorage.getItem("address"));
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
        alert("New member added successfully!");
        setNewMemberAddress(""); // Clear the input field after adding member
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleAddressremove = (event) => {
    deleteMemberAddress(event.target.value);
  };

  return (
    <>
      <Box
        boxShadow={3}
        style={{ color: "black" }}
        bgcolor="#f5f5f5"
        p={2}
        className="retro-box" // Add a class for retro style
        maxWidth="fit-content" // Set maximum width to fit the content
        margin="auto" // Center the box horizontally
        display="flex"
        flexDirection="column"
        alignItems="center" // Center the content vertically
        mt={10}
      >
        <div>
          <Typography variant="h6" align="center" color="white" component="p">
            <div>
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
                <Stack spacing={2} direction="row" justifyContent="center">
                  <AwesomeButton
                    type="linkedin"
                    onPress={() => {
                      setActiveTab(6);
                    }}
                  >
                    New Proposal
                  </AwesomeButton>
                  <AwesomeButton
                    type="whatsapp"
                    onPress={() => {
                      setActiveTab(3);
                    }}
                  >
                    Vote
                  </AwesomeButton>
                  <AwesomeButton
                    type="danger"
                    onPress={() => {
                      updateParams();
                      setActiveTab(4);
                    }}
                  >
                    Execute
                  </AwesomeButton>
                  <AwesomeButton
                    type="twitter"
                    onPress={() => {
                      setActiveTab(5);
                    }}
                  >
                    AI Proposal Generator
                  </AwesomeButton>
                  <AwesomeButton
                    type="github"
                    onPress={() => {
                      setActiveTab(5);
                    }}
                  >
                    Previous Proposal
                  </AwesomeButton>
                </Stack>
              </Box>
              <div>
                {activeTab === 0 && (
                  <div>
                    <h2 style={{ color: "black" }}>
                      Welcome to the building CPS DAO
                    </h2>
                    <p style={{ color: "black" }}>BFH DAO</p>
                  </div>
                )}
                {activeTab === 100 && (
                  <div>
                    <h2 style={{ color: "black" }}>The state of the DAO</h2>
                    <p style={{ color: "black" }}>
                      The current Value of the Box is:{" "}
                    </p>
                    <h2 style={{ color: "black" }}>{boxValue}</h2>
                  </div>
                )}
                {activeTab === 1 && (
                  <div>
                    <h2 style={{ color: "black" }}>
                      Get Funds to Participate on the DAO
                    </h2>
                    <p style={{ color: "black" }}>
                      Only the owners of the ERC20 Token can Vote
                    </p>

                    <Button
                      variant="contained"
                      onClick={requestAndUpdateBalance}
                    >
                      Get Funds
                    </Button>
                  </div>
                )}
                {activeTab === 2 && (
                  <div style={{ display: "flex" }}>
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
                      style={{ marginRight: "10px", color: "black" }} // Add spacing between retro boxes
                    >
                      <div>
                        <h2>Propose a new Execution</h2>
                        <p>
                          The Dao members will vote to decide what happens next
                        </p>

                        <p> Last proposal: {shortId} </p>

                        <div className="prop-card">
                          <Box
                            component="form"
                            sx={{
                              "& > :not(style)": { m: 1, width: "25ch" },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-basic"
                              label="Proposal Description"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalDescription}
                              name="proposalDescription"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                            <TextField
                              id="outlined-basic"
                              label="Proposal Value"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalAmount}
                              name="proposalAmount"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                          </Box>
                        </div>
                        <AwesomeButton
                          type="facebook"
                          onPress={() => {
                            createProposal(
                              signer,
                              params.proposalDescription,
                              params.proposalAmount
                            );
                            localStorage.setItem(
                              "proposalDescription",
                              params.proposalDescription
                            );
                            localStorage.setItem(
                              "proposalAmount",
                              params.proposalAmount
                            );
                            setProposalType("default");
                          }}
                        >
                          Create Proposal
                        </AwesomeButton>
                      </div>
                    </Box>
                  </div>
                )}
                {activeTab === 3 && (
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
                    <div>
                      <h2 style={{ color: "black" }}>Vote </h2>
                      <p style={{ color: "black" }}>
                        Vote and engage with the DAO
                      </p>
                      <Box sx={{ minWidth: 275 }}>
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
                          <VoteProposal lastId={proposal} signer={signer} />
                        </Box>
                      </Box>

                      <Display
                        contract={contract}
                        account={account}
                        propDesc={proposalDescription}
                      ></Display>
                    </div>
                  </Box>
                )}
                {activeTab === 4 && (
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
                    <div>
                      <h2 style={{ color: "black" }}>Queue & Execute</h2>
                      <p style={{ color: "black" }}>
                        Vote Period has Finished, time to execute!
                      </p>
                      <Box sx={{ minWidth: 275 }}>
                        <Card variant="outlined">
                          {proposalType === "changevalue" ? (
                            <ExecuteProposal
                              signer={signer}
                              lastId={proposal}
                              value={propValue}
                              description={propDesc}
                            />
                          ) : proposalType === "sendtoken" ? (
                            <ExecuteProposalsendtoken
                              signer={signer}
                              lastId={proposal}
                              value={propValue}
                              address={propAddress}
                              description={propDesc}
                            />
                          ) : (
                            <ExecuteProposal
                              signer={signer}
                              lastId={proposal}
                              value={propValue}
                              description={propDesc}
                            />
                          )}
                        </Card>
                      </Box>
                    </div>
                  </Box>
                )}
                {activeTab === 5 && (
                  <div>
                    {" "}
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
                      <FileUpload
                        account={account}
                        provider={provider}
                        contract={contract}
                        updateOutputText={updateOutputText}
                      />
                    </Box>
                    <div>
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
                        <p>AI-Generated Prompt</p>
                        <Typography
                          sx={{
                            fontFamily: "Jost, sans-serif",
                            textAlign: "justify",
                            textJustify: "inter-word",
                          }}
                        >
                          {outputText}
                        </Typography>
                      </Box>
                    </div>
                  </div>
                )}
                {/* This is where we write action for each proposal  */}
                {activeTab === 7 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 1</p>
                    </Box>
                  </div>
                )}
                {activeTab === 8 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 2</p>
                    </Box>
                  </div>
                )}
                {activeTab === 9 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 3</p>
                    </Box>
                  </div>
                )}
                {activeTab === 10 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 4</p>
                    </Box>
                  </div>
                )}
                {activeTab === 11 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 5</p>
                    </Box>
                  </div>
                )}
                {activeTab === 12 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 6</p>
                    </Box>
                  </div>
                )}
                {activeTab === 13 && (
                  <div>
                    {" "}
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
                      <p>This is proposal 6</p>
                    </Box>
                  </div>
                )}
                {activeTab === 14 && (
                  <div>
                    {" "}
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
                      <AwesomeButton
                        type="secondary"
                        style={{ marginBottom: "10px" }}
                        onPress={() => {
                          setActiveTab(2);
                        }}
                      >
                        Smart Light
                      </AwesomeButton>
                      <AwesomeButton
                        type="secondary"
                        style={{ marginBottom: "10px" }}
                        onPress={() => {
                          setActiveTab(2);
                        }}
                      >
                        Air Purifier
                      </AwesomeButton>
                      <AwesomeButton
                        type="secondary"
                        style={{ marginBottom: "10px" }}
                        onPress={() => {
                          setActiveTab(2);
                        }}
                      >
                        Heater
                      </AwesomeButton>
                      <AwesomeButton
                        type="secondary"
                        style={{ marginBottom: "10px" }}
                        onPress={() => {
                          setActiveTab(2);
                        }}
                      >
                        Air Condition
                      </AwesomeButton>
                      <AwesomeButton
                        type="secondary"
                        style={{ marginBottom: "10px" }}
                        onPress={() => {
                          setActiveTab(2);
                        }}
                      >
                        Humidifier
                      </AwesomeButton>
                    </Box>
                  </div>
                )}

                {activeTab === 6 && (
                  <div>
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
                      <div>
                        <p>Select an action</p>
                        <Stack
                          spacing={2}
                          direction="column" // Change direction to "column"
                          alignItems="center" // Align items to center vertically
                        >
                          <AwesomeButton
                            type="primary"
                            onPress={() => {
                              setActiveTab(13);
                            }}
                          >
                            New Policy
                          </AwesomeButton>
                          <AwesomeButton
                            type="primary"
                            onPress={() => {
                              setActiveTab(14);
                            }}
                          >
                            Update building automation settings
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(18);
                            }}
                          >
                            Transfer assets
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(15);
                            }}
                          >
                            Mint Tokens
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              updateParams();
                              setActiveTab(11);
                            }}
                          >
                            Mint NFT
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(12);
                            }}
                          >
                            Upgrade DAO smart contract
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(17);
                              getValue();
                            }}
                          >
                            Add member
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(16);
                            }}
                          >
                            Remove Member
                          </AwesomeButton>
                        </Stack>
                      </div>
                    </Box>
                    <div></div>
                  </div>
                )}
                {activeTab === 15 && (
                  <div style={{ display: "flex" }}>
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
                      style={{ marginRight: "10px", color: "black" }} // Add spacing between retro boxes
                    >
                      <div>
                        <h2>Mint Tokens</h2>
                        <p>
                          Enter the amount of DAO tokens and address of the
                          reciepient
                        </p>

                        <div className="prop-card">
                          <Box
                            component="form"
                            sx={{
                              display: "flex", // Set display to flex
                              flexDirection: "column", // Arrange items in a column
                              justifyContent: "center", // Align items horizontally in the center
                              alignItems: "center", // Align items vertically in the center
                              gap: 1, // Add some gap between items
                              "& > :not(style)": { width: "25ch" }, // Adjust width if needed
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-basic"
                              label="Proposal Description"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalDescription}
                              name="proposalDescription"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                            <TextField
                              id="outlined-basic"
                              label="Amount of Tokens"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalAmount}
                              name="proposalAmount"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                            <TextField
                              id="outlined-basic"
                              label="Reciepient address"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.address}
                              name="address"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                          </Box>
                        </div>
                        <AwesomeButton
                          type="primary"
                          onPress={() => {
                            createProposalsendtoken(
                              signer,
                              params.proposalDescription,
                              params.proposalAmount,
                              params.address
                            );
                            localStorage.setItem(
                              "proposalDescription",
                              params.proposalDescription
                            );
                            localStorage.setItem(
                              "proposalAmount",
                              params.proposalAmount
                            );
                            localStorage.setItem("address", params.address);
                            setProposalType("sendtoken");
                          }}
                        >
                          Create Proposal
                        </AwesomeButton>
                      </div>
                    </Box>
                  </div>
                )}
                {activeTab === 16 && (
                  <div style={{ display: "flex" }}>
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
                      style={{ marginRight: "10px", color: "black" }} // Add spacing between retro boxes
                    >
                      <div>
                        <h2>Remove member</h2>
                        <p>Enter the address of the member to be removed</p>

                        <div className="prop-card">
                          <Box
                            component="form"
                            sx={{
                              display: "flex", // Set display to flex
                              flexDirection: "column", // Arrange items in a column
                              justifyContent: "center", // Align items horizontally in the center
                              alignItems: "center", // Align items vertically in the center
                              gap: 1, // Add some gap between items
                              "& > :not(style)": { width: "25ch" }, // Adjust width if needed
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-basic"
                              label="Proposal Description"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalDescription}
                              name="proposalDescription"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />

                            <TextField
                              id="outlined-basic"
                              label="Reciepient address"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.address}
                              name="address"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                          </Box>
                        </div>
                        <AwesomeButton
                          type="primary"
                          onPress={() => {
                            createProposalremovemember(
                              signer,
                              params.proposalDescription,

                              params.address
                            );
                            localStorage.setItem(
                              "proposalDescription",
                              params.proposalDescription
                            );

                            localStorage.setItem("address", params.address);
                            setProposalType("removeMember");
                          }}
                        >
                          Create Proposal
                        </AwesomeButton>
                      </div>
                    </Box>
                  </div>
                )}
                {activeTab === 17 && (
                  <div style={{ display: "flex" }}>
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
                      style={{ marginRight: "10px", color: "black" }} // Add spacing between retro boxes
                    >
                      <div>
                        <h2>Add member</h2>
                        <p>Enter the address of the new member</p>

                        <div className="prop-card">
                          <Box
                            component="form"
                            sx={{
                              display: "flex", // Set display to flex
                              flexDirection: "column", // Arrange items in a column
                              justifyContent: "center", // Align items horizontally in the center
                              alignItems: "center", // Align items vertically in the center
                              gap: 1, // Add some gap between items
                              "& > :not(style)": { width: "25ch" }, // Adjust width if needed
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-basic"
                              label="Proposal Description"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalDescription}
                              name="proposalDescription"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />

                            <TextField
                              id="outlined-basic"
                              label="Reciepient address"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.address}
                              name="address"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                          </Box>
                        </div>
                        <AwesomeButton
                          type="primary"
                          onPress={() => {
                            createProposaladdmember(
                              signer,
                              params.proposalDescription,

                              params.address
                            );
                            localStorage.setItem(
                              "proposalDescription",
                              params.proposalDescription
                            );

                            localStorage.setItem("address", params.address);
                            setProposalType("addMember");
                          }}
                        >
                          Create Proposal
                        </AwesomeButton>
                      </div>
                    </Box>
                  </div>
                )}
                {activeTab === 18 && (
                  <div style={{ display: "flex" }}>
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
                      style={{ marginRight: "10px", color: "black" }} // Add spacing between retro boxes
                    >
                      <div>
                        <h2>Tranfer ETH</h2>
                        <p>
                          Enter the ETH amount and address of the reciepient
                        </p>

                        <div className="prop-card">
                          <Box
                            component="form"
                            sx={{
                              display: "flex", // Set display to flex
                              flexDirection: "column", // Arrange items in a column
                              justifyContent: "center", // Align items horizontally in the center
                              alignItems: "center", // Align items vertically in the center
                              gap: 1, // Add some gap between items
                              "& > :not(style)": { width: "25ch" }, // Adjust width if needed
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-basic"
                              label="Proposal Description"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalDescription}
                              name="proposalDescription"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                            <TextField
                              id="outlined-basic"
                              label="Amount of Tokens"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.proposalAmount}
                              name="proposalAmount"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                            <TextField
                              id="outlined-basic"
                              label="Reciepient address"
                              variant="outlined"
                              onChange={handleParamsChange}
                              defaultValue={params.address}
                              name="address"
                              sx={{
                                borderRadius: "8px", // Rounded corners
                                fontFamily: '"Jost", sans-serif',
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderWidth: "2px", // Border width
                                  },
                                },
                              }}
                            />
                          </Box>
                        </div>
                        <AwesomeButton
                          type="primary"
                          onPress={() => {
                            createProposalsendEther(
                              signer,
                              params.proposalDescription,
                              params.proposalAmount,
                              params.address
                            );
                            localStorage.setItem(
                              "proposalDescription",
                              params.proposalDescription
                            );
                            localStorage.setItem(
                              "proposalAmount",
                              params.proposalAmount
                            );
                            localStorage.setItem("address", params.address);
                            setProposalType("sendEther");
                          }}
                        >
                          Create Proposal
                        </AwesomeButton>
                      </div>
                    </Box>
                  </div>
                )}
              </div>
            </div>
          </Typography>
        </div>
      </Box>
    </>
  );
};
