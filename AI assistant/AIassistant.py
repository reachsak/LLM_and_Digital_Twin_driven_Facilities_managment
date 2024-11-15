import pandas as pd
import chainlit as cl
from pandasai import SmartDataframe
from langchain_groq.chat_models import ChatGroq 
import io

llm = ChatGroq()

@cl.on_chat_start
async def start_chat():
    # Set initial message history
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": "You are a helpful assistant."}],
    )
    
    # Prompt user to upload a CSV file
    await cl.Message(content="Please upload a CSV file to begin.").send()
    
    files = await cl.AskFileMessage(
        content="Upload a CSV file",
        accept=["text/csv"],
        max_size_mb=10
    ).send()

    # Read the uploaded CSV file
    if files and len(files) > 0:
        file = files[0]  # Get the first file from the list
        df = pd.read_csv(file.path)
        
        # Store the dataframe in the user session
        cl.user_session.set("df", SmartDataframe(df, config={"llm": llm}))
        
        await cl.Message(content=f"File '{file.name}' has been successfully uploaded and processed. You can now ask questions about the data.").send()
    else:
        await cl.Message(content="No file was uploaded. Please try again.").send()

@cl.on_message
async def main(message: cl.Message):
    # Retrieve message history and dataframe
    message_history = cl.user_session.get("message_history")
    df = cl.user_session.get("df")
    
    if df is None:
        await cl.Message(content="No data has been uploaded yet. Please start a new chat and upload a CSV file.").send()
        return

    message_history.append({"role": "user", "content": message.content})

    question = message.content
    response = df.chat(question)
    msg = cl.Message(content=response)
    
    await msg.send()

    # Update message history and send final message
    message_history.append({"role": "assistant", "content": msg.content})
    await msg.update()

# Run the Chainlit app
if __name__ == "__main__":
    cl.run()