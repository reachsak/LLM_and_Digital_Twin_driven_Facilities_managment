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
    return result;
  } else {
    console.error("Failed to call Python API:", response.status);
  }
}

// Example usage:
// callPythonAPI("./WC.jpg", "What color is this");

callPythonAPI(
  "https://gateway.pinata.cloud/ipfs/QmTY7tWyPiRTLt4ktCEAtTzK9cDaZDYDAJ2BaaHZoe5VhU",
  "what is this"
)
  .then((result) => {
    // Handle the result here
    let myresult = result.result;
    console.log(myresult);

    console.log("Success local llava");
  })
  .catch((error) => {
    // Handle errors if any
    console.error("Error:", error);
  });
