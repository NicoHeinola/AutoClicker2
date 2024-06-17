
from installers.installer import Installer


class ExeInstaller(Installer):
    def _install(self, download_path: str, installation_path: str) -> bool:
        return False
