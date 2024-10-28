from flask import Blueprint, jsonify, request
from gcalendar_api import get_calendar_service
from openai_api import suggest_time_slots 
import datetime

scheduler_bp = Blueprint('scheduler', __name__)

@scheduler_bp.route('/schedule-task', methods=['POST'])
def schedule_task():
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

        # Get time slot suggestions from OpenAI
        response = suggest_time_slots({"events": event_data, "duration": task_duration})
        suggestions = response.json.get('suggestions')

        return jsonify({"suggestions": suggestions}), 200
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to schedule task"}), 500