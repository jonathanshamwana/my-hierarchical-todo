from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from tasks import tasks_bp
from auth import auth_bp
from flask_migrate import Migrate

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the Hybrid Athlete Task Manager API", 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
