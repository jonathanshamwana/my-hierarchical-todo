from models import db, Category

# Create category instances
categories = ['Running', 'Recovery', 'Gym', 'Nutrition']

for category_name in categories:
    new_category = Category(name=category_name)
    db.session.add(new_category)

# Commit the changes to the database
db.session.commit()

print("Categories inserted successfully!")