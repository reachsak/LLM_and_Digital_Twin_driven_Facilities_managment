from pandasai import SmartDataframe
import pandas as pd

from langchain_groq.chat_models import ChatGroq


from langchain_community.llms import Ollama
import sqlite3
import os

llm = Ollama(model="deepseek-coder")
df =pd.read_excel("./examples/data/Loan payments data.xlsx")
df = SmartDataframe(df, config={"llm": llm})
response = df.chat("what is this about")
print(response)