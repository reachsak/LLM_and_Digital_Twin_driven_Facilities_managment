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
const Groq = require("groq-sdk");
const groq = new Groq({
  dangerouslyAllowBrowser: true,
  apiKey: "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",
});
export const Chatvoiceollamagroq = () => {
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
  const getGroqChatCompletion = async (prompt) => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "you are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      stop: null,
      stream: false,
    });
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

    const chatCompletion = await getGroqChatCompletion(prompt);
    const content = chatCompletion.choices[0]?.message?.content || "";
    console.log(content);
    let serverResponse = "";
    serverResponse += content;
    tempHistory[tempIndex].prompt = serverResponse;
    setHistory([...tempHistory]);
    setContext(content);
    setLoading(false);
  };

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
            <p1>ChatBot Text-Only</p1>
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
      </Box>
    </div>
  );
};
