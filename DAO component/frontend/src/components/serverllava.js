const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const callPythonAPI = require("./llavaapi");

const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

app.post("/trigger-ai", async (req, res) => {
  const { imageUrl, promptText } = req.body; // Extract imageUrl and promptText from the request body

  try {
    const output = await callPythonAPI(imageUrl, promptText);
    console.log("The prompt:", promptText);
    console.log("AI output:", output);

    res.send(output);
  } catch (error) {
    console.error("Error executing ai.js:", error);
    res.status(500).send("Error executing aii.js");
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
