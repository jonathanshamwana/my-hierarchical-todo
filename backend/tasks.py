from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Task, Subtask, Category, CompletedTask

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

    if 'subtasks' in data:
        for subtask_data in data['subtasks']:
            if subtask_data['name'].strip() != '':
                new_subtask = Subtask(
                    description=subtask_data['name'],
                    task_id=new_task.id 
                )
                db.session.add(new_subtask)
    
    db.session.commit() 

    return jsonify({'message': 'Task and subtasks created', 'task_id': new_task.id}), 201


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

    for subtask in task.subtasks:
        db.session.delete(subtask)

    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task and subtasks deleted'}), 200

@tasks_bp.route('/subtasks/<int:subtask_id>', methods=['DELETE'])
def delete_subtask(subtask_id):
    subtask = Subtask.query.get_or_404(subtask_id)

    for sub_subtask in subtask.sub_subtasks:
        db.session.delete(sub_subtask)

    db.session.delete(subtask)
    db.session.commit()

    return jsonify({'message': 'Subtask and sub-subtasks deleted'}), 200

@tasks_bp.route('/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)

    subtasks_data = [{'id': subtask.id, 'description': subtask.description} for subtask in task.subtasks]

    completed_task = CompletedTask(
        description=task.description,
        subtasks=str(subtasks_data),
        completion_date=datetime.utcnow()
    )

    db.session.add(completed_task)
    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task completed successfully'}), 201

@tasks_bp.route('/completed', methods=['GET'])
def get_completed_tasks():
    completed_tasks = CompletedTask.query.all()
    task_list = [{
        'id': task.id,
        'description': task.description,
        'subtasks': task.subtasks,
        'completion_date': task.completion_date
    } for task in completed_tasks]

    return jsonify(task_list), 200

