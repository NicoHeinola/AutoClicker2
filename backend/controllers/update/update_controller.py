import os
import subprocess
from flask import make_response
from controllers.base_controller import BaseController
from updater.installers.installer import Installer
from updater.update_checkers.github_update_checker import GithubUpdateChecker
from updater.util.version.version_util import VersionUtil


class UpdateController(BaseController):
    def _register_routes(self) -> None:
        base_route: str = "/update"

        @self._app.route(f"{base_route}/check", methods=["GET"])
        def check_for_updates():
            version: str = VersionUtil.get_version_number()

            update_link, _, _ = GithubUpdateChecker.check_for_updates(version, "NicoHeinola", "AutoClicker2", Installer.get_supported_filetypes())

            return make_response(update_link, 200)

        @self._app.route(f"{base_route}/install-latest", methods=["POST"])
        def install_latest_update():
            updater_path: str = os.path.join(os.getcwd(), "Updater.exe")

            if os.path.exists(updater_path):
                subprocess.Popen([updater_path])

            return make_response("", 200)
