import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

import unittest
from backend.app import app, db
from backend.models import User

class AuthTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.app_context = app.app_context()
        cls.app_context.push()
        db.create_all()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def test_user_registration(self):
        response = self.client.post('/auth/register', json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("User registered successfully", response.get_data(as_text=True))

    def test_user_login(self):
        # Register a user for login test
        user = User(username="logintest", email="logintest@example.com")
        user.set_password("password")
        db.session.add(user)
        db.session.commit()

        response = self.client.post('/auth/login', json={
            "email": "logintest@example.com",
            "password": "password"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.get_json())

if __name__ == '__main__':
    unittest.main()
