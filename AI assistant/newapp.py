import pandas as pd
import sqlite3
import chainlit as cl
from openai import AsyncOpenAI
from pandasai import SmartDataframe
from langchain_community.llms import Ollama
from langchain_groq.chat_models import ChatGroq 
import sqlite3
import os

llm = Ollama(model="deepseek-coder")

@cl.on_chat_start
def start_chat():
    # Set initial message history
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": "You are a helpful assistant."}],
    )

@cl.on_message
async def main(message: cl.Message):
    # Retrieve message history
    message_history = cl.user_session.get("message_history")
    message_history.append({"role": "user", "content": message.content})

    # Load data
    # df = pd.read_excel('data.xlsx')
    df = pd.read_csv('pi.csv')
  

    df = SmartDataframe(df, config={"llm": llm})
    
    question = message.content
    response = df.chat(question)
    msg = cl.Message(content=response)
    
    await msg.send()

    # Update message history and send final message
    message_history.append({"role": "assistant", "content": msg.content})
    await msg.update()