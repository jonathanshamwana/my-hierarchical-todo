from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from tasks import tasks_bp
from services.gcalendar_api import calendar_bp
from services.openai_api import openai_bp
from services.scheduler_api import scheduler_bp
from auth import auth_bp
from flask_migrate import Migrate

# Initiliaze the Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config.from_object(Config)

# Configure the database
db.init_app(app)
migrate = Migrate(app, db)

# Register the blueprints for task handling, authorization, and externl services
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(calendar_bp, url_prefix="/api/calendar")
app.register_blueprint(openai_bp, url_prefix="/api/openai")
app.register_blueprint(scheduler_bp, url_prefix="/api/scheduler")

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the Hybrid Athlete Task Manager API", 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
