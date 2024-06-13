import os
import sys
import time
from PIL import Image
import pystray
from pystray import MenuItem

from utils.events.event_emitter import EventEmitter


class SystemTray(EventEmitter):

    def __init__(self) -> None:
        super().__init__()

        self._icon_clicking_path: str = SystemTray.resource_path(os.path.join("images", "icons", "icon_clicking.ico"))
        self._icon_not_clicking_path: str = SystemTray.resource_path(os.path.join("images", "icons", "icon_not_clicking.ico"))
        self._icon_image_clicking: Image = Image.open(self._icon_clicking_path)
        self._icon_image_not_clicking: Image = Image.open(self._icon_not_clicking_path)

        self._menu = [
            MenuItem('double-click-event', self._double_click_check, default=True, visible=False),
            MenuItem('Show', self._show),
            MenuItem('Exit', self._exit),
        ]

        self._tray_icon: pystray.Icon = None

        self._last_click_time_s: float = time.perf_counter()

        self._is_clicking: bool = False

    @staticmethod
    def resource_path(relative_path: str):
        """ Get absolute path to resource, works for dev and for PyInstaller """
        try:
            # PyInstaller creates a temp folder and stores path in _MEIPASS
            base_path = sys._MEIPASS
        except AttributeError:
            base_path = os.path.abspath(".")

        return os.path.join(base_path, relative_path)

    def _show(self) -> None:
        self.stop()
        self.emit("show")

    def _exit(self) -> None:
        self.stop()
        self.emit("exit")

    def _get_icon(self) -> None:
        if self._is_clicking:
            return self._icon_image_clicking
        else:
            return self._icon_image_not_clicking

    def _double_click_check(self) -> None:
        """
        Should be called when main
        """
        MAX_DOUBLE_CLICK_DELAY_S: float = 0.35

        current_time_s: float = time.perf_counter()
        time_from_last_click_s = current_time_s - self._last_click_time_s

        if time_from_last_click_s <= MAX_DOUBLE_CLICK_DELAY_S:
            self._show()

        self._last_click_time_s = current_time_s

    def set_is_clicking(self, is_clicking: bool) -> None:
        self._is_clicking = is_clicking

        if self._tray_icon:
            self._tray_icon.icon = self._get_icon()

    def stop(self):
        if self._tray_icon is None:
            return

        self._tray_icon.stop()
        self._tray_icon = None

    def run(self):
        # We don't want to create 2 icons
        if self._tray_icon is not None:
            return

        self._tray_icon = pystray.Icon("name", self._get_icon(), "AutoClicker2", self._menu)
        self._tray_icon.run()
