import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

import unittest
from unittest.mock import patch
from backend.app import app, db 
from backend.models import User
from backend.models import Category

API_BASE_URL = 'http://127.0.0.1:5000'

class TaskTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.app_context = app.app_context()
        cls.app_context.push()
        db.create_all()
        running_category = Category(name="Running")
        db.session.add(running_category)
        db.session.commit()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def setUp(self):
        db.session.query(User).delete()

    @patch('jwt.decode')
    def test_create_task(self, mock_decode):
        mock_decode.return_value = {'user_id': 1}
        headers = {'Authorization': 'Bearer mock_token'}
        
        response = self.client.post(f'{API_BASE_URL}/api/tasks/', json={
            "description": "New Task",
            "category": "Running",
            "subtasks": [{"name": "Subtask 1"}]
        }, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertIn("Task and subtasks created", response.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main()

