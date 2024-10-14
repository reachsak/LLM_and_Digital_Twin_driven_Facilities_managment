import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { AwesomeButton, AwesomeButtonProgress } from "react-awesome-button";

function LMspeech() {
  const [sentence, setSentence] = useState("");
  const [prompt, setPrompt] = useState("");
  const socketRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8767");

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = "en-US";

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setSentence(transcript); // Display transcribed text on screen
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const startListening = () => {
    recognition.current.start();
  };

  const stopListening = () => {
    recognition.current.stop();
  };

  const handleSubmit = () => {
    // Send the prompt to the Python server
    socketRef.current.send(prompt);
  };

  const handleDefaultPrompt = () => {
    // Send the default prompt to the Python server
    socketRef.current.send("Describe the image precisely");
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop Listening</button>
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

export default LMspeech;
