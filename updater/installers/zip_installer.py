
import os
import zipfile
from installers.installer import Installer


class ZipInstaller(Installer):
    def _install(self, download_path: str, installation_path: str) -> bool:
        # Create extract folder if it doesn't exist
        os.makedirs(installation_path, exist_ok=True)

        # Open and extract all contents of the zip file
        with zipfile.ZipFile(download_path, 'r') as zip_ref:
            zip_ref.extractall(installation_path)
