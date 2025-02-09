from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import os
import re
from pymongo import MongoClient
from agents.agents_framework import process_user_message
from langchain_core.messages import HumanMessage
from bson import ObjectId
from datetime import datetime
import json


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


@app.route("/resources", methods=["POST"])
def resources():
    # Make an api call to mongodb and get all the resources and return them
    data = request.get_json() or {}
    event_id = data.get("eventId")
    
    if not event_id:
        return jsonify({"error": "Missing eventId in request body"}), 400
        
    result = []
    
    for resource in client['sanctuary']['resources'].find({}):
        print(resource)
        resource["_id"] = str(resource["_id"])
        result.append(resource)
    return Response(json.dumps(result), content_type="application/json")

@app.route("/agent", methods=["POST"])
def agent():
    user_message = request.json.get("message")
    
    def generate():
        # We assume process_user_message() returns a list of responses
        responses = process_user_message(user_message)
        social_outreach_items = []
        resource_items = []
        event_id = None

        for response in responses:
            response_str = str(response)

            # Create event entry first if it doesn't exist
            if not event_id and ("'Social_Outreach'" in response_str or "'Resources'" in response_str):
                event_id = str(ObjectId())
                events_collection = client['sanctuary']['events']
                events_collection.insert_one({
                    'event_id': event_id,
                    'created_at': datetime.utcnow()
                })

            # Check if 'Social_Outreach' is mentioned in the response
            if "'Social_Outreach'" in response_str:
                # Extract everything between content='...'
                match = re.search(r"content='(.+?)'", response_str, re.DOTALL)
                if match:
                    raw_content = match.group(1)
                    
                    # Use a regex that splits on either an actual newline or a literal "\n"
                    items = re.split(r'(?:\n|\\n)\s*-\s*', raw_content.strip())
                    print(items)

                    # Clean up each item and ensure only alphabetical characters and spaces
                    social_outreach_items = [re.sub(r'[^a-zA-Z\s]', '', item.strip("- ").strip())
                                             for item in items if item.strip()]
                    # Remove any empty strings that might result from the cleaning
                    social_outreach_items = [item for item in social_outreach_items if item.strip()]

                    # Generate a unique event ID
                    event_id = str(ObjectId())
                    social_outreach_collection = client['sanctuary']['social_outreach']

                    # Store each group as a separate row/document in MongoDB
                    for group_name in social_outreach_items:
                        social_outreach_collection.insert_one({
                            'event_id': event_id,
                            'group_name': group_name
                        })

            # Check if 'Resources' is mentioned in the response
            if "'Resources'" in response_str:
                # Extract everything between content='...'
                match = re.search(r"content='(.+?)'", response_str, re.DOTALL)
                if match:
                    raw_content = match.group(1)
                    
                    # Use the same regex pattern as social outreach
                    items = re.split(r'(?:\n|\\n)\s*-\s*', raw_content.strip())
                    print(items)

                    # Clean up each item and ensure only alphabetical characters and spaces
                    resource_items = [re.sub(r'[^a-zA-Z\s]', '', item.strip("- ").strip())
                                    for item in items if item.strip()]
                    # Remove any empty strings that might result from the cleaning
                    resource_items = [item for item in resource_items if item.strip()]

                    # Use the same event ID as social outreach
                    if not event_id:
                        event_id = str(ObjectId())
                    resources_collection = client['sanctuary']['resources']

                    # Store each resource as a separate row/document in MongoDB
                    for resource in resource_items:
                        resources_collection.insert_one({
                            'event_id': event_id,
                            'resource': resource
                        })

            yield response_str + "\n----\n"
        
        # After all responses, display both social outreach items and resources
        if social_outreach_items and event_id:
            yield "\n*Social Outreach Groups*:\n"
            for group in social_outreach_items:
                yield f"- {group}\n"

        if resource_items and event_id:
            yield "\n*Required Resources*:\n"
            for resource in resource_items:
                yield f"- {resource}\n"

        if event_id:
            yield f"\n*Event ID*: {event_id}\n"

    return Response(generate(), content_type="text/plain")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
    
    