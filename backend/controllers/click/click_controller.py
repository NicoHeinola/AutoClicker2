from threading import Thread
from flask import Flask, make_response
from flask_socketio import SocketIO
import pyautogui
from gui.systray.system_tray import SystemTray
from utils.click.clicker import Clicker
from controllers.base_controller import BaseController


class ClickController(BaseController):

    def __init__(self, app: Flask, socket: SocketIO, system_tray: SystemTray) -> None:
        super().__init__(app, socket)
        self._system_tray: SystemTray = system_tray

    def _register_routes(self) -> None:
        base_route: str = "/click"

        @self._app.route(f"{base_route}/state", methods=["GET"])
        def get_play_state():
            return make_response(Clicker.clicker.get_play_state(), 200)

        @self._app.route(f"{base_route}/start", methods=["POST"])
        def start_clicking():
            if Clicker.clicker.is_playing():
                return make_response("", 200)

            Clicker.clicker.start_clicking_thread()
            self._system_tray.set_is_clicking(True)

            return make_response("", 200)

        @self._app.route(f"{base_route}/stop", methods=["POST"])
        def stop_clicking():
            Clicker.clicker.stop_clicking()
            self._system_tray.set_is_clicking(False)
            return make_response("", 200)

        @self._app.route(f"{base_route}/mouse/position", methods=["GET"])
        def get_mouse_position():
            mouse_pos: pyautogui.Point = pyautogui.position()
            return make_response({"x": mouse_pos.x, "y": mouse_pos.y}, 200)
