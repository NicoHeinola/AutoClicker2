
import os
from installers.installer import Installer
import patoolib
from patoolib.util import PatoolError


class Installer7z(Installer):
    def _install(self, download_path: str, installation_path: str) -> bool:
        # Create extract folder if it doesn't exist
        os.makedirs(installation_path, exist_ok=True)

        try:
            # Extract the 7z file using patoolib
            patoolib.extract_archive(download_path, outdir=installation_path)
        except PatoolError as e:
            print(f"Error extracting archive with patoolib: {e}")
            return False

        return True
