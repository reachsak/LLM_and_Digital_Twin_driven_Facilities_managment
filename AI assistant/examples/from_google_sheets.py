"""Example of using PandasAI with am Excel file."""
from langchain_community.llms import Ollama


import os

from pandasai import Agent


google_sheets_url = "https://docs.google.com/spreadsheets/d/1TKkShoJNiUojEwMXmZEIyANwrbolmtZSMYQn2tPbyO4/edit#gid=0"  # noqa E501


agent = Agent(google_sheets_url, config={"llm": Ollama(model="codestral")})
response = agent.chat("what is this about")
print(response)
# Output: 35
