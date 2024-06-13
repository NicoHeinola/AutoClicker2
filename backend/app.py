import sys
from flask_migrate import Migrate, stamp, upgrade
from flask_socketio import SocketIO
from flask import Flask
from flask_cors import CORS
import socket
import os
from dotenv import load_dotenv
from utils.click.clicker import Clicker
from controllers.click.click_controller import ClickController
from controllers.settings.settings_controller import SettingsController
from database.database import db
from utils.hotkeys.hotkey_manager import HotkeyManager
from utils.hotkeys.hotkey_socket import HotkeySocket
from utils.settings.settings_util import SettingsUtil
import logging
from logging_setup import logger


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
build_mode: str = os.getenv("BUILD_MODE")

# If port is in use, quit
if build_mode == "RELASE":
    if is_port_in_use(host, port):
        logger.critical("The port {port} is already in use!")
        sys.exit(-1)

app: Flask = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'SOMECOOLSECRETKEYTHATDOESNTREALLYMATTERINTHISCASE!'

socketio: SocketIO = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
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

hotkey_manager: HotkeyManager = HotkeyManager()
hotkey_manager.start_listening_to_keys()
hotkey_socket: HotkeySocket = HotkeySocket(hotkey_manager, app, socketio)

SettingsController(app, socketio, hotkey_socket)
ClickController(app, socketio)

Clicker()
SettingsUtil.initialize_settings(app)

socketio.run(app, host=host, port=port, debug=os.getenv("BUILD_MODE") == "DEBUG")
hotkey_manager.stop_listening_to_keys()
