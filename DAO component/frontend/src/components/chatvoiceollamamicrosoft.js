import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import "./Display.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
const Groq = require("groq-sdk");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = sdk.SpeechConfig.fromSubscription(
  "8daf8bda21e54a438ceb9be7f055577a",
  "eastus"
);
speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural";
speechConfig.speechSynthesisVoiceName = "en-US-AndrewNeural";
speechConfig.speechSynthesisVoiceName = "en-US-AvaNeural";

//check this site for more voice
//https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
const groq = new Groq({
  dangerouslyAllowBrowser: true,
  apiKey: "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",
});

const X = () => {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

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

  const sendPrompt = async () => {
    setLoading(true);
    const tempHistory = [
      ...history,
      { prompt: "", type: "server", timestamp: Date.now() },
    ];
    setHistory(tempHistory);
    const tempIndex = tempHistory.length - 1;

    const chatCompletion = await getGroqChatCompletion(prompt);
    const content = chatCompletion.choices[0]?.message?.content || "";

    tempHistory[tempIndex].prompt = content;
    setHistory([...tempHistory]);
    speakText(content); // Call text-to-speech function
    setLoading(false);
  };

  const speakText = (text) => {
    synthesizer.speakTextAsync(
      text,
      function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Speech synthesis completed.");
          // Do nothing here, no need to call playSpeech
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
        }
      },
      function (err) {
        console.trace("err - " + err);
      }
    );
  };

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
          <p1>ChatBot with Groq and Azure speech</p1>
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
        <textarea
          className="textarea"
          placeholder="Let's chat"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
        ></textarea>
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
              await sendPrompt();
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default X;
