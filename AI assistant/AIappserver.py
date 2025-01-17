from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from langchain_groq.chat_models import ChatGroq
from pandasai import SmartDataframe
import os

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

llm = ChatGroq(model_name="llama3-70b-8192", api_key="")
uploaded_file_path = None

@app.route('/upload', methods=['POST'])
def upload_file():
    global uploaded_file_path
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)
    uploaded_file_path = file_path
    return jsonify({"message": "File uploaded successfully"}), 200

@app.route('/query', methods=['POST'])
def query_data():
    global uploaded_file_path
    if uploaded_file_path is None:
        return jsonify({"response": "Please upload a CSV file first"}), 400

    data = request.get_json()
    query = data['query']

    df = pd.read_csv(uploaded_file_path)
    sdf = SmartDataframe(df, config={"llm": llm})
    response = sdf.chat(query)
    
    return jsonify({"response": response})

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True, host='0.0.0.0', port=4500)
