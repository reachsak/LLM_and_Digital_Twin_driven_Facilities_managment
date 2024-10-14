import React, { useState, useEffect } from "react";

function TTS() {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8795");
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handlePlayClick = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Replace full stops with a unique delimiter
      const formattedText = text.replace(/\./g, ",");
      socket.send(formattedText);
    } else {
      console.error("WebSocket connection not established");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", function (event) {
        console.log("Received audio from server");
        setAudio(URL.createObjectURL(event.data));
      });
    }
  }, [socket]);

  return (
    <div className="App">
      <h1>Text to Speech</h1>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text to convert to speech"
      />
      <button onClick={handlePlayClick}>Play</button>
      {/* {audio && <audio src={audio} controls />} */}
      {audio && <audio src={audio} autoPlay />}
    </div>
  );
}

export default TTS;
