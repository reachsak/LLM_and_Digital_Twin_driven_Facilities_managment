import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const handleClick = () => {
    setShowWebcam(!showWebcam); // Toggle the showWebcam state
  };

  const handleTurnOffWebcam = () => {
    setShowWebcam(false); // Turn off webcam explicitly
  };

  return (
    <div>
      {/* Button to toggle webcam visibility */}

      <div style={{ textAlign: "center" }}>
        {!showWebcam ? (
          <AwesomeButton type="whatsapp" onPress={handleClick}>
            Show Video Stream
          </AwesomeButton>
        ) : (
          <AwesomeButton type="danger" onPress={handleTurnOffWebcam}>
            Turn Off Stream
          </AwesomeButton>
        )}
      </div>
      <div>
        {showWebcam && (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </div>
        )}
      </div>

      {/* Render the webcam component if showWebcam is true */}
    </div>
  );
};

export default WebcamComponent;
