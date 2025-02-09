from flask import Flask, request, Response
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from agents.agents_framework import process_user_message
from langchain_core.messages import HumanMessage

load_dotenv()

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")
MONGODB_URI = os.environ['MONGODB_URI']

print(MONGODB_URI)

client = MongoClient(MONGODB_URI)

for db_info in client.list_database_names():
        print(db_info)

@app.route('/api/hello')
def hello():
    return {'message': 'Hello from Flask!'}

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    
    def generate():
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_message}],
            stream=True
        )
        for chunk in response:
            if "content" in chunk["choices"][0]:
                yield chunk["choices"][0]["content"]
    
    return Response(generate(), content_type="text/plain")

@app.route("/agent", methods=["POST"])
def agent(): 
    user_message = request.json.get("message")
    
    def generate():
        responses = process_user_message(user_message)
        for response in responses:
            yield str(response) + "\n----\n"
    
    return Response(generate(), content_type="text/plain")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
    
    