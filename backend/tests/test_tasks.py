import unittest
from unittest.mock import patch
from backend.app import create_app, db
from backend.models.models import User, Task

class TaskTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app(config_name='testing')
        cls.client = cls.app.test_client()
        cls.app_context = cls.app.app_context()
        cls.app_context.push()
        db.create_all()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def setUp(self):
        # Clear out previous users before each test
        db.session.query(User).delete()

    @patch('jwt.decode')  # Mock JWT decode directly
    def test_create_task(self, mock_decode):
        mock_decode.return_value = {'user_id': 1}

        # Add a mock user and category for the test
        user = User(username="testuser", email="testuser@example.com")
        user.set_password("password")
        db.session.add(user)
        db.session.commit()

        # Create a new task
        response = self.client.post('/api/tasks/', json={
            "description": "New Task",
            "category": "Running",
            "subtasks": [{"name": "Subtask 1"}]
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("Task and subtasks created", response.get_data(as_text=True))

    @patch('jwt.decode')
    def test_get_tasks(self, mock_decode):
        mock_decode.return_value = {'user_id': 1}

        # Add mock data for retrieval test
        user = User(username="testuser", email="testuser@example.com")
        user.set_password("password")
        db.session.add(user)
        task = Task(description="Retrieve Task", user_id=user.id, category_id=1)
        db.session.add(task)
        db.session.commit()

        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data[0]['description'], "Retrieve Task")

    @patch('jwt.decode')
    def test_delete_task(self, mock_decode):
        mock_decode.return_value = {'user_id': 1}

        # Add mock data for deletion test
        task = Task(description="Task to delete", user_id=1, category_id=1)
        db.session.add(task)
        db.session.commit()

        response = self.client.delete(f'/api/tasks/{task.id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Task and subtasks deleted", response.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main()
