import sys
from flask_migrate import Migrate, stamp, upgrade
from flask_socketio import SocketIO
from flask import Flask
from flask_cors import CORS
import socket
import os
from dotenv import load_dotenv
from clicker.Clicker import Clicker
from controllers.settings.settings_controller import SettingsController
from database.database import db
from utils.SettingsUtil import SettingsUtil


def database_exists(app: Flask):
    db_path: str = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    return os.path.exists(db_path)


def is_port_in_use(host: str, port: int):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind((host, port))
        except socket.error:
            return True
        return False


# Load .env file
BASEDIR: str = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASEDIR, ".env"))

port: int = int(os.getenv("PORT"))
host: str = os.getenv("HOST")

# If port is in use, quit
if is_port_in_use(host, port):
    print("Port is already in use!")
    sys.exit(-1)

app: Flask = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'SOMECOOLSECRETKEYTHATDOESNTREALLYMATTERINTHISCASE!'

socketio: SocketIO = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")
CORS(app)
migrate: Migrate = Migrate(app, db)

db.init_app(app)

with app.app_context():
    db_exists: bool = database_exists(app)

    # Create database tables for our data models if they don't exist
    db.create_all()

    if not db_exists:
        # Mark the database as up-to-date with the migrations
        stamp()

    # Apply the latest migrations if the database already exists
    upgrade()

SettingsController(app, socketio)

Clicker()
SettingsUtil.initialize_settings(app)

socketio.run(app, host=host, port=port, debug=os.getenv("BUILD_MODE") == "DEBUG")
