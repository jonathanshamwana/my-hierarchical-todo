from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    tasks = db.relationship('Task', backref='category', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default='ToDo')
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    subtasks = db.relationship('Subtask', backref='task', lazy=True)

class Subtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    subsubtasks = db.relationship('SubSubtask', backref='subtask', lazy=True)

class SubSubtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    subtask_id = db.Column(db.Integer, db.ForeignKey('subtask.id'), nullable=False)
