from requests import get


class GithubUpdateChecker:
    @staticmethod
    def check_for_updates(version_name: str, repo_owner: str, repo_name: str, supported_file_types: set, allow_prerelease: bool = False) -> tuple:
        """
        Tries to find a newer version of the program.

        :return: Returns a download link to the newer version.
        """

        # Try to get the data from the github url
        github_url: str = f'https://api.github.com/repos/{repo_owner}/{repo_name}/releases'
        headers: dict = {
            "Accept": "application/vnd.github.v3+json",
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
        for asset in assets:
            download_url: str = asset["browser_download_url"]
            split_url: str = download_url.split(".")

            if len(split_url) <= 1:
                continue

            extension: str = split_url[len(split_url) - 1]
            if extension not in supported_file_types:
                continue

            return download_url, tag_name, extension

        return "", "", ""
