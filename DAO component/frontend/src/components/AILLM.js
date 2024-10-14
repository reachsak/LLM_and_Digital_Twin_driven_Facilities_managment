import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import "./FileUpload.css";
import { ReactFunctionchat } from "./ReactFunctionchat";
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
import FileUpload2 from "./FileUpload2";
import FileUpload5 from "./Fileupload5";
import TTS from "./tts";
import FileUpload4 from "./Fileupload4";
import Upload from "./Upload.json";
import FileUpload3 from "./texttotextcompletion";
import { Chatbotwithimage } from "./chatbotwithimage";
import { Chatbotwithimagereplyvoice } from "./chatbotwithimagereplyvoice";
import { Buildingcontrol2 } from "./chatbotollama";
import { Chatvoiceollama } from "./chatvoiceollama";
import { Chatvoiceollamaspeech } from "./chatvoiceollamaspeech";
import X from "./chatvoiceollamamicrosoft";
import { Chatvoiceollamagroq } from "./chatvoiceollamagroq";
import { Chatbotollamareplyvoice } from "./chatbotollamareplyvoice";
import { Chatbotvoicereplyvoice4image } from "./chatbotvoicereplyvoice4image";
import { Chatbotimageazurespeech } from "./chatbotimageazurespeech";

import WebPageRenderer from "./webpagerenderer";

import Display from "./Display";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
import { Buildingcontrol } from "./AIAGENT";
export const Contact = ({
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
  const [outputText, setOutputText] = useState("");
  const [outputText2, setOutputText2] = useState("");
  const [outputTextcompletion, setOutputTextcompletion] = useState("");
  const [outputTextchat, setOutputTextchat] = useState("");
  const { voters, getVoters } = useGetTotalVoters();
  const { proposalCount, getProposalCount } = useGetProposals();
  const updateOutputText = (text) => {
    setOutputText(text);
  };
  const updateOutputText2 = (text) => {
    setOutputText2(text);
  };
  const updateOutputTextcompletion = (text) => {
    setOutputTextcompletion(text);
  };
  const updateOutputTextchat = (text) => {
    setOutputTextchat(text);
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

  const updateParams = () => {
    setPropDesc(
      proposalDescription
        ? proposalDescription
        : localStorage.getItem("proposalDescription")
    );
    setPropValue(newValue ? newValue : localStorage.getItem("proposalAmount"));
  };

  return (
    <div>
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
                      setActiveTab(200);
                    }}
                  >
                    Chat
                  </AwesomeButton>
                  <AwesomeButton
                    type="danger"
                    onPress={() => {
                      setActiveTab(20);
                    }}
                  >
                    Vision AI
                  </AwesomeButton>

                  <AwesomeButton
                    type="facebook"
                    onPress={() => {
                      setActiveTab(300);
                    }}
                  >
                    Chat with Image
                  </AwesomeButton>
                  <AwesomeButton
                    type="secondary"
                    onPress={() => {
                      setActiveTab(500);
                    }}
                  >
                    AI Agent
                  </AwesomeButton>
                  <AwesomeButton
                    type="primary"
                    onPress={() => {
                      setActiveTab(202);
                    }}
                  >
                    Chat with voice
                  </AwesomeButton>
                  <AwesomeButton
                    type="danger"
                    onPress={() => {
                      setActiveTab(500);
                    }}
                  >
                    Vision AI with voice
                  </AwesomeButton>
                  <AwesomeButton
                    type="facebook"
                    onPress={() => {
                      setActiveTab(700);
                    }}
                  >
                    Groq Chat
                  </AwesomeButton>
                  <AwesomeButton
                    type="linkedin"
                    onPress={() => {
                      setActiveTab(800);
                    }}
                  >
                    Groq + Azure speech SDK
                  </AwesomeButton>
                  <AwesomeButton
                    type="primary"
                    onPress={() => {
                      setActiveTab(900);
                    }}
                  >
                    Vision + Azure speech SDK
                  </AwesomeButton>
                </Stack>
              </Box>

              <div>
                {activeTab === 0 && (
                  <div>
                    <h2 style={{ color: "black" }}>Welcome to the ChatBot</h2>
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
                {activeTab === 20 && (
                  <div>
                    <Box
                      boxShadow={3}
                      style={{ color: "black" }}
                      bgcolor="background.paper"
                      p={2}
                      className="retro-box" // Add a class for retro style
                      maxWidth="1000px" // Set maximum width to fit the content
                      margin="auto" // Center the box horizontally
                      display="flex"
                      flexDirection="column"
                      alignItems="center" // Center the content vertically
                    >
                      <div
                        className="output"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        <Box>
                          <FileUpload5
                            account={account}
                            provider={provider}
                            contract={contract}
                            updateOutputText2={updateOutputText2}
                          />
                        </Box>
                      </div>
                      <div>
                        <Box
                          boxShadow={3}
                          style={{ color: "black" }}
                          bgcolor="background.paper"
                          p={2}
                          className="retro-box" // Add a class for retro style
                          maxWidth="1000px" // Set maximum width to fit the content
                          margin="auto" // Center the box horizontally
                          display="flex"
                          flexDirection="column"
                          alignItems="center" // Center the content vertically
                        >
                          <p>AI-Generated Output</p>
                          <Typography
                            sx={{
                              fontFamily: "Jost, sans-serif",
                              textAlign: "justify",
                              textJustify: "inter-word",
                            }}
                          >
                            <div>{outputText2}</div>
                          </Typography>
                        </Box>
                      </div>
                    </Box>
                  </div>
                )}

                {activeTab === 5 && (
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
                        <p>Select LLM model</p>
                        <Stack
                          spacing={2}
                          direction="row" // Change direction to "column"
                          alignItems="center" // Align items to center vertically
                        >
                          <AwesomeButton
                            type="primary"
                            onPress={() => {
                              setActiveTab(7);
                              getValue();
                            }}
                          >
                            Text to Text
                          </AwesomeButton>
                          <AwesomeButton
                            type="danger"
                            onPress={() => {
                              setActiveTab(8);
                            }}
                          >
                            Image to Text
                          </AwesomeButton>
                        </Stack>
                      </div>
                    </Box>
                    <div></div>
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
                      {" "}
                      <Box>
                        <FileUpload3
                          account={account}
                          provider={provider}
                          contract={contract}
                          updateOutputText={updateOutputTextcompletion}
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
                          <p>AI Text to text output</p>
                          <Typography
                            sx={{
                              fontFamily: "Jost, sans-serif",
                              textAlign: "justify",
                              textJustify: "inter-word",
                            }}
                          >
                            {outputTextcompletion}
                          </Typography>
                        </Box>
                      </div>
                    </Box>
                  </div>
                )}
                {activeTab === 8 && (
                  <div>
                    {" "}
                    <div></div>
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
                        <div
                          className="output"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          <Box>
                            <FileUpload2
                              account={account}
                              provider={provider}
                              contract={contract}
                              updateOutputText={updateOutputText}
                            />
                          </Box>
                        </div>
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
                            <p>AI-Generated Output</p>
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
                      </Box>
                    </div>
                  </div>
                )}
                {activeTab === 9 && (
                  <div style={{ color: "black" }}>
                    {" "}
                    {/* <WebPageRenderer /> */}
                    <Buildingcontrol2 />
                  </div>
                )}
                {activeTab === 10 && (
                  <div>
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
                          {" "}
                          <Box>
                            <FileUpload2
                              account={account}
                              provider={provider}
                              contract={contract}
                              updateOutputText={updateOutputTextchat}
                            />
                          </Box>
                        </div>
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
                            <p>AI-Generated Output</p>
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
                      </Box>
                    </div>
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
                        <p>Select AI model</p>
                        <Stack
                          spacing={2}
                          direction="row" // Change direction to "column"
                          alignItems="center" // Align items to center vertically
                        >
                          <AwesomeButton
                            type="whatsapp"
                            onPress={() => {
                              setActiveTab(9);
                            }}
                          >
                            LLaVa Basic
                          </AwesomeButton>
                          <AwesomeButton
                            type="github"
                            onPress={() => {
                              setActiveTab(9);
                              getValue();
                            }}
                          >
                            LLama2 13b
                          </AwesomeButton>
                          <AwesomeButton
                            type="facebook"
                            onPress={() => {
                              setActiveTab(10);
                            }}
                          >
                            LLaVa 13b
                          </AwesomeButton>
                        </Stack>
                      </div>
                    </Box>
                    <div></div>
                  </div>
                )}
              </div>
            </div>
          </Typography>
        </div>
      </Box>
      <div>
        {activeTab === 200 && (
          <div style={{ color: "black" }}>
            {" "}
            {/* <WebPageRenderer /> */}
            <Buildingcontrol2 />
          </div>
        )}
      </div>
      <div>
        {activeTab === 300 && (
          <div style={{ color: "black" }}>
            {" "}
            {/* <WebPageRenderer /> */}
            <Chatbotwithimage />
          </div>
        )}
      </div>
      <div>
        {activeTab === 500 && (
          <div style={{ color: "black" }}>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="1000px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              {" "}
              <Chatbotvoicereplyvoice4image />
            </Box>
          </div>
        )}
      </div>
      <div>
        {activeTab === 202 && (
          <div style={{ color: "black" }}>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="1000px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <Chatvoiceollama />
            </Box>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="500px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <TTS />
            </Box>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="500px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <Chatbotollamareplyvoice />
            </Box>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="500px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <Chatbotwithimagereplyvoice />
            </Box>
          </div>
        )}
      </div>
      <div>
        {activeTab === 700 && (
          <div style={{ color: "black" }}>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="1000px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <Chatvoiceollamagroq />
            </Box>
          </div>
        )}
      </div>
      <div>
        {activeTab === 800 && (
          <div style={{ color: "black" }}>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="1000px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <X />
            </Box>
          </div>
        )}
      </div>
      <div>
        {activeTab === 900 && (
          <div style={{ color: "black" }}>
            <Box
              boxShadow={3}
              bgcolor="background.paper"
              p={2}
              className="retro-box" // Add a class for retro style
              maxWidth="1000px" // Set maximum width to fit the content
              margin="auto" // Center the box horizontally
              display="flex"
              flexDirection="column"
              alignItems="center" // Center the content vertically
            >
              <Chatbotimageazurespeech />
            </Box>
          </div>
        )}
      </div>
    </div>
  );
};
