import React, { useEffect, useState, useRef } from "react";
import "./Display.css";
import Box from "@mui/material/Box";

export const Chatvoiceollama = () => {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const recognition = useRef(null);
  const chatBoxRef = useRef(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    recognition.current.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    recognition.current.stop();
  };

  useEffect(() => {
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = "en-US";

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscribedText(transcript);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };
  }, []);

  useEffect(() => {
    if (transcribedText) {
      setPrompt(transcribedText);
    }
  }, [transcribedText]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("sendButton").click();
    }
  };

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [history]);

  const sendPrompt = async () => {
    setLoading(true);
    const tempHistory = [
      ...history,
      { prompt, type: "user", timestamp: Date.now() },
    ];
    setHistory(tempHistory);

    try {
      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistral:7b-instruct-v0.2-fp16",
          prompt,
          system: "You are a helpful assistant.",
          template: "",
          context: [],
          options: { num_predict: 8192, temperature: 0.8 },
        }),
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
              tempHistory[tempHistory.length - 1].prompt = serverResponse;
              setHistory([...tempHistory]);
            }

            if (done) {
              setPrompt(""); // Clear prompt after receiving server response
              setContext(context);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (error) {
      console.error("Error sending prompt:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Box
        boxShadow={3}
        bgcolor="background.paper"
        p={2}
        className="retro-box"
        maxWidth="fit-content"
        margin="auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <div className="App">
          <Box
            boxShadow={3}
            bgcolor="background.paper"
            p={2}
            className="retro-box"
            maxWidth="1000px"
            margin="auto"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <p1>ChatBot Voice</p1>
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
              onKeyPress={handleKeyPress}
            ></textarea>
          </div>
          <div className="send-button-container">
            <button
              id="sendButton"
              className={`send-button ${loading ? "disabled" : ""}`}
              disabled={loading}
              onClick={sendPrompt}
            >
              Send
            </button>
            {isRecording ? (
              <button onClick={handleStopRecording}>Stop Recording</button>
            ) : (
              <button onClick={handleStartRecording}>Start Recording</button>
            )}
          </div>
        </div>
      </Box>
    </div>
  );
};
