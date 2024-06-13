import os
import sys
import zipfile
import requests

owner = 'NicoHeinola'
repo = 'ActionScripter'

url = f'https://api.github.com/repos/{owner}/{repo}/releases/latest'

# Function to download and extract ZIP file


def download_and_extract(url):
    # Extracting the file name from the URL
    file_name = os.path.basename(url)

    # Downloading the ZIP file
    print(f'Downloading {url}...')
    response = requests.get(url)
    with open(file_name, 'wb') as f:
        f.write(response.content)
    print('Download complete.')

    # Extracting the ZIP file contents
    print('Extracting files...')
    with zipfile.ZipFile(file_name, 'r') as zip_ref:
        zip_ref.extractall('.')
    print('Extraction complete.')

    # Cleanup: Remove the downloaded ZIP file if needed
    os.remove(file_name)
    print(f'Removed {file_name}.')


response = requests.get(url)
if response.status_code == 200:
    latest_release = response.json()
    tag_name: str = latest_release['tag_name']

    with open("version", "r") as file:
        current_version: str = file.read()

    if current_version == tag_name:
        sys.exit()

    # Download the newest version zip
    assets: list = latest_release["assets"]

    for asset in assets:
        if not asset["name"].endswith(".zip"):
            continue

        download_url: str = asset["browser_download_url"]
        download_and_extract(download_url)
else:
    print(f"Failed to retrieve latest release. Status code: {response.status_code}")
