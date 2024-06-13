from flask import Flask
from utils.click.clicker import Clicker
from database.database import db
from models.settings_model import Settings
from utils.hotkeys.hotkey_socket import HotkeySocket


class SettingsUtil:
    @staticmethod
    def initialize_settings(app: Flask, hotkey_socket: HotkeySocket):
        # Create brand new settings if they don't exist already
        with app.app_context():
            settings: Settings = Settings.query.first()

            if settings is None:
                settings = Settings()
                db.session.add(settings)
                db.session.commit()

            Clicker.clicker.deserialize(settings.serialize)
            hotkey_socket.set_start_key(settings.start_hotkey)
            hotkey_socket.set_stop_key(settings.stop_hotkey)
            hotkey_socket.set_toggle_key(settings.toggle_hotkey)
