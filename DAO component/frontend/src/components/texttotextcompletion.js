import React, { useState, useRef } from "react";
import axios from "axios";
import "./FileUpload.css";

import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";

// Now you can use the callPythonAPI function

const fetch = require("node-fetch");

const FileUpload3 = ({ contract, account, provider, updateOutputText }) => {
  const buttonRef = useRef(null);
  const [ImgHash, setImgHash] = useState(""); // State to store ImgHash
  const [promptText, setPromptText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiText, setAIText] = useState("");

  const triggerllava = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:3004/trigger-aii", {
        promptText: promptText, // Include prompt text in the request
      });
      console.log(response.data);
      setOutputText(response.data);
      setAIText(response.data);
      updateOutputText(response.data);

      console.log("call success"); // Output: 'AI triggered successfully'
    } catch (error) {
      console.error("Error triggering AI:", error);
    } finally {
      setLoading(false); // Set loading state to false after the function completes
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      triggerllava();
      buttonRef.current.click();
    }
  };

  return (
    <div className="top">
      <div>
        <h2>Text to Text AI (LLaMa 2 13b)</h2>
      </div>

      <form className="form">
        <input
          type="text"
          placeholder="Enter additional prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: "250px",
            height: "40px",
            display: "block" /* Ensures input takes up full width */,
            margin: "auto" /* Centers horizontally */,
            textAlign: "center" /* Centers text horizontally */,
          }}
        />

        <div></div>
      </form>
      <div></div>
      <div>
        <div></div>
        <AwesomeButtonProgress
          type="linkedin"
          ref={buttonRef}
          onPress={async (element, next) => {
            // await for something then call
            await triggerllava();
            next();
          }}
        >
          Ask AI
        </AwesomeButtonProgress>

        {/* Call triggerAI directly */}
        <div></div>

        <div></div>
        <div></div>
        {/* {outputText && <div className="output">{outputText}</div>} */}
        {/* no need to pass it here */}
      </div>
    </div>
  );
};

export default FileUpload3;
