import os
import sys
from requests import get
from dotenv import load_dotenv


class GithubUpdateChecker:
    @staticmethod
    def check_for_updates(version_name: str, repo_owner: str, repo_name: str, supported_file_types: set, preferred_file_type_order: list = [], allow_prerelease: bool = False) -> tuple:
        """
        Tries to find a newer version of the program.

        :return: Returns a download link to the newer version.
        """

        BASEDIR: str = os.path.dirname(sys.argv[0])
        load_dotenv(os.path.join(BASEDIR, ".env"))

        # Try to get the data from the github url
        github_url: str = f'https://api.github.com/repos/{repo_owner}/{repo_name}/releases'
        github_token: str = os.getenv("GITHUB_ACCESS_TOKEN", "")
        headers: dict = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {github_token}"
        }
        params: dict = {
            "per_page": 30,
            "page": 1
        }
        response = get(github_url, headers=headers, params=params)

        if response.status_code != 200:
            return "", "", ""

        # Filter the releases
        all_releases: dict = response.json()
        releases: dict = [release for release in all_releases if allow_prerelease or not release["prerelease"]]
        if len(releases) == 0:
            return "", "", ""

        # Get newest release
        newest_release: dict = releases[0]

        # Check for version number
        tag_name: str = newest_release['tag_name']

        if version_name == tag_name:
            return "", "", ""

        # Check if there is a supported file type in the downloads
        assets: list = newest_release["assets"]
        sorted_assets: dict = {}

        for asset in assets:
            download_url: str = asset["browser_download_url"]
            split_url: str = download_url.split(".")

            if len(split_url) <= 1:
                continue

            extension: str = split_url[len(split_url) - 1]
            if extension not in supported_file_types:
                continue

            preferred_file_type_order.append(extension)

            if extension not in sorted_assets:
                sorted_assets[extension] = []

            sorted_assets[extension].append({"download-url": download_url, "version": tag_name})

        # If no compatible installation type was found
        if len(sorted_assets) == 0:
            return "", "", ""

        # Return the most preferred installer
        for extension in preferred_file_type_order:
            if extension not in sorted_assets:
                continue

            # Pick first compatible asset
            assets: list = sorted_assets[extension]
            asset: dict = assets[0]

            return asset["download-url"], asset["version"], extension
