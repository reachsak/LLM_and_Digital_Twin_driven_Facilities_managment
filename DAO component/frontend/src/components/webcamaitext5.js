import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Webcam from "react-webcam";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
function LM4() {
  const [sentence, setSentence] = useState("");
  const [prompt, setPrompt] = useState("");
  const webcamRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8767");

    socketRef.current.onmessage = (event) => {
      const receivedText = event.data;
      if (receivedText === "END_ITERATION") {
        setSentence((prevSentence) => prevSentence.trim() + "\n");
      } else {
        setSentence((prevSentence) => prevSentence + " " + receivedText);
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleChange = (event) => {
    setPrompt(event.target.value); // Update the prompt state with user input
  };

  const handleSubmit = () => {
    // Send the prompt to the Python server
    socketRef.current.send(prompt);
  };

  const handleDefaultPrompt = () => {
    // Send the default prompt to the Python server
    socketRef.current.send("Describe the image concisely");
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter additional prompt"
          value={prompt}
          onChange={handleChange}
          style={{
            width: "250px",
            height: "40px",
            display: "block" /* Ensures input takes up full width */,
            margin: "auto" /* Centers horizontally */,
            textAlign: "center" /* Centers text horizontally */,
          }}
        />
        <div>
          <AwesomeButton type="facebook" onPress={handleSubmit}>
            Submit
          </AwesomeButton>
        </div>
        <div>
          {" "}
          <AwesomeButton type="primary" onPress={handleDefaultPrompt}>
            Default Prompt
          </AwesomeButton>{" "}
        </div>

        {/* Button to send default prompt */}
      </div>

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
          <p1 style={{ textAlign: "center" }}>LLM Response</p1>
          <p>{sentence}</p>
        </Box>
      </div>
    </div>
  );
}

export default LM4;
