import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
function MyComponent() {
  const [sentence, setSentence] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onmessage = (event) => {
      const receivedText = event.data;
      setSentence((prevSentence) => prevSentence + " " + receivedText); // Accumulate text into a sentence
    };

    return () => {
      socket.close();
    };
  }, []);

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
          <p1 style={{ textAlign: "center" }}>LLM Response</p1>
          <p>{sentence}</p>
        </Box>
      </div>
    </div>
  );
}

export default MyComponent;
