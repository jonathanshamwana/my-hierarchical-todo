from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from tasks import tasks_bp

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

db.init_app(app)

# with app.app_context():
#     db.create_all()

app.register_blueprint(tasks_bp, url_prefix='/api/tasks')

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the Hybrid Athlete Task Manager API", 200

if __name__ == '__main__':
    app.run(debug=True)
