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
import { useGetTotalVoters } from "../web3/GetVotersCount";
import { useGetProposals } from "../web3/GetProposalCount";
import FileUpload from "./FileUpload";
import Upload from "./Upload.json";
import Display from "./Display";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
export const Navbar = ({
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
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <div className="presentation-container">
        <div className="presentation">
          <Typography
            variant="h5"
            align="left"
            color="white"
            component="p"
            width="70%"
          >
            Bishop Favrao Hall Decentralized Governance Platform
          </Typography>
          <div className="pres-buttons">
            <Button
              variant="contained"
              className="pres-btn"
              onClick={() => {
                window.open(
                  "https://tandem.autodesk.com/pages/facilities/urn:adsk.dtt:LudKiyWAQcCPqK2gQWxNfw/views/NFeai8pZR_GPMuNXPzY57g",
                  "_blank"
                );
              }}
            >
              Digital Twin
            </Button>
            <Button
              variant="contained"
              className="pres-btn"
              onClick={() => {
                window.open("http://localhost:9000/", "_blank");
              }}
            >
              Occupancy
            </Button>
            <Button
              variant="contained"
              className="pres-btn"
              onClick={() => {
                window.open("http://localhost:5173/", "_blank");
              }}
            >
              Reservation system
            </Button>
          </div>
          <div className="background-img"></div>
        </div>
        <div className="cards">
          <div className="card">
            <p>PROPOSALS</p>
            <Typography
              variant="h6"
              align="left"
              color="text.primary"
              component="p"
              width="70%"
            >
              {proposalCount} Total proposals
            </Typography>
            <p className="card-text">PARTICIPATE AND PROPOSE NOW</p>
          </div>
          <div className="card">
            <p>ELIGIBLE VOTERS</p>
            <Typography
              variant="h6"
              align="left"
              color="text.primary"
              component="p"
              width="70%"
            >
              {voters} Total Voters
            </Typography>
            <p className="card-text">JOIN THE DAO NOW AND BECOME ONE</p>
          </div>
          <div className="card">
            <p>YOUR VOTING POWER</p>
            <Typography
              variant="h6"
              align="left"
              color="text.primary"
              component="p"
              width="70%"
            >
              {userBalance ? userBalance : "0"}
            </Typography>
            <p className="card-text">BASED ON YOUR TOKEN BALANCE</p>
          </div>
        </div>
      </div>
      <div className="dao">
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          sx={{ pt: 8, pb: 6 }}
        >
          <Typography variant="h6" align="center" color="white" component="p">
            <div>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveTab(0);
                    getValue();
                  }}
                >
                  Current Value
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveTab(1);
                  }}
                >
                  Get Funds
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveTab(2);
                  }}
                >
                  Propose
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveTab(3);
                  }}
                >
                  Vote
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    updateParams();
                    setActiveTab(4);
                  }}
                >
                  Execute
                </Button>
              </Stack>
              <div>
                {activeTab === 0 && (
                  <div>
                    <h2>The state of the DAO</h2>
                    <p>The current Value of the Box is: </p>
                    <h2>{boxValue}</h2>
                  </div>
                )}
                {activeTab === 1 && (
                  <div>
                    <h2>Get Funds to Participate on the DAO</h2>
                    <p>Only the owners of the ERC20 Token can Vote</p>

                    <Button
                      variant="contained"
                      onClick={requestAndUpdateBalance}
                    >
                      Get Funds
                    </Button>
                  </div>
                )}
                {activeTab === 2 && (
                  <div>
                    <h2>Propose a new Execution</h2>
                    <p>The Dao members will vote to decide what happens next</p>

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
                        />
                        <TextField
                          id="outlined-basic"
                          label="Proposal Value"
                          variant="outlined"
                          onChange={handleParamsChange}
                          defaultValue={params.proposalAmount}
                          name="proposalAmount"
                        />
                      </Box>
                    </div>
                    <FileUpload
                      account={account}
                      provider={provider}
                      contract={contract}
                    ></FileUpload>

                    <Button
                      variant="contained"
                      onClick={() => {
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
                    </Button>
                  </div>
                )}
                {activeTab === 3 && (
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
                )}
                {activeTab === 4 && (
                  <div>
                    <h2>Queue & Execute</h2>
                    <p>Vote Period has Finished, time to execute!</p>
                    <Box sx={{ minWidth: 275 }}>
                      <Card variant="outlined">
                        <ExecuteProposal
                          signer={signer}
                          lastId={proposal}
                          value={propValue}
                          description={propDesc}
                        />
                      </Card>
                    </Box>
                  </div>
                )}
              </div>
            </div>
          </Typography>
        </Container>
      </div>
    </>
  );
};
