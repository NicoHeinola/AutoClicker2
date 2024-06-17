import os


class VersionUtil:
    @staticmethod
    def get_version_number() -> str:
        version_file_path: str = os.path.join(os.getcwd(), "version")

        if not os.path.exists(version_file_path):
            return ""

        with open(version_file_path, "r") as file:
            return file.read()

    @staticmethod
    def update_version_number(new_version: str) -> None:
        with open("version", "w+") as file:
            file.write(new_version)
