from models.base_model import BaseModel
from database.database import db


class Settings(BaseModel):

    id = db.Column(db.Integer, primary_key=True)
    click_button = db.Column(db.String(9999), unique=False, nullable=False, default="left")
    click_action = db.Column(db.String(9999), unique=False, nullable=False, default="click")
    click_x = db.Column(db.Integer, unique=False, nullable=False, default=100)
    click_y = db.Column(db.Integer, unique=False, nullable=False, default=100)
    clicks_per_second = db.Column(db.Float, unique=False, nullable=False, default=1)
    click_interval_ms = db.Column(db.Float, unique=False, nullable=False, default=1000.0)
    click_speed_type = db.Column(db.String(9999), unique=False, nullable=False, default="cps")
    click_position_type = db.Column(db.String(9999), unique=False, nullable=False, default="current")

    start_hotkey = db.Column(db.String(9999), unique=False, nullable=False, default="")
    start_hotkey_display = db.Column(db.String(9999), unique=False, nullable=False, default="")
    stop_hotkey = db.Column(db.String(9999), unique=False, nullable=False, default="")
    stop_hotkey_display = db.Column(db.String(9999), unique=False, nullable=False, default="")
    toggle_hotkey = db.Column(db.String(9999), unique=False, nullable=False, default="")
    toggle_hotkey_display = db.Column(db.String(9999), unique=False, nullable=False, default="")

    @property
    def serialize(self):
        return {
            "id": self.id,
            "click-button": self.click_button,
            "click-action": self.click_action,
            "click-x": self.click_x,
            "click-y": self.click_y,
            "clicks-per-second": self.clicks_per_second,
            "click-interval-ms": self.click_interval_ms,
            "click-speed-type": self.click_speed_type,
            "click-position-type": self.click_position_type,
            "start-hotkey": self.start_hotkey,
            "start-hotkey-display": self.start_hotkey_display,
            "stop-hotkey": self.stop_hotkey,
            "stop-hotkey-display": self.stop_hotkey_display,
            "toggle-hotkey": self.toggle_hotkey,
            "toggle-hotkey-display": self.toggle_hotkey_display

        }
