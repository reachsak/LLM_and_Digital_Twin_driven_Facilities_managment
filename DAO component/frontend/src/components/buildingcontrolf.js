import React, { useEffect, useState, useRef } from "react";
import "./Display.css";
import Box from "@mui/material/Box";
import axios from "axios";
import Fileupload4 from "./Fileupload4";
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

  const [aiText, setAIText] = useState("");
  const triggerllava2 = async (ImgHash, promptText) => {
    try {
      const response = await axios.post("http://localhost:3003/trigger-ai", {
        imageUrl: ImgHash,
        promptText: promptText, // Include prompt text in the request
      });
      console.log(response.data);

      console.log("call success"); // Output: 'AI triggered successfully'
    } catch (error) {
      console.error("Error triggering AI:", error);
    } finally {
    }
  };
  const retrieveFile = async (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
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

        console.log(newImgHash);
        setImgHash(newImgHash);
        // Store ImgHash in state

        triggerllava2(newImgHash, prompt);

        console.log("done");
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
  };

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("None");

  const handleSubmit = async (e) => {
    setLoading(true);
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

        console.log(newImgHash);
        setImgHash(newImgHash);
        // Store ImgHash in state

        triggerllava2(newImgHash, prompt);
        setLoading(false);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
  };

  const handleCancel = () => {
    if (editableIndex !== null) {
      setEditableText(history[editableIndex]?.prompt || "");
      setEditableIndex(null);
    }
  };

  const handleFeedback = (index, type) => {
    setFeedback({
      ...feedback,
      [index]: type,
    });

    if (type === "down") {
      setEditableIndex(index);
      setEditableText(history[index]?.prompt || "");
    }
  };

  const handleSave = () => {
    if (editableIndex !== null) {
      const updatedHistory = [...history];
      updatedHistory[editableIndex].prompt = editableText;
      setHistory(updatedHistory);
      setEditableIndex(null);
    }
  };

  const sendPrompt = async () => {
    setLoading(true);

    let tempHistory = [
      ...history,
      { prompt: "", type: "server", timestamp: Date.now() },
    ];

    setHistory(tempHistory);
    const tempIndex = tempHistory.length - 1;
    const formData = new FormData();
    formData.append("file", base64Image);

    const requestOptions1 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava7b",
        prompt,
        system,
        template: "",
        context,
        options: { temperature: 0.8 },
        images: [base64Image],
      }),
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama213b",
        prompt,
        system,
        template: "",
        context,
        options: { temperature: 0.8 },
      }),
    };

    const response = await axios.post("http://localhost:3003/trigger-ai", {
      imageUrl: ImgHash,
      promptText: promptText, // Include prompt text in the request
    });
    const reader = response.body?.getReader();

    if (reader) {
      let serverResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }

        const decodedValue = new TextDecoder("utf-8").decode(value);

        try {
          const { response, done, context } = JSON.parse(decodedValue);

          if (response) {
            serverResponse += response;
            tempHistory[tempIndex].prompt = serverResponse;
            setHistory([...tempHistory]);
          }

          if (done) {
            setContext(context);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    fetch("http://localhost:11434/api/tags")
      .then((response) => response.json())
      .then((data) => {
        setTags(data.models);
      });
  }, []);

  useEffect(() => {
    if (history.length > 0 && history[history.length - 1].type === "user") {
      sendPrompt();
    }
  }, [history, sendPrompt]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("sendButton").click();
    }
  };

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [history]);

  return (
    <div>
      <div className="App">
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
          <p1>ChatBot</p1>
          <div ref={chatBoxRef} className="chat-box">
            <div className="history">
              {history.map((item, index) => (
                <div key={index} className={`message ${item.type}`}>
                  {item.type === "user" ? "User:" : "AI:"} {item.prompt}
                  {editableIndex === index ? (
                    <textarea
                      className="textarea-editable"
                      value={editableText}
                      onChange={(e) => setEditableText(e.target.value)}
                    />
                  ) : null}
                  {item.type === "server" && (
                    <div className="feedback-icons">
                      {editableIndex === index && (
                        <>
                          <button className="saveBtn" onClick={handleSave}>
                            Save
                          </button>
                          <button className="cancelBtn" onClick={handleCancel}>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Box>
        <div>
          <textarea
            className="textarea"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
          ></textarea>

          {/* <div>
            <select onChange={(v) => setSelectedTag(v.target.value)}>
              {tags.map((tag) => (
                <option key={tag.name} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>
        <div className="send-button-container">
          <button
            id="sendButton"
            className={`send-button ${loading ? "disabled" : ""}`}
            disabled={loading}
            onClick={async () => {
              setHistory((prevHistory) => [
                ...prevHistory,
                { prompt, type: "user", timestamp: Date.now() },
              ]);
            }}
          >
            Send
          </button>
        </div>
        <div>
          {/* ImageUploader component */}
          <Fileupload4 setBase64Image={setBase64Image} />
        </div>
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
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <div></div>
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

        <div>
          <AwesomeButtonProgress
            type="whatsapp"
            onPress={async (element, next) => {
              // await for something then call
              await handleSubmit();
              next();
            }}
          >
            Ask AI
          </AwesomeButtonProgress>
        </div>
      </form>
    </div>
  );
};
