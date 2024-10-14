import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
const WebPagedigitaltwin = () => {
  const [showWebPage, setShowWebPage] = useState(false);

  const handleButtonClick = () => {
    setShowWebPage(true);
  };

  return (
    <div>
      (
      <iframe
        src="https://tandem.autodesk.com/pages/facilities/urn:adsk.dtt:LudKiyWAQcCPqK2gQWxNfw/views/NFeai8pZR_GPMuNXPzY57g"
        width="100%"
        height="500px"
        title="Web Page"
      ></iframe>
      )
    </div>
  );
};

export default WebPagedigitaltwin;
