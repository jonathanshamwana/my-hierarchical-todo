from flask import Blueprint, request, jsonify
from models.task import db, Task, Subtask, Category

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['POST'])
def create_task():
    data = request.get_json()
    category = Category.query.filter_by(name=data['category']).first()
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    new_task = Task(
        description=data['description'],
        category_id=category.id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created', 'task_id': new_task.id}), 201

@tasks_bp.route('/', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    task_list = [{
        'id': task.id,
        'description': task.description,
        'status': task.status,
        'category': task.category.name,
        'subtasks': [{'id': subtask.id, 'description': subtask.description} for subtask in task.subtasks]
    } for task in tasks]

    return jsonify(task_list), 200

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    
    task.status = data.get('status', task.status)
    new_category = Category.query.filter_by(name=data.get('category')).first()
    if new_category:
        task.category_id = new_category.id
    
    db.session.commit()
    return jsonify({'message': 'Task updated', 'task_id': task.id}), 200

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200
