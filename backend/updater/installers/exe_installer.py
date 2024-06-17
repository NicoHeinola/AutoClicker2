
import subprocess
from installers.installer import Installer


class ExeInstaller(Installer):
    def _install(self, download_path: str, installation_path: str) -> bool:
        # Run the setup exe with the /VERYSILENT switch and specify the installation directory
        subprocess.run([download_path, "/VERYSILENT", f"/DIR={installation_path}"], check=True)
