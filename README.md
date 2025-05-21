# AI and digital twin-Driven Smart Building Facilities Management

## Project Overview

This project focuses on implementing a AI and Digital twin-driven decision support system for for smart building facilities management using digital twins, and large language models (LLMs). The aim is to enhance facility management through AI-driven insights and digital twin visualizations.
<img src="/fig1.png" style="float: left; margin-right: 20px; max-width: 200px;">
<img src="/fig2.png" style="float: left; margin-right: 20px; max-width: 200px;">

### Key Features
- **Digital Twin Visualization:** Creates a virtual replica of building systems to provide real-time monitoring and decision support.
- **Large Language Models (LLMs):** Incorporates LLMs for advanced data analysis and natural language processing to improve governance and operational efficiency.
- **AI-Driven Insights:** Provides actionable insights through AI and data analytics to optimize building management and operations.

## Video Demo

[![Watch the demo video](https://img.youtube.com/vi/aH_DdPCd3Rc/0.jpg)](https://www.youtube.com/watch?v=aH_DdPCd3Rc)  
*Click on the image to view the video.*


### Requirements
- Open-source Large language model (e.g., LLaMA)
- Groq API
- Generative AI inference tool. llama.cpp
- Python 3.10
- Raspberry Pi and IoT sensors


## 🛠️ Detailed Setup Guide

This tutorial uses the [Groq API](https://console.groq.com/) for LLM inference. Follow the steps below to set up the system:

### 1. Install Required Libraries

Install the [PandasAI](https://pandas-ai.com/) library:

### 2. Get Your Groq API Key

Register for a Groq account at: [https://console.groq.com/](https://console.groq.com/)

Once registered, generate your API key.

---

### 3. Configure the AI Assistant Script

- Navigate to the `AIassistant/` folder.
- Open `AIappchat.py` and insert your Groq API key where required.
- You can specify the LLM model to use (e.g., `llama3`, `mistral`).

---



### 4. Run the AI Assistant App

Use Chainlit to launch the assistant:
chainlit run AIappchat.py


### 5. Test Data Analysis Capabilities
You can test the AI assistant’s data analysis features using any IoT sensor dataset.
An example dataset is included in the `AIassistant/` folder.


