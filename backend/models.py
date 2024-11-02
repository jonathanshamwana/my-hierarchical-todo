from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# User Model with password management and task relationship
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    tasks = db.relationship('Task', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify the users password."""
        return check_password_hash(self.password_hash, password)


# Category Model for Task categorization
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    tasks = db.relationship('Task', backref='category', lazy='dynamic')


# Task Model with relationship to Subtasks
class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='in-progress', nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    completion_date = db.Column(db.DateTime, nullable=True)  # New column for completion date
    subtasks = db.relationship('Subtask', backref='task', lazy='dynamic', cascade='all, delete-orphan')


# Subtask Model with relationship to SubSubtasks
class Subtask(db.Model):
    __tablename__ = 'subtasks'
    
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='in-progress', nullable=False) 
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    subsubtasks = db.relationship('SubSubtask', backref='subtask', lazy='dynamic', cascade='all, delete-orphan')


# SubSubtask Model
class SubSubtask(db.Model):
    __tablename__ = 'subsubtasks'
    
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='in-progress', nullable=False) 
    subtask_id = db.Column(db.Integer, db.ForeignKey('subtasks.id'), nullable=False)

