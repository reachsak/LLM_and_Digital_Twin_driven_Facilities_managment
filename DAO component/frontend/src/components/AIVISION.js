import React, { useState, useEffect } from "react";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
import WebcamComponent from "./webcam";
import Webcam from "react-webcam";
import MyComponent from "./webcamaitext";
import LM2 from "./webcamaitext2";
import LM3 from "./webcam_llava34b_prompt";
import MyComponent69 from "./webcam_llava34b";
import LMspeech from "./webcam_llava34b_speech";
import { ethers } from "ethers";
import Stack from "@mui/material/Stack";
import { fetchJsonFromIpf } from "./mmcc";
import Grid from "@mui/material/Grid";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import contractABI from "../chain-info/contracts/MoralisGovernor.json";
import tokencontractABI from "../chain-info/contracts/GovernanceToken.json";
import contractAddress from "../chain-info/deployments/map.json";
import Safety from "./webcam_llava34b_safety";
import Appp from "./mcc";
import NFTComponent from "./mmcc";
import Box from "@mui/material/Box";
import axios from "axios";
import tokenLogo from "./token_logo.png";
import NFTABI from "../chain-info/contracts/MyTokennew.json";
export const Llmvision = () => {
  return (
    <div>
      {" "}
      <div>
        {/* <Box
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
          <h2>Video stream AI agent (Auto)</h2>

          <MyComponent />
        </Box> */}
      </div>
      <div>
        {/* <Box
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
          <h2>AI agent for construction site safety</h2>

          <LM2 />
        </Box> */}
      </div>
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
          <WebcamComponent />
        </Box>
      </div>
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
          <h2>AI Construction Safety Manager LLaVa 34b</h2>
          {/* Render the WebcamComponent */}
          <Safety />
        </Box>
      </div>
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
          <h2>Video stream LLaVa 34b</h2>
          {/* Render the WebcamComponent */}
          <MyComponent69 />
        </Box>
      </div>
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
          <h2>Conversational AI agent on Live Stream LLaVa34b</h2>
          {/* Render the WebcamComponent */}
          <LM3 />
        </Box>
      </div>
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
          <h2>Conversational AI agent on Live Stream LLaVa34b</h2>
          {/* Render the WebcamComponent */}
          {/* <LMspeech /> */}
        </Box>
      </div>
    </div>
  );
};
