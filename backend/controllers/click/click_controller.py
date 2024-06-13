from threading import Thread
from typing import Dict
from flask import Flask, make_response, request
from flask_socketio import SocketIO
from utils.click.clicker import Clicker
from controllers.base_controller import BaseController
from database.database import db
from models.settings_model import Settings
from utils.settings.settings_util import SettingsUtil


class ClickController(BaseController):
    def _register_routes(self) -> None:
        base_route: str = "/click"

        @self._app.route(f"{base_route}/state", methods=["GET"])
        def get_play_state():
            return make_response(Clicker.clicker.get_play_state(), 200)

        @self._app.route(f"{base_route}/start", methods=["POST"])
        def start_clicking():
            if Clicker.clicker.is_playing():
                return make_response("", 200)

            thread: Thread = Thread(target=Clicker.clicker.start_clicking)
            thread.start()

            return make_response("", 200)

        @self._app.route(f"{base_route}/stop", methods=["POST"])
        def stop_clicking():
            Clicker.clicker.stop_clicking()
            return make_response("", 200)
