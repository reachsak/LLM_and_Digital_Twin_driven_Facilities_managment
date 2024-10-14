import React, { useState } from "react";
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

const FileUpload = ({ contract, account, provider, updateOutputText }) => {
  const [ImgHash, setImgHash] = useState(""); // State to store ImgHash
  const [promptText, setPromptText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiText, setAIText] = useState("");

  let request =
    "help me generate a proosal to the landland to fix the problem in this picture";

  const triggerAI = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:3002/trigger-ai", {
        imageUrl: ImgHash,
        promptText: `${request}\n${promptText}`, // Include prompt text in the request
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

  const triggerllava = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:3003/trigger-ai", {
        imageUrl: ImgHash,
        promptText: `${request}\n${promptText}`, // Include prompt text in the request
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `0ae4eedb33cd7e40e9c0`,
            pinata_secret_api_key: `95c11ce9c5695d0496a65ccb3aa36b9fd41e17add1f74bf600f2200cebf813f6`,
            "Content-Type": "multipart/form-data",
          },
        });

        const newImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add("0xD760A17210b61900F696ad0C21a6e11dc8884198", newImgHash);
        alert("Successfully Image Uploaded");
        console.log(newImgHash);
        setImgHash(newImgHash); // Store ImgHash in state
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
  };

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("None");

  return (
    <div className="top">
      <div>
        <h2>AI-Assisted Proposal Generator</h2>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <AwesomeButton
          type="twitter"
          onPress={() => document.getElementById("file-upload").click()}
          // Add class for styling
        >
          Choose Image
        </AwesomeButton>

        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <div>
          <span className="textArea" style={{ color: "black" }}>
            Image: {fileName}{" "}
          </span>
        </div>

        <div>
          <AwesomeButton type="primary" disabled={!file}>
            Upload File
          </AwesomeButton>
        </div>
      </form>
      <div>
        <div>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter additional prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          style={{
            width: "250px",
            height: "40px",
            display: "block" /* Ensures input takes up full width */,
            margin: "auto" /* Centers horizontally */,
            textAlign: "center" /* Centers text horizontally */,
          }}
        />

        {/* Call triggerAI directly */}
        <div></div>

        <AwesomeButtonProgress
          type="whatsapp"
          onPress={async (element, next) => {
            // await for something then call
            await triggerllava();
            next();
          }}
        >
          Ask AI
        </AwesomeButtonProgress>
        <div></div>
        <div></div>
        {/* {outputText && <div className="output">{outputText}</div>} */}
        {/* no need to pass it here */}
      </div>
    </div>
  );
};

export default FileUpload;
