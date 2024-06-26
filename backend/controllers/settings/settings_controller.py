from typing import Dict
from flask import Flask, make_response, request
from flask_socketio import SocketIO
from utils.click.clicker import Clicker
from controllers.base_controller import BaseController
from database.database import db
from models.settings_model import Settings
from utils.hotkeys.hotkey_socket import HotkeySocket


class SettingsController(BaseController):

    def __init__(self, app: Flask, socket: SocketIO, hotkey_socket: HotkeySocket) -> None:
        super().__init__(app, socket)

        self._hotkey_socket: HotkeySocket = hotkey_socket

    def _register_routes(self) -> None:
        base_route: str = "/settings"

        @self._app.route(f"{base_route}", methods=["GET"])
        def get_settings():
            settings: Settings = Settings.query.first()
            return make_response(settings.serialize, 200)

        @self._app.route(f"{base_route}", methods=["PUT"])
        def update_settings():
            data: dict = request.get_json()

            settings: Settings = Settings.query.first()

            if "click-button" in data:
                settings.click_button = data["click-button"]

            if "click-action" in data:
                settings.click_action = data["click-action"]

            if "click-x" in data:
                settings.click_x = int(data["click-x"])

            if "click-y" in data:
                settings.click_y = int(data["click-y"])

            if "clicks-per-second" in data:
                settings.clicks_per_second = float(data["clicks-per-second"])

            if "click-interval-ms" in data:
                settings.click_interval_ms = float(data["click-interval-ms"])

            if "click-speed-type" in data:
                settings.click_speed_type = data["click-speed-type"]

            if "click-position-type" in data:
                settings.click_position_type = data["click-position-type"]

            if "start-hotkey" in data:
                keys: str = data["start-hotkey"]
                settings.start_hotkey = keys
                self._hotkey_socket.set_start_key(keys)

            if "start-hotkey-display" in data:
                settings.start_hotkey_display = data["start-hotkey-display"]

            if "stop-hotkey" in data:
                keys: str = data["stop-hotkey"]
                settings.stop_hotkey = keys
                self._hotkey_socket.set_stop_key(keys)

            if "stop-hotkey-display" in data:
                settings.stop_hotkey_display = data["stop-hotkey-display"]

            if "toggle-hotkey" in data:
                keys: str = data["toggle-hotkey"]
                settings.toggle_hotkey = keys
                self._hotkey_socket.set_toggle_key(keys)

            if "toggle-hotkey-display" in data:
                settings.toggle_hotkey_display = data["toggle-hotkey-display"]

            Clicker.clicker.deserialize(data)

            db.session.commit()

            return make_response("", 200)
