const fetch = require("node-fetch");

async function callPythonAPI(imagePath, prompt) {
  const response = await fetch("http://localhost:3100/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_path: imagePath, prompt }),
  });

  if (response.ok) {
    const result = await response.json();
    return result.result;
  } else {
    console.error("Failed to call Python API:", response.status);
  }
}

module.exports = callPythonAPI;
