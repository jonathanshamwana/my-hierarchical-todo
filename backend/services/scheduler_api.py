from flask import Blueprint, jsonify, request
from services.gcalendar_api import get_calendar_service
from services.openai_api import suggest_time_slots 
from services.strava_api import get_strava_activities
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
    """
    Fetch calendar suggestions from openai by passing it task, strava, and calendar data. 
    """
    try:
        # Google Calendar events
        service = get_calendar_service()
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(
            calendarId='primary', timeMin=now, maxResults=20, singleEvents=True, orderBy='startTime'
        ).execute()
        events = [{"summary": event['summary'], "start": event['start'].get('dateTime', event['start'].get('date'))} 
                  for event in events_result.get('items', [])]

        # Strava activities data (if available)
        strava_activities = get_strava_activities().json() if get_strava_activities() else []

        # Task data from request
        task_duration = request.json.get("duration")
        task_description = request.json.get("description")

        # Sending task and scheduling data to OpenAI for a suggestion
        openai_input = {
            "events": events,
            "strava_activities": strava_activities,
            "duration": task_duration,
            "task_description": task_description
        }

        response = suggest_time_slots(openai_input)
        return jsonify({"suggestions": response}), 200
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to schedule task with OpenAI"}), 500