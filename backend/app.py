from flask import Flask, request, Response
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from agents.agents_framework import process_user_message
from langchain_core.messages import HumanMessage
import json
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")
MONGODB_URI = os.environ['MONGODB_URI']

print(MONGODB_URI)

client = MongoClient(MONGODB_URI)
db = client['events_db']
events_collection = db['events']

for db_info in client.list_database_names():
        print(db_info)

def extract_event_details(text: str):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": """You are an event planning assistant. Extract event details from the user's message.
                    Return ONLY a JSON object with these fields:
                    {
                        "event": "exact event name or null",
                        "location": "exact location or null",
                        "budget": number without currency symbol or null,
                        "num_of_people": number only or null,
                        "date": "YYYY-MM-DD format or null"
                    }
                    Extract ONLY what is explicitly mentioned. Do not infer or guess."""
            }, {
                "role": "user",
                "content": text
            }]
        )
        return json.loads(response.choices[0].message['content'])
    except:
        return None

def get_next_prompt(event_doc):
    if not event_doc or not event_doc.get('event'):
        return "To help plan your event, I need some details. What's the name of your event?"
    
    if not event_doc.get('location'):
        return f"Great! Where will '{event_doc['event']}' be held?"
    
    if not event_doc.get('budget'):
        return "What's your budget for this event?"
    
    if not event_doc.get('num_of_people'):
        return "How many people are you expecting at the event?"
    
    if not event_doc.get('date'):
        return "What's the date for your event? (Please specify in YYYY-MM-DD format)"
    
    return "Perfect! I have all the essential details. Would you like to review them or discuss something specific?"

@app.route('/api/hello')
def hello():
    return {'message': 'Hello from Flask!'}

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message")
        print(f"Received message: {user_message}")  # Debug log
        
        # Extract event details from the message
        event_details = extract_event_details(user_message)
        print(f"Extracted details: {event_details}")  # Debug log
        
        # Update database if new details were found
        if event_details:
            non_null_updates = {k: v for k, v in event_details.items() if v is not None}
            if non_null_updates:
                print(f"Updating DB with: {non_null_updates}")  # Debug log
                events_collection.update_one(
                    {}, 
                    {"$set": non_null_updates},
                    upsert=True
                )
        
        # Get current state and next prompt
        event_doc = events_collection.find_one()
        if event_doc:
            del event_doc['_id']
        else:
            event_doc = {}
        
        next_prompt = get_next_prompt(event_doc)
        print(f"Next prompt: {next_prompt}")  # Debug log

        return json.dumps({
            "message": next_prompt,
            "updated_fields": event_doc,
        })
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Error log
        return json.dumps({
            "message": f"An error occurred: {str(e)}",
            "updated_fields": {}
        }), 500

@app.route("/event-details", methods=["GET"])
def get_event_details():
    event_doc = events_collection.find_one()
    if event_doc:
        del event_doc['_id']
        return json.dumps(event_doc)
    return json.dumps({
        "event": None,
        "location": None,
        "budget": None,
        "num_of_people": None,
        "date": None
    })

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
    
    