import os
import sys
import subprocess


class DeleteUtil:
    @staticmethod
    def delete_current_folder() -> None:
        # Get the path of the current script
        script_path: str = sys.argv[0]
        current_dir: str = os.path.dirname(script_path)

        # Generate the content for the .bat file
        bat_content: str = f'@echo off\n'
        bat_content += f'ping 127.0.0.1 -n 2 > nul\n'  # Delay for 1 second (ping twice with a delay)
        bat_content += f'cd {current_dir}\n'
        bat_content += f'cd ..\n'  # Move one directory up to delete the current directory
        bat_content += f'rmdir /s /q {os.path.basename(current_dir)}\n'  # Remove the current directory recursively
        bat_content += f'del "%~f0"\n'  # Delete the .bat file itself

        # Write the content to a .bat file
        bat_file_path: str = os.path.join(current_dir, 'delete_self_and_exit.bat')
        with open(bat_file_path, 'w+') as bat_file:
            bat_file.write(bat_content)

        # Execute the batch file
        subprocess.Popen(bat_file_path, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    @staticmethod
    def is_an_executable() -> bool:
        return getattr(sys, 'frozen', False)
