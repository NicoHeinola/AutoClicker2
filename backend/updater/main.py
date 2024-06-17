import os
import sys
import tempfile
from installers.exe_installer import ExeInstaller
from installers.installer import Installer
from installers.installer_7z import Installer7z
from installers.zip_installer import ZipInstaller
from update_checkers.github_update_checker import GithubUpdateChecker
from util.delete.delete_util import DeleteUtil
from util.version.version_util import VersionUtil
import distutils.dir_util
import subprocess

installers: dict = {"zip": ZipInstaller(), "7z": Installer7z(), "exe": ExeInstaller}


def check_for_updates():
    global installers

    current_path: str = os.path.join(os.getcwd())
    installation_path: str = current_path
    uninstaller_path: str = os.path.join(current_path, "unins000.exe")

    # Determine if we want to reinstall the installer or using a zip in case this is a portable application
    preferred_installers: set = ["7z", "zip", "exe"]
    if os.path.exists(uninstaller_path):
        preferred_installers = ["exe", "7z", "zip"]

    # Try to find a newer version of the program
    version: str = VersionUtil.get_version_number()
    update_url, new_version, extension = GithubUpdateChecker.check_for_updates(version, "NicoHeinola", "AutoClicker2", installers.keys(), preferred_installers, False)

    if not update_url:
        return

    # Can't really update if this is not an executable
    if not DeleteUtil.is_an_executable():
        return

    # Update the version number
    VersionUtil.update_version_number(new_version)

    # Copy this updater into a temp folder so we can rewrite the whole program
    temp_dir: str = tempfile.mkdtemp()
    distutils.dir_util.copy_tree(current_path, temp_dir)

    current_filename: str = os.path.basename(sys.argv[0])
    temp_dir_updater_executable_path: str = os.path.join(temp_dir, current_filename)

    args: list = [installation_path, update_url, extension]
    subprocess.Popen([temp_dir_updater_executable_path] + args)


def update(update_url: str, installation_path: str, extension: str):
    global installers

    # Install the update
    installer: Installer = installers[extension]
    installer.download_and_install(update_url, installation_path)

    # Start the actual program
    program_path: str = os.path.join(installation_path, "AutoClicker2.exe")
    if os.path.exists(program_path):
        os.startfile(program_path)


if __name__ == "__main__":
    installation_path_arg: str = None
    update_url_arg: str = None
    extension_arg: str = None

    if len(sys.argv) > 3:
        installation_path_arg = sys.argv[1]
        update_url_arg = sys.argv[2]
        extension_arg = sys.argv[3]

    if not installation_path_arg or not update_url_arg or not extension_arg:
        check_for_updates()
    else:
        # Important for running and deleting files
        os.chdir(installation_path_arg)

        # Try to run the uninstaller if one exists
        uninstaller_path: str = os.path.join(installation_path_arg, "unins000.exe")
        if os.path.exists(uninstaller_path):
            command: list = [uninstaller_path, "/VERYSILENT"]
            subprocess.run(command, check=True)

        update(update_url_arg, installation_path_arg, extension_arg)

        # Delete this temporary update script
        DeleteUtil.delete_current_folder()
