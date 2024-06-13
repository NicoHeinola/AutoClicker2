from flask import Flask, make_response
from flask_socketio import SocketIO
from controllers.base_controller import BaseController
from gui.systray.system_tray import SystemTray


class AppController(BaseController):

    def __init__(self, app: Flask, socket: SocketIO, system_tray: SystemTray) -> None:
        super().__init__(app, socket)
        self._system_tray = system_tray

    def _register_routes(self) -> None:
        base_route: str = "/app"

        @self._app.route(f"{base_route}/minimize", methods=["POST"])
        def minimize_app():
            self._system_tray.run()
            return make_response("", 200)
