const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8765 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("Received message from client:", message);

    // Process the message if needed

    // Send a response back to the client
    const response = "Message received by the server";
    ws.send(response);
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});
