from flask import Flask
from config.config import Config
from models.task import db
from routes.tasks import tasks_bp

app = Flask(__name__)


app.config.from_object(Config)

db.init_app(app)

app.register_blueprint(tasks_bp, url_prefix='/api/tasks')

if __name__ == '__main__':
    app.run(debug=True)
