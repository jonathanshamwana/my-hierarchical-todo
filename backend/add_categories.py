from app import db
from models import Category  

running = Category(name='Running')
gym = Category(name='Gym')
nutrition = Category(name='Nutrition')
recovery = Category(name='Recovery')

db.session.add(running)
db.session.add(gym)
db.session.add(nutrition)
db.session.add(recovery)
db.session.commit()

print("Categories added to the database!")
