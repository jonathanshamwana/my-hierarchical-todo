from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
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
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    token = jwt.encode(
        {'user_id': new_user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=24)},
        SECRET_KEY,
        algorithm='HS256'
    )

    return jsonify({'message': 'User registered successfully', 'token': token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password_hash, data['password']): 
        return jsonify({'message': 'Invalid email or password'}), 401

    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=24)}, 
        SECRET_KEY,
        algorithm='HS256'
    )
    print("Generated Token:", token)
    
    return jsonify({'token': token}), 200
