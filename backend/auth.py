from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401

    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.datetime() + datetime.timedelta(hours=24)},
        'your_secret_key'
    )

    return jsonify({'token': token}), 200
