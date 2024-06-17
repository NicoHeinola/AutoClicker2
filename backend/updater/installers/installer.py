import os
import shutil
import sys
import requests
from urllib.parse import ParseResult, urlparse
from abc import ABC, abstractmethod


class Installer(ABC):
    def __init__(self) -> None:
        pass

    @staticmethod
    def get_supported_filetypes() -> list:
        return ["exe", "zip", "7z"]

    def _download(self, download_url: str) -> str:
        """
        Downloads a program to be ready for installation.

        :return: Path to the downloaded file.
        """

        # Parse the URL to get the file name
        parsed_url: ParseResult = urlparse(download_url)
        file_name: str = os.path.basename(parsed_url.path)
        download_path: str = os.path.join(os.path.dirname(sys.argv[0]), file_name)

        # Send a GET request to the specified URL
        response = requests.get(download_url, stream=True)
        response.raise_for_status()

        # Open the local file in write-binary mode
        with open(download_path, 'wb+') as file:
            # Write the content in chunks
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)

        return download_path

    def _delete_downloaded_file(self, file_path: str) -> None:
        """
        :param file_path: Where was the file downloaded to.
        Deletes the downloaded
        """
        if not os.path.exists(file_path):
            return

        os.remove(file_path)

    def _clear_installation_folder(self, folder_path: str) -> None:
        """
        Tries to remove everything from the installation folder.

        :param folder_path: Where the installation folder is located.
        """
        if not os.path.exists(folder_path):
            return

        try:
            shutil.rmtree(folder_path)
        except Exception as e:
            pass

    @abstractmethod
    def _install(self, download_path: str, installation_path: str) -> bool:
        """
        Installs a program into given directory.

        :param download_path: Where the installation file is.
        :param installation_path: Where to install the program to.
        :return: Returns whether the installation was successful.
        """

        pass

    def download_and_install(self, download_url: str, installation_path: str) -> bool:
        """
        Downloads and installs a program.

        :param download_url: Where to download the program from.
        :param installation_path: Where to install the program to.
        :return: Returns whether the installation was successful
        """

        download_path: str = self._download(download_url)

        with open("text.txt", "w+") as file:
            file.write(f"Download path: {download_path} + args0: {sys.argv[0]}")

        if not download_path:
            return False

        self._clear_installation_folder(installation_path)

        installation_success: bool = self._install(download_path, installation_path)
        self._delete_downloaded_file(download_path)

        return installation_success
