import React, { useState } from "react";
import Box from "@mui/material/Box";
import "./FileUpload.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";

function ReactFunction() {
  const [userInput, setUserInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8768/process_input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });
      const data = await response.text();
      setAiOutput(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // Add this line to listen for key press
        placeholder="What can I do for you"
        style={{
          width: "600px",
          height: "40px",
          display: "block" /* Ensures input takes up full width */,
          margin: "auto" /* Centers horizontally */,
          textAlign: "center" /* Centers text horizontally */,
        }}
      />
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <AwesomeButton type="facebook" onPress={handleSubmit}>
          Submit
        </AwesomeButton>
      </div>
      <div className="white-space-pre-wrap">{aiOutput}</div>
    </div>
  );
}

export default ReactFunction;
