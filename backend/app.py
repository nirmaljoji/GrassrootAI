from flask import Flask, request, Response
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")

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



if __name__ == '__main__':
    app.run(debug=True, port=5001)