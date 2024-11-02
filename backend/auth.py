from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from models import db, User
import jwt
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os

auth_bp = Blueprint('auth', __name__)

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    """
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Email already exists. Please try another email.'}), 400

    # Generate a JWT token with a 24-hour expiration for the new user
    token = jwt.encode(
        {'user_id': new_user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=24)},
        SECRET_KEY,
        algorithm='HS256'
    )

    # Return a success message and the generated token
    return jsonify({'message': 'User registered successfully', 'token': token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Log in an existing user.
    """
    print("FETCHING DATA FROM REQUEST")
    data = request.get_json()
    print("DATA:", data)

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password_hash, data['password']): 
        return jsonify({'message': 'Invalid email or password'}), 401

    # Generate a JWT token with a 24-hour expiration for the authenticated user
    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=24)}, 
        SECRET_KEY,
        algorithm='HS256'
    )

    # Return the token in the response
    return jsonify({'token': token}), 200

@auth_bp.route('/user', methods=['GET'])
def get_user():
    """
    Get details of the authenticated user.
    """
    token = request.headers.get('Authorization', None)
    print("TOKEN: ", token)

    if not token:
        return jsonify({'message': 'Token is missing!'}), 401

    try:
        decoded_token = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_token['user_id']
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Return user details
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token is invalid'}), 401
