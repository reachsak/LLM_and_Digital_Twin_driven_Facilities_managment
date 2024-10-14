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

export const Chatbotollamareplyvoice = () => {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const [base64Image, setBase64Image] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [socket, setSocket] = useState(null);
  const [audio, setAudio] = useState(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8795");
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);
  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", function (event) {
        console.log("Received audio from server");
        setAudio(URL.createObjectURL(event.data));
      });
    }
  }, [socket]);

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
        model: "phi3:3.8b-mini-instruct-4k-fp16",
        prompt,
        system: "You are a helpful assistant.",
        template: "",
        options: {
          num_predict: 8192,
          temperature: 0.8,
        },
      }),
    };

    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      requestOptions
    );
    ////////////////
    const reader = response.body?.getReader();

    if (reader) {
      let serverResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          // Convert text to speech

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
        } catch (e) {
          console.error(e);
        }
      }
      convertTextToSpeech(serverResponse);
    }
  };

  const convertTextToSpeech = async (text) => {
    // Send text to the server for text-to-speech conversion
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Replace full stops with a unique delimiter
      const formattedText = text.replace(/\./g, ",");
      socket.send(formattedText);
    } else {
      console.error("WebSocket connection not established");
    }
  };

  useEffect(() => {
    if (history.length > 0 && history[history.length - 1].type === "user") {
      sendPrompt();
    }
  }, [history, sendPrompt]);

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
            ></textarea>
          </div>
          <div className="send-button-container">
            <button
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
      {/* Audio player for text-to-speech */}

      {audio && <audio src={audio} autoPlay />}
    </div>
  );
};
