import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import * as React from "react";
import ethlogo from "./eth.png";
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
import { useGetTotalVoters } from "../web3/GetVotersCount";
import { useGetProposals } from "../web3/GetProposalCount";
import FileUpload from "./FileUpload";
import Upload from "./Upload.json";
import Display from "./Display";
import NFTComponent from "./mmcc";
import "react-awesome-button/dist/styles.css";
import NFTComponentdao from "./mmccdao";
import tokenLogo from "./token_logo.png";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
export const User = ({
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
  const [aiText, setAIText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [ethBalance, setEthBalance] = useState(null);

  // Function to update outputText state
  const updateOutputText = (text) => {
    setOutputText(text);
  };
  useEffect(() => {
    // Load DAO balance when component mounts
    handleCheckBalance();
  }, []);
  const handleCheckBalance = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        // Call the balance function from the contract to retrieve ETH balance
        const balance = await provider.getBalance(address);

        // Convert balance from Wei to Ether
        const balanceInEth = ethers.utils.formatEther(balance);

        setEthBalance(balanceInEth);
      }
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  const [params, setParams] = useState({
    proposalDescription: localStorage.getItem("proposalDescription") || "",
    proposalAmount: localStorage.getItem("proposalAmount") || 0,
  });

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
  const sample = () => {
    // Open the URL specified in the gourl function in a new tab
    console.log("placeholder");
  };

  const updateParams = () => {
    setPropDesc(
      proposalDescription
        ? proposalDescription
        : localStorage.getItem("proposalDescription")
    );
    setPropValue(newValue ? newValue : localStorage.getItem("proposalAmount"));
  };

  return (
    <>
      <div>
        <Typography variant="h6" align="center" color="black" component="p">
          <div>
            <h1>My Profile</h1>
            <div>
              <Stack direction="row" spacing={2} justifyContent="center">
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
                  <p1>My NFT</p1>
                  <NFTComponent account={account} />

                  <Box
                    boxShadow={3}
                    style={{ color: "black" }}
                    bgcolor="background.paper"
                    p={2}
                    className="retro-box" // Add a class for retro style
                    maxWidth="fit-content" // Set maximum width to fit the content
                    margin="auto" // Center the box horizontally
                    display="flex"
                    flexDirection="row"
                    alignItems="center" // Center the content vertically
                  >
                    {" "}
                    <Stack spacing={2} direction="row" justifyContent="center">
                      <AwesomeButton type="linkedin" onPress={sample}>
                        Trade NFT
                      </AwesomeButton>
                      <AwesomeButton type="linkedin" onPress={sample}>
                        Transfer NFT
                      </AwesomeButton>
                      <AwesomeButton type="linkedin" onPress={sample}>
                        Burn NFT
                      </AwesomeButton>
                      <AwesomeButton type="linkedin" onPress={sample}>
                        Transfer NFT
                      </AwesomeButton>
                    </Stack>
                  </Box>
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
                >
                  <p1>My Governance Tokens</p1>

                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {userBalance ? parseInt(userBalance) : "0"}
                  </span>

                  <img
                    src={tokenLogo}
                    alt="Token Logo"
                    style={{ width: "110px", height: "100px" }}
                  />
                  <Box
                    boxShadow={3}
                    style={{ color: "black" }}
                    bgcolor="background.paper"
                    p={2}
                    className="retro-box" // Add a class for retro style
                    maxWidth="fit-content" // Set maximum width to fit the content
                    margin="auto" // Center the box horizontally
                    display="flex"
                    flexDirection="row"
                    alignItems="center" // Center the content vertically
                  >
                    {" "}
                    <Stack spacing={2} direction="row" justifyContent="center">
                      <AwesomeButton type="primary" onPress={sample}>
                        Tranfer Token
                      </AwesomeButton>
                      <AwesomeButton type="danger" onPress={sample}>
                        Trade Token
                      </AwesomeButton>
                    </Stack>
                  </Box>
                </Box>

                <Box
                  boxShadow={3}
                  bgcolor="background.paper"
                  p={2}
                  className="retro-box" // Add a class for retro style
                  maxWidth="200px" // Set maximum width to fit the content
                  margin="auto" // Center the box horizontally
                  display="flex"
                  flexDirection="column"
                  alignItems="center" // Center the content vertically
                >
                  <p1>My Balance</p1>

                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {ethBalance
                      ? parseFloat(ethBalance).toFixed(3) + " ETH"
                      : "0 ETH"}
                  </span>

                  <div style={{ textAlign: "center", margin: "5px auto" }}>
                    {" "}
                    {/* Adjusted margin */}
                    <img
                      src={ethlogo}
                      alt="Token Logo"
                      style={{ width: "80px", height: "130x" }}
                    />
                  </div>
                  <Box
                    boxShadow={3}
                    style={{ color: "black" }}
                    bgcolor="background.paper"
                    p={2}
                    className="retro-box" // Add a class for retro style
                    maxWidth="fit-content" // Set maximum width to fit the content
                    margin="auto" // Center the box horizontally
                    display="flex"
                    flexDirection="row"
                    alignItems="center" // Center the content vertically
                  >
                    {" "}
                    <AwesomeButton type="primary" onPress={sample}>
                      Tranfer ETH
                    </AwesomeButton>
                  </Box>
                </Box>
              </Stack>
            </div>
            <div>
              <h1>New Proposal</h1>
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
                    type="facebook"
                    onPress={() => {
                      setActiveTab(2);
                    }}
                  >
                    Submit a Proposal
                  </AwesomeButton>
                  <AwesomeButton
                    type="secondary"
                    onPress={() => {
                      setActiveTab(3);
                    }}
                  >
                    Vote
                  </AwesomeButton>
                  <AwesomeButton
                    type="twitter"
                    onPress={() => {
                      setActiveTab(4);
                    }}
                  >
                    AI Prompt Generator
                  </AwesomeButton>
                </Stack>
              </Box>
            </div>
            <div>
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
                        }}
                      >
                        Create Proposal
                      </AwesomeButton>
                    </div>
                  </Box>
                </div>
              )}
              {activeTab === 3 && (
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
                  >
                    <div>
                      <h2>Choose your preference</h2>
                      <p>Vote and engage with the DAO</p>
                      <Box sx={{ minWidth: 275 }}>
                        <Card variant="outlined">
                          <VoteProposal lastId={proposal} signer={signer} />
                        </Card>
                      </Box>

                      <Display
                        contract={contract}
                        account={account}
                        propDesc={proposalDescription}
                      ></Display>
                    </div>
                  </Box>
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
                    >
                      <p>AI-based Analysis </p>
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
              {activeTab === 4 && (
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
            </div>
          </div>
        </Typography>
      </div>
    </>
  );
};
