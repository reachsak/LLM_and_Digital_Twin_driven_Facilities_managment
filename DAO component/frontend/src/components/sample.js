const callPythonAPI = require("./llavaapi");

callPythonAPI(
  "https://gateway.pinata.cloud/ipfs/QmTY7tWyPiRTLt4ktCEAtTzK9cDaZDYDAJ2BaaHZoe5VhU",
  "what is this"
)
  .then((result) => {
    // Handle the result here
    let myresult = result;
    console.log(myresult);

    console.log("Success local llava");
  })
  .catch((error) => {
    // Handle errors if any
    console.error("Error:", error);
  });
