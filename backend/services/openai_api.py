from flask import Blueprint, jsonify, request
from openai import OpenAI, OpenAIError
import os
from dotenv import load_dotenv
import json

load_dotenv()

openai_bp = Blueprint('openai', __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@openai_bp.route('/suggest-time-slots', methods=['POST'])
def suggest_time_slots(data):
    """
    Fetches optimal time slots based on user's calendar events and task details.
    """
    event_data = data['events']  # default to empty list if not provided
    task_duration = data['duration']  # default duration if none provided
    task_description = data['task_description']

    '''
    OpenAI prompt that passes the upcoming calendar events and new task so it can find an optimal time slot
    Specifies a JSON output with a particular schema so the output is easily useable. 
    '''
    prompt = (
        f"Based on the following calendar events, suggest an optimal {task_duration}-minute time slot for activity with description: {task_description}"
        f"Provide the response as a JSON object with fields: 'justification', 'date', 'time', and 'event_data', where "
        f"'event_data' includes 'summary', 'start_date', 'end_date', and 'time_zone'. Avoid overlap with events and ensure the suggestion aligns with typical scheduling preferences.\n\n"
        f"Calendar Events: {event_data}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        response_content = response.choices[0].message.content.strip()

        # Load the OpenAI output (string) into a Python dictionary for ease of processing on the frontend 
        suggested_time_slots = json.loads(response_content)

        return suggested_time_slots
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to get time suggestions"}), 500
