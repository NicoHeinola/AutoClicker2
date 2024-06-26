import sys
from flask_migrate import Migrate, stamp, upgrade
from flask_socketio import SocketIO
from flask import Flask
from flask_cors import CORS
import socket
import os
from dotenv import load_dotenv
from controllers.app.app_controller import AppController
from controllers.update.update_controller import UpdateController
from gui.systray.system_tray import SystemTray
from utils.click.clicker import Clicker
from controllers.click.click_controller import ClickController
from controllers.settings.settings_controller import SettingsController
from database.database import db
from utils.hotkeys.hotkey_manager import HotkeyManager
from utils.hotkeys.hotkey_socket import HotkeySocket
from utils.settings.settings_util import SettingsUtil
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


def open_frontend():
    front_path: str = os.path.join(os.getcwd(), "frontend", "AutoClicker2_frontend.exe")

    if not os.path.exists(front_path):
        logger.warning(f"Frontend not found '{front_path}'")
        return

    os.startfile(front_path)


# Load .env file
BASEDIR: str = os.path.dirname(sys.argv[0])
load_dotenv(os.path.join(BASEDIR, ".env"))

port: int = int(os.getenv("PORT"))
host: str = os.getenv("HOST")
APP_BUILD_MODE: str = os.getenv("APP_BUILD_MODE")

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

if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or APP_BUILD_MODE == "RELEASE":
    # Frontend settings and basic checks
    if APP_BUILD_MODE == "RELEASE":
        open_frontend()

        if is_port_in_use(host, port):
            logger.critical("The port {port} is already in use!")
            sys.exit()
    # Hotkeys
    hotkey_manager: HotkeyManager = HotkeyManager()
    hotkey_manager.start_listening_to_keys()
    hotkey_socket: HotkeySocket = HotkeySocket(hotkey_manager, app, socketio)

    # System tray
    def on_exit():
        if APP_BUILD_MODE == "RELEASE":
            os._exit(1)

    def on_show():
        if APP_BUILD_MODE == "RELEASE":
            open_frontend()

    system_tray: SystemTray = SystemTray()
    system_tray.on("exit", on_exit)
    system_tray.on("show", on_show)
    hotkey_socket.on("started-clicking", lambda: system_tray.set_is_clicking(True))
    hotkey_socket.on("stopped-clicking", lambda: system_tray.set_is_clicking(False))

    # Controllers
    SettingsController(app, socketio, hotkey_socket)
    AppController(app, socketio, system_tray)
    ClickController(app, socketio, system_tray)
    UpdateController(app, socketio)

    # Utils
    Clicker()
    SettingsUtil.initialize_settings(app, hotkey_socket)

socketio.run(app, host=host, port=port, debug=os.getenv("APP_BUILD_MODE") == "DEBUG", allow_unsafe_werkzeug=True)
