from app import app
from models import db, Category

# List of categories to add
categories = ["Running", "Nutrition", "Recovery", "Gym"]

# script for adding new categories to the Categories table, ran by calling python add_categories.py
with app.app_context():
    for name in categories:
        if not Category.query.filter_by(name=name).first():
            category = Category(name=name)
            db.session.add(category)
            print(f"Added category: {name}")
    db.session.commit()
