import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from backend.app import create_app
from backend.services.scheduler_api import scheduler_bp
from backend.services.gcalendar_api import get_calendar_service
from backend.services.openai_api import suggest_time_slots

class SchedulingTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Set up the test app
        cls.app = create_app(config_name='testing')
        cls.client = cls.app.test_client()
        cls.app_context = cls.app.app_context()
        cls.app_context.push()
        
    @classmethod
    def tearDownClass(cls):
        cls.app_context.pop()

    @patch('gcalendar_api.get_calendar_service')
    @patch('openai_api.suggest_time_slots')
    def test_schedule_task(self, mock_suggest_time_slots, mock_get_calendar_service):
        # Mock Google Calendar API
        mock_service_instance = MagicMock()
        mock_get_calendar_service.return_value = mock_service_instance
        mock_service_instance.events().list().execute.return_value = {
            'items': [
                {'summary': 'Test Event', 'start': {'dateTime': '2024-11-05T10:00:00'}}
            ]
        }
        
        # Mock OpenAI API
        mock_suggest_time_slots.return_value = {
            "suggestions": [
                {
                    "justification": "Best available time based on calendar",
                    "date": "2024-11-06",
                    "time": "10:00 AM"
                }
            ]
        }

        # Define the request payload
        payload = {
            "description": "New Task",
            "duration": 30
        }

        # Call the /schedule-task endpoint
        response = self.client.post('/scheduler/schedule-task', json=payload)
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("suggestions", data)
        self.assertEqual(data["suggestions"][0]["date"], "2024-11-06")

    @patch('gcalendar_api.get_calendar_service')
    def test_get_upcoming_events(self, mock_get_calendar_service):
        # Mock Google Calendar API's upcoming events response
        mock_service_instance = MagicMock()
        mock_get_calendar_service.return_value = mock_service_instance
        mock_service_instance.events().list().execute.return_value = {
            'items': [
                {'summary': 'Upcoming Event', 'start': {'dateTime': '2024-11-05T10:00:00'}}
            ]
        }

        response = self.client.get('/calendar/get-upcoming-events')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data[0]['summary'], 'Upcoming Event')

    @patch('openai_api.suggest_time_slots')
    def test_suggest_time_slots(self, mock_suggest_time_slots):
        # Mock OpenAI API response
        mock_suggest_time_slots.return_value = {
            "suggestions": [
                {
                    "justification": "Suggested slot fits well",
                    "date": "2024-11-06",
                    "time": "2:00 PM"
                }
            ]
        }

        # Define event and task data for OpenAI suggestion
        event_data = {"events": [], "duration": 60, "task_description": "Project Meeting"}
        response = suggest_time_slots(event_data)
        
        # Assertions
        self.assertIn("suggestions", response)
        self.assertEqual(response["suggestions"][0]["date"], "2024-11-06")
        self.assertEqual(response["suggestions"][0]["time"], "2:00 PM")

if __name__ == '__main__':
    unittest.main()
