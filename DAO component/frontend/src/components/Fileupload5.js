import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
const FileUpload5 = ({ contract, account, provider, updateOutputText2 }) => {
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("None");

  const triggerAI = async (imageData) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llava:34b",
        prompt: promptText,
        stream: false,
        images: [imageData],
        options: {
          num_predict: 4096,
        },
      });

      console.log(response.data.response); // Print the response data

      // Update the state to display the response text
      updateOutputText2(response.data.response);
      setLoading(false);
    } catch (error) {
      console.error("Error triggering AI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
          // You can now use the base64String as needed, for example, send it to the server
          console.log(base64String);
          triggerAI(base64String);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const retrieveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  return (
    <div className="top">
      <div>
        <h2>Image to Text AI </h2>
      </div>
      <span className="textArea" style={{ color: "black" }}>
        Image: {fileName}{" "}
      </span>
      <form className="form" onSubmit={handleSubmit}>
        <AwesomeButton
          type="twitter"
          onPress={() => document.getElementById("file-upload").click()}
          // Add class for styling
        >
          Choose Image
        </AwesomeButton>
        <input
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          style={{ display: "none" }}
        />

        <input
          type="text"
          placeholder="Enter additional prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          style={{
            width: "250px",
            height: "40px",
            display: "block",
            margin: "auto",
            textAlign: "center",
          }}
        />
        <AwesomeButtonProgress
          type="whatsapp"
          loading={loading}
          onPress={handleSubmit}
        >
          Ask Llava34b
        </AwesomeButtonProgress>
      </form>
      <div>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ maxWidth: "300px", height: "auto" }}
          />
        )}
      </div>
    </div>
  );
};

export default FileUpload5;
