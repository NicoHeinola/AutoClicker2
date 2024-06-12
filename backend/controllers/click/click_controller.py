from typing import Dict
from flask import Flask, make_response, request
from flask_socketio import SocketIO
from clicker.Clicker import Clicker
from controllers.base_controller import BaseController
from database.database import db
from models.settings_model import Settings
from utils.SettingsUtil import SettingsUtil


class ClickController(BaseController):
    def _register_routes(self) -> None:
        base_route: str = "/click"

        @self._app.route(f"{base_route}/start", methods=["POST"])
        def start_clicking():
            Clicker.clicker.start_clicking()

        @self._app.route(f"{base_route}/stop", methods=["POST"])
        def stop_clicking():
            Clicker.clicker.stop_clicking()
