import React, { useEffect, useState, useRef } from "react";
import "./Display.css";
import ReactFunction from "./ReactFunction";
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
export const Chatbotwithimage = () => {
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
          setImgHash(base64String);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const handleCancel = () => {
    if (editableIndex !== null) {
      setEditableText(history[editableIndex]?.prompt || "");
      setEditableIndex(null);
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
    ////////////////
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:34b",
        prompt,
        system,
        template: "",
        context,
        options: { temperature: 0.8 },
        images: [ImgHash],
        options: {
          num_predict: 4096,
          temperature: 0.8,
        },
      }),
    };
    ////////////////
    const requestOptions1 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:34b", //sharegpt4v //   eas/nous-capybara:34b-q3_K_M    //  llama213b//dolphin-mixtral:8x7b-v2.7-q3_K_L
        prompt,
        system,
        template: "",
        context,
        options: {
          num_predict: 4096,
          temperature: 0.8,
        },
      }),
    };

    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      requestOptions
    );
    const response1 = await fetch(
      "http://127.0.0.1:11434/api/generate",
      requestOptions1
    );

    ////////////////

    const reader = ImgHash
      ? response.body?.getReader()
      : response1.body?.getReader();
    ////////////////

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
            setImgHash("");
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
        <div className="App">
          {" "}
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
            <p1>ChatBot with Image</p1>
            <div ref={chatBoxRef} className="chat-box">
              <div className="history">
                {history.map((item, index) => (
                  <div key={index} className={`message ${item.type}`}>
                    {item.type === "user" ? "🧑🏻‍💻Sak:" : "🤖AI:"} {item.prompt}
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
                            <button
                              className="cancelBtn"
                              onClick={handleCancel}
                            >
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
              placeholder="Let's chat"
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
            <div>
              {" "}
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
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span className="textArea" style={{ color: "black" }}>
              Image: {fileName}{" "}
            </span>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              className="form"
              onSubmit={handleSubmit}
            >
              <div>
                <AwesomeButton
                  type="twitter"
                  onPress={() => {
                    document.getElementById("file-upload").click();
                  }}
                  // Add class for styling
                >
                  Choose Image
                </AwesomeButton>
              </div>
              <input
                type="file"
                id="file-upload"
                name="data"
                onChange={(e) => {
                  retrieveFile(e);
                }}
                style={{ display: "none" }}
              />
              <div>
                <AwesomeButton type="facebook" onPress={handleSubmit}>
                  Upload
                </AwesomeButton>
              </div>
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
        </div>
      </Box>
    </div>
  );
};
