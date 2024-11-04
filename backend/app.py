from flask import Flask, request
from flask_cors import CORS
from config import Config
from models import db
from tasks import tasks_bp
from services.gcalendar_api import calendar_bp
from services.openai_api import openai_bp
from services.scheduler_api import scheduler_bp
from auth import auth_bp
from flask_migrate import Migrate
import logging
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Configure CORS based on debug mode
is_debug_mode = os.getenv("FLASK_DEBUG", "0") == "1"
if not is_debug_mode:
    CORS(app, resources={r"/*": {"origins": "https://26club.vercel.app"}})
else:
    CORS(app)

app.config.from_object(Config)

# Set logging to only errors in production
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR if not is_debug_mode else logging.DEBUG)

# Configure the database
db.init_app(app)
migrate = Migrate(app, db)

# Register the blueprints for various routes
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(calendar_bp, url_prefix="/api/calendar")
app.register_blueprint(openai_bp, url_prefix="/api/openai")
app.register_blueprint(scheduler_bp, url_prefix="/api/scheduler")

@app.before_request
def log_request_info():
    print(f"Headers: {request.headers}")
    print(f"Body: {request.get_data()}")

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the Hybrid Athlete Task Manager API", 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Default to 5000 for local testing
    app.run(debug=is_debug_mode, host="0.0.0.0", port=port)
