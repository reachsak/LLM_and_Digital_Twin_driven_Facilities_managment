import { useState } from "react";
import axios from "axios";
import "./Display.css";
import "react-awesome-button/dist/styles.css";
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from "react-awesome-button";
const Display = ({ contract, account, propDesc }) => {
  const proposalDescription = propDesc || "Default Description";
  const [ImgHash, setImgHash] = useState(""); // State to store ImgHash
  const [promptText, setPromptText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [data, setData] = useState("");
  let request2 = "this is what the proposal say:";

  let request =
    "below is the proposal submit by the user alongside the images, please let me know if these are legit problems based on what they describe and the image upload, sometime they may lied to us the landlod, i want to you to think critically, whether i should agress or not";

  const triggerAI = async () => {
    try {
      console.log(proposalDescription);
      const response = await axios.post("http://localhost:3003/trigger-ai", {
        imageUrl: ImgHash,
        promptText: `${promptText}\n${request}\n${request2}\n${propDesc}`, // Include prompt text in the request
      });
      console.log(response.data);

      setOutputText(response.data);
      console.log("call success"); // Output: 'AI triggered successfully'
    } catch (error) {
      console.error("Error triggering AI:", error);
    }
  };

  const getdata = async (address) => {
    let dataArray;
    try {
      if (address) {
        dataArray = await contract.display(address);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
        console.log(dataArray);
      }
    } catch (e) {
      alert("You don't have access");
    }

    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      const lastImage = str_array[str_array.length - 1];
      const lastImageElement = (
        <a href={lastImage} target="_blank">
          <img src={lastImage} alt="new" className="image-list" />
        </a>
      );
      setData([lastImageElement]);
      setImgHash(lastImage);
    } else {
      alert("No image to display");
    }
  };

  return (
    <>
      <div>
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
        <AwesomeButton type="twitter" onPress={triggerAI}>
          Ask AI
        </AwesomeButton>{" "}
        {/* Call triggerAI directly */}
        {outputText && <div className="output-box">{outputText}</div>}
      </div>
      <div className="image-list">{data}</div>
      <AwesomeButton type="facebook" onPress={() => getdata()}>
        Get latest submission
      </AwesomeButton>
    </>
  );
};

export default Display;
