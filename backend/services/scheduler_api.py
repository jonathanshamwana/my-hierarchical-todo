from flask import Blueprint, jsonify, request
from services.gcalendar_api import get_calendar_service
from services.openai_api import suggest_time_slots 
from tasks import token_required
import datetime
import os
from dotenv import load_dotenv

scheduler_bp = Blueprint('scheduler', __name__)

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

@scheduler_bp.route('/schedule-task', methods=['POST'])
@token_required
def schedule_task(current_user_id):
    """Fetches time suggestions for scheduling a task."""
    try:
        service = get_calendar_service()
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(calendarId='primary', timeMin=now,
                                              maxResults=20, singleEvents=True,
                                              orderBy='startTime').execute()
        events = events_result.get('items', [])

        # Format event data to send to OpenAI
        event_data = [{"summary": event['summary'], "start": event['start'].get('dateTime', event['start'].get('date'))} for event in events]
        task_duration = request.json.get("duration")
        task_description = request.json.get("description")

        # Get time slot suggestions from OpenAI
        response = suggest_time_slots({"events": event_data, "duration": task_duration, "task_description": task_description })

        return jsonify({"suggestions": response}), 200
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to schedule task"}), 500
