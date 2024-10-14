const fetch = require("node-fetch");

async function callPythonAPItext(prompt) {
  const response = await fetch("http://localhost:3200/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (response.ok) {
    const result = await response.json();
    return result.result;
  } else {
    console.error("Failed to call Python API:", response.status);
  }
}

module.exports = callPythonAPItext;
