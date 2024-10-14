const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const callPythonAPItext = require("./llavaapitext.js");

const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

app.post("/trigger-aii", async (req, res) => {
  const { promptText } = req.body; // Extract imageUrl and promptText from the request body

  try {
    const output = await callPythonAPItext(promptText);
    console.log("AI output:", output);
    console.log("The prompt:", promptText);
    res.send(output);
  } catch (error) {
    console.error("Error executing ai.js:", error);
    res.status(500).send("Error executing aii.js");
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
