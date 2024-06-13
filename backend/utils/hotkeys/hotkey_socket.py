from flask import Flask
from flask_socketio import SocketIO
from utils.hotkeys.hotkey_manager import HotkeyManager


class HotkeySocket:
    def __init__(self, hotkey_manager: HotkeyManager, app: Flask, socketio: SocketIO) -> None:
        self._hotkey_manager: HotkeyManager = hotkey_manager
        self._socket: SocketIO = socketio
        self._app: Flask = app

        self._start_key: set = set()
        self._stop_key: set = set()
        self._toggle_key: set = set()

        # How many users/elements of user want to receive key events
        self._user_key_event_amount: int = 0

        self._hotkey_manager.on("press", self._on_key_press)
        self._hotkey_manager.on("release", self._on_key_press)

        @self._socket.on("disconnect")
        def on_disconnect():
            # If we are no longer seeing the ui, we can't send key events to it
            self._user_key_event_amount = 0

        @self._socket.on("start-listening-keys")
        def on_listen_keys():
            self._user_key_event_amount += 1

        @self._socket.on("stop-listening-keys")
        def on_listen_keys():
            self._user_key_event_amount -= 1

    def set_start_key(self, combination: list) -> None:
        self._start_key = set(combination)

    def set_stop_key(self, combination: list) -> None:
        self._stop_key = set(combination)

    def set_toggle_key(self, combination: list) -> None:
        self._toggle_key = set(combination)

    def _on_key_press(self, code: str, name: str) -> None:
        """
        Handles keypresses and combinations.

        :param code: Key code that was pressed.
        :param name: Key name that was pressed.
        """
        if self._user_key_event_amount > 0:
            self._socket.emit("press", {"code": code, "name": name, "all": self._hotkey_manager.get_pressed_keys()})

            # We don't want to do any key combinations when we are assigning hotkeys
            return

        if not self._start_key and not self._stop_key:
            return

        pressed_key_codes: set = self._hotkey_manager.get_pressed_keys().keys()

        if self._start_key and HotkeyManager.is_key_combination_pressed(self._start_key, pressed_key_codes):
            print("Start")
        elif self._stop_key and HotkeyManager.is_key_combination_pressed(self._stop_key, pressed_key_codes):
            print("Stop")
        elif self._toggle_key and HotkeyManager.is_key_combination_pressed(self._toggle_key, pressed_key_codes):
            print("Toggle")
