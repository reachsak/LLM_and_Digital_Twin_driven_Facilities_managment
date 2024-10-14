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
export const Home = ({
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
        mt={2}
      >
        <div>
          {" "}
          <h2 style={{ color: "black" }}>Welcome to the building CPS DAO</h2>
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
          <div className="card">
            <p>Token Supply</p>
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
            <p>New data</p>
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
        </div>
      </Box>
    </>
  );
};
