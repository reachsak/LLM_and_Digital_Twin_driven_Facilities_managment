import React, { useState } from "react";

function ReactFunction() {
  const [userInput, setUserInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8768/process_input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });
      const data = await response.text(); // Convert the response to text
      setAiOutput(data); // Set the AI output state with the response text
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>{aiOutput}</div>
    </div>
  );
}

export default ReactFunction;
