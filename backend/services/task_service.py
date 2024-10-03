from models.task import db, Task, Subtask, Category

def create_task_service(description, category_name):
    category = Category.query.filter_by(name=category_name).first()
    if not category:
        return {'error': 'Category not found'}, 404

    new_task = Task(description=description, category_id=category.id)
    db.session.add(new_task)
    db.session.commit()
    return new_task, 201

def update_task_service(task_id, status, category_name=None):
    task = Task.query.get(task_id)
    if not task:
        return {'error': 'Task not found'}, 404

    if status:
        task.status = status
    if category_name:
        category = Category.query.filter_by(name=category_name).first()
        if category:
            task.category_id = category.id

    db.session.commit()
    return task, 200
