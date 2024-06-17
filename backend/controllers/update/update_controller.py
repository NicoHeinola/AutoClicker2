import os
from threading import Thread
from flask import Flask, make_response
from flask_socketio import SocketIO
import pyautogui
from gui.systray.system_tray import SystemTray
from utils.click.clicker import Clicker
from controllers.base_controller import BaseController
from utils.update_checkers.github_update_checker import GithubUpdateChecker
from utils.version.version_util import VersionUtil


class UpdateController(BaseController):
    def _register_routes(self) -> None:
        base_route: str = "/update"

        @self._app.route(f"{base_route}/check", methods=["GET"])
        def check_for_updates():
            version: str = VersionUtil.get_version_number()

            update_link, _, _ = GithubUpdateChecker.check_for_updates(version, "NicoHeinola", "AutoClicker2", ["zip"])

            return make_response(update_link, 200)

        @self._app.route(f"{base_route}/install-latest-update", methods=["POST"])
        def install_latest_update():
            updater_path: str = os.path.join(os.getcwd(), "updater.exe")
            os.startfile(updater_path)

            return make_response("", 200)
