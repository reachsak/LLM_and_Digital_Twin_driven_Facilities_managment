import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
const WebPageRenderer = () => {
  const [showWebPage, setShowWebPage] = useState(false);

  const handleButtonClick = () => {
    setShowWebPage(true);
  };

  return (
    <div>
      (
      <iframe
        src="http://localhost:8080/"
        width="100%"
        height="500px"
        title="Web Page"
      ></iframe>
      )
    </div>
  );
};

export default WebPageRenderer;
