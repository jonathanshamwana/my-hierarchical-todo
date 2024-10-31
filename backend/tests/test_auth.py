import unittest
from auth import auth_bp
from backend.app import create_app, db
from models import User

class AuthTestCase(unittest.TestCase):

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
