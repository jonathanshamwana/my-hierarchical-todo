from flask import Blueprint, jsonify, request
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import datetime
import os
from tasks import token_required

# Blueprint for calendar-related routes
calendar_bp = Blueprint('calendar', __name__)

# Google API settings
SCOPES = ['https://www.googleapis.com/auth/calendar']
CREDENTIALS_FILE = 'credentials.json'
TOKEN_FILE = 'token.json'

def initialize_credentials():
    """Checks and initializes Google API credentials."""
    creds = None
    # Load credentials from file if it exists
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # Refresh or initialize credentials if invalid
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
            # Save new credentials to file
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
    return creds

def get_calendar_service():
    """Creates and returns a Google Calendar API service instance."""
    creds = initialize_credentials()
    if creds:
        return build('calendar', 'v3', credentials=creds)
    else:
        raise RuntimeError("Failed to initialize credentials")

@calendar_bp.route('/initialize-credentials', methods=['GET'])
@token_required
def init_credentials(current_user_id):
    """Endpoint to initialize credentials if not already done."""
    try:
        initialize_credentials()
        return jsonify({"status": "Credentials initialized successfully"}), 200
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to initialize credentials"}), 500

@calendar_bp.route('/get-upcoming-events', methods=['GET'])
@token_required
def get_upcoming_events(current_user_id):
    """Fetches upcoming events from the user's Google Calendar."""
    try:
        service = get_calendar_service()
        now = datetime.datetime.utcnow().isoformat() + 'Z'  # Format current time for Google API
        events_result = service.events().list(calendarId='primary', timeMin=now,
                                              maxResults=10, singleEvents=True,
                                              orderBy='startTime').execute()
        events = events_result.get('items', [])

        # Format each event for the response
        upcoming_events = [{"summary": event['summary'], "start": event['start'].get('dateTime', event['start'].get('date'))} for event in events]

        for event in upcoming_events:
            print(event)

        return jsonify(upcoming_events)
    except HttpError as error:
        print("An error occurred:", error)
        return jsonify({"error": "Failed to fetch events"}), 500

@calendar_bp.route('/create-event', methods=['POST'])
@token_required
def create_event(current_user_id):
    """Creates a new event on the user's Google Calendar."""
    try:
        service = get_calendar_service()
        event_data = request.json
        print("EVENT DATA:", event_data)
        event = {
            'summary': event_data.get('summary', 'New Event'),
            'location': event_data.get('location', ''),
            'description': event_data.get('description', ''),
            'start': {'dateTime': event_data.get('startDateTime'), 'timeZone': 'America/Los_Angeles'},
            'end': {'dateTime': event_data.get('endDateTime'), 'timeZone': 'America/Los_Angeles'},
            'attendees': [{'email': attendee} for attendee in event_data.get('attendees', [])],
        }
        # Insert event into the calendar
        event = service.events().insert(calendarId='primary', body=event).execute()
        return jsonify({'status': 'Event created', 'eventLink': event.get('htmlLink')})
    except HttpError as error:
        print("An error occurred:", error)
        return jsonify({"error": "Failed to create event"}), 500
