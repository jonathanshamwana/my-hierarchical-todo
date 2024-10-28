from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from models import db, Task, Subtask, Category, CompletedTask, SubSubtask
from dotenv import load_dotenv
import os
from functools import wraps
import jwt

# Blueprint for task-related routes
tasks_bp = Blueprint('tasks', __name__)

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

def token_required(f):
    """
    Decorator to enforce JWT-based authentication on routes.
    I.e. ensures that users are logged in and performing actions on their own data.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Extract token from the header

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user_id, *args, **kwargs) # Pass user ID to the decorated function
    return decorated

@tasks_bp.route('/', methods=['GET'])
@token_required
def get_tasks(current_user_id):
    """
    Retrieve all tasks, including subtasks and sub-subtasks, for the authenticated user.
    """
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    # Format the response with nested subtasks and sub-subtasks
    task_list = [{
        'id': task.id,
        'description': task.description,
        'status': task.status,
        'category': task.category.name,
        'subtasks': [{
            'id': subtask.id,
            'description': subtask.description,
            'subsubtasks': [{
                'id': subsubtask.id,
                'description': subsubtask.description
            } for subsubtask in subtask.subsubtasks]
        } for subtask in task.subtasks]
    } for task in tasks]

    return jsonify(task_list), 200


@tasks_bp.route('/', methods=['POST'])
@token_required
def create_task(current_user_id):
    """
    Create a new task with optional subtasks for the authenticated user.
    """
    data = request.get_json()
    category = Category.query.filter_by(name=data['category']).first()
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    # Create the task object and commit it to the database
    new_task = Task(
        description=data['description'],
        category_id=category.id,
        user_id=current_user_id
    )
    db.session.add(new_task)
    db.session.commit() 

    # Create subtasks IF provided in the request data
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

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user_id, task_id):
    """
    Delete a task and all associated subtasks for the authenticated user.
    """
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    # Delete associated subtasks before deleting the task
    for subtask in task.subtasks:
        db.session.delete(subtask)

    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task and subtasks deleted'}), 200

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@token_required
def update_category_or_status(current_user_id, task_id):
    """
    Update the category or status a task.
    E.g., moving a task from 'Running' to 'Nutrition', or moving a Running task to 'Completed'
    """
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403
    
    data = request.get_json()
    
    task.status = data.get('status', task.status)
    new_category = Category.query.filter_by(name=data.get('category')).first()
    if new_category:
        task.category_id = new_category.id
    
    db.session.commit()
    return jsonify({'message': 'Task updated', 'task_id': task.id}), 200

@tasks_bp.route('/subtasks/<int:subtask_id>', methods=['DELETE'])
@token_required
def delete_subtask(current_user_id, subtask_id):
    """
    Delete a subtask and all associated sub-subtasks.
    """

    subtask = Subtask.query.get_or_404(subtask_id)

    task = Task.query.get(subtask.task_id)
    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    db.session.delete(subtask)
    db.session.commit()

    return jsonify({'message': 'Subtask and sub-subtasks deleted'}), 200

@tasks_bp.route('/<int:task_id>/subtasks', methods=['POST'])
@token_required
def create_subtask(current_user_id, task_id):
    """
    Create a new subtask for a specified task.
    """
    task = Task.query.get(task_id)
    
    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    new_subtask = Subtask(
        description=data['description'],
        task_id=task_id
    )
    db.session.add(new_subtask)
    db.session.commit()

    return jsonify({'message': 'Subbtask created', 'subtask_id': new_subtask.id}), 201

@tasks_bp.route('/subtasks/<int:subtask_id>/subsubtasks', methods=['POST'])
@token_required
def create_subsubtask(current_user_id, subtask_id):
    """
    Create a new sub-subtask for a specified subtask.
    """
    subtask = Subtask.query.get_or_404(subtask_id)
    task = Task.query.get(subtask.task_id)
    
    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    data = request.get_json()
    new_subsubtask = SubSubtask(
        description=data['description'],
        subtask_id=subtask_id
    )
    db.session.add(new_subsubtask)
    db.session.commit()

    return jsonify({'message': 'Sub-subtask created', 'subsubtask_id': new_subsubtask.id}), 201

@tasks_bp.route('/subsubtasks/<int:subsubtask_id>', methods=['DELETE'])
@token_required
def delete_subsubtask(current_user_id, subsubtask_id):
    """
    Delete a specific sub-subtask.
    """
    subsubtask = SubSubtask.query.get_or_404(subsubtask_id)
    subtask = Subtask.query.get(subsubtask.subtask_id)
    task = Task.query.get(subtask.task_id)

    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    db.session.delete(subsubtask)
    db.session.commit()

    return jsonify({'message': 'Sub-subtask deleted'}), 200

@tasks_bp.route('/complete/<int:task_id>', methods=['POST'])
@token_required
def complete_task(current_user_id, task_id):
    """
    Mark a task as completed, move it to the CompletedTask table, and delete it from active tasks.
    """
    task = Task.query.get_or_404(task_id)

    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    subtasks_data = [{'id': subtask.id, 'description': subtask.description} for subtask in task.subtasks]

    completed_task = CompletedTask(
        description=task.description,
        subtasks=str(subtasks_data),
        completion_date=datetime.now(timezone.utc),
        user_id=current_user_id
    )

    db.session.add(completed_task)
    db.session.delete(task)
    db.session.commit()

    return jsonify({'message': 'Task completed successfully'}), 201

@tasks_bp.route('/subtasks/complete/<int:subtask_id>', methods=['POST'])
@token_required
def complete_subtask(current_user_id, subtask_id):
    """
    Mark a subtask as completed, remove it from active subtasks, and store in CompletedTask if applicable.
    """
    subtask = Subtask.query.get_or_404(subtask_id)
    task = Task.query.get(subtask.task_id)

    # Check if the subtask belongs to the current user
    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    # Mark subtask as completed (you can choose to delete or update status)
    db.session.delete(subtask)
    db.session.commit()

    return jsonify({'message': 'Subtask completed successfully'}), 200

@tasks_bp.route('/subsubtasks/complete/<int:subsubtask_id>', methods=['POST'])
@token_required
def complete_subsubtask(current_user_id, subsubtask_id):
    """
    Mark a sub-subtask as completed, remove it from active sub-subtasks, and store in CompletedTask if applicable.
    """
    subsubtask = SubSubtask.query.get_or_404(subsubtask_id)
    subtask = Subtask.query.get(subsubtask.subtask_id)
    task = Task.query.get(subtask.task_id)

    # Check if the sub-subtask belongs to the current user
    if task.user_id != current_user_id:
        return jsonify({'message': 'Permission denied'}), 403

    # Mark sub-subtask as completed (you can choose to delete or update status)
    db.session.delete(subsubtask)
    db.session.commit()

    return jsonify({'message': 'Sub-Subtask completed successfully'}), 200


@tasks_bp.route('/completed', methods=['GET'])
@token_required
def get_completed_tasks(current_user_id):
    """
    Retrieve all completed tasks for the authenticated user.
    """
    completed_tasks = CompletedTask.query.filter_by(user_id=current_user_id).all()
    task_list = [{
        'id': task.id,
        'description': task.description,
        'subtasks': task.subtasks,
        'completion_date': task.completion_date
    } for task in completed_tasks]

    return jsonify(task_list), 200

@tasks_bp.route('/update', methods=['PUT'])
@token_required
def update_item(current_user_id):
    """
    Update the description of a task, subtask, or sub-subtask based on the item type.
    """
    data = request.json
    item_id = data.get("id")
    item_type = data.get("type")
    description = data.get("description")

    if not item_id or not item_type or not description:
        return jsonify({"error": "Invalid request parameters"}), 400

    # Determine item type and retrieve corresponding object
    try:
        if item_type == "task":
            item = Task.query.get(item_id)
        elif item_type == "subtask":
            item = Subtask.query.get(item_id)
        elif item_type == "subsubtask":
            item = SubSubtask.query.get(item_id)
        else:
            return jsonify({"error": "Invalid item type"}), 400

        # Verify user ownership for each item type
        if isinstance(item, Task) and item.user_id != current_user_id:
            return jsonify({"error": "Permission denied"}), 403
        elif isinstance(item, Subtask):
            task = Task.query.get(item.task_id)
            if task.user_id != current_user_id:
                return jsonify({"error": "Permission denied"}), 403
        elif isinstance(item, SubSubtask):
            subtask = Subtask.query.get(item.subtask_id)
            task = Task.query.get(subtask.task_id)
            if task.user_id != current_user_id:
                return jsonify({"error": "Permission denied"}), 403

        if item:
            item.description = description
            db.session.commit()
            return jsonify({"message": "Item updated successfully"}), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

