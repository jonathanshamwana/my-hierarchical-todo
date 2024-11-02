from flask import Blueprint, jsonify, request
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

openai_bp = Blueprint('openai', __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@openai_bp.route('/suggest-time-slots', methods=['POST'])
def suggest_time_slots(data):
    """
    Fetches optimal time slots based on user's calendar events, Strava activities, and task details.
    """
    event_data = data.get('events', [])
    task_duration = data.get('duration', 60)
    task_description = data.get('task_description', 'Scheduled activity')
    strava_data = data.get('strava_activities', []) 

    prompt = (
        f"Based on the following calendar events and Strava activities, suggest an optimal {task_duration}-minute "
        f"time slot for an activity described as: {task_description}. Provide the response as a JSON object with fields: "
        f"'justification', 'date', 'time', and 'event_data', where 'event_data' includes 'summary', 'start_date', "
        f"'end_date', and 'time_zone'. Avoid overlap with events and workouts, and align the suggestion with typical scheduling preferences.\n\n"
        f"Calendar Events: {event_data}\n"
        f"Strava Activities: {strava_data}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format="json"
        )
        response_content = response.choices[0].message.content.strip()
        suggested_time_slots = json.loads(response_content)

        return suggested_time_slots
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to get time suggestions"}), 500
