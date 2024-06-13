from flask import Flask
from utils.click.clicker import Clicker
from database.database import db
from models.settings_model import Settings


class SettingsUtil:
    @staticmethod
    def initialize_settings(app: Flask):
        # Create brand new settings if they don't exist already
        with app.app_context():
            settings: Settings = Settings.query.first()

            if settings is None:
                settings = Settings()
                db.session.add(settings)
                db.session.commit()

            Clicker.clicker.deserialize(settings.serialize)
