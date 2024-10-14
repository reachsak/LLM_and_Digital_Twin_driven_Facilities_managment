import CssBaseline from "@mui/material/CssBaseline";
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
  address,
  proposal,
  cal,

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
  const [propAddress, setAddress] = useState();
  const [outputText, setOutputText] = useState("");

  const { voters, getVoters } = useGetTotalVoters();
  const { proposalCount, getProposalCount } = useGetProposals();
  const updateOutputText = (text) => {
    setOutputText(text);
  };
  const { createProposalsendtoken } = useCreateProposal();

  const [params, setParams] = useState({
    proposalDescription: localStorage.getItem("proposalDescription") || "",
    proposalAmount: localStorage.getItem("proposalAmount") || 0,
    address: localStorage.getItem("address") || "",
  });
  const [proposalType, setProposalType] = useState("default");

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
                              setActiveTab(9);
                            }}
                          >
                            Crytocurrency Transfer
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
                              setActiveTab(1);
                              getValue();
                            }}
                          >
                            Add member
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(13);
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
                        <Button
                          onClick={() => {
                            createProposalsendtoken(
                              signer,
                              "me",
                              4222,
                              "0xd760a17210b61900f696ad0c21a6e11dc8884198"
                            );
                          }}
                        >
                          test
                        </Button>
                        <AwesomeButton
                          type="primary"
                          onPress={() => {
                            cal(3);
                          }}
                        >
                          cal
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
