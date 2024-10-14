import React, { useEffect, useState, useRef } from "react";
import "./Display.css";
import ReactFunction from "./ReactFunction";
import { ReactFunctionchat } from "./ReactFunctionchat";
import Box from "@mui/material/Box";
import axios from "axios";
import Fileupload4 from "./Fileupload4";
import WebcamComponent from "./webcam";
import Webcam from "react-webcam";
import MyComponent from "./webcamaitext";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
export const Buildingcontrol = () => {
  const [history, setHistory] = useState([]);
  const [context, setContext] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [system, setSystem] = useState("You are a helpful assistant.");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [editableIndex, setEditableIndex] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const chatBoxRef = useRef(null);
  const [base64Image, setBase64Image] = useState("");
  const [ImgHash, setImgHash] = useState(""); // State to store ImgHash
  const [promptText, setPromptText] = useState("");
  const [outputText, setOutputText] = useState("");

  return (
    <div>
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
          <h1>AI Agent</h1>
          <p1>
            My name is Siri, your peronsal AI agent for interaction with
            blockchain and Facility management
          </p1>
          <h1>Blockchain</h1>
          <p1>send ether,check ether balance</p1>
          <p1>send governance tokens</p1>
          <p1>send NFT</p1>

          <p1>propose,vote,queue,execute,check state of DAO proposal</p1>
          <h1>Facility management</h1>
          <p1>control smart home device</p1>
          <p1>get indoor environment data (Temperature, Humidity, CO2)</p1>
          <p1>Provide visualization of historial environmental data</p1>
          <p1>Check energy consumption, provide insigth</p1>

          <ReactFunctionchat />

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
            <ReactFunction />
          </Box>
        </Box>
      </div>
    </div>
  );
};
