from flask import Flask
from flask_socketio import SocketIO
from utils.click.clicker import Clicker
from utils.events.event_emitter import EventEmitter
from utils.hotkeys.hotkey_manager import HotkeyManager


class HotkeySocket(EventEmitter):
    def __init__(self, hotkey_manager: HotkeyManager, app: Flask, socketio: SocketIO) -> None:
        super().__init__()

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

    def set_start_key(self, combination: str, seperator: str = "+") -> None:
        self._start_key = set(combination.split(seperator))

    def set_stop_key(self, combination: str, seperator: str = "+") -> None:
        self._stop_key = set(combination.split(seperator))

    def set_toggle_key(self, combination: str, seperator: str = "+") -> None:
        self._toggle_key = set(combination.split(seperator))

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

        pressed_key_codes: set = set(self._hotkey_manager.get_pressed_keys().keys())

        if self._start_key and HotkeyManager.is_key_combination_pressed(self._start_key, pressed_key_codes):
            Clicker.clicker.start_clicking_thread()
            self._socket.emit("started-clicking")
            self.emit("started-clicking")
        elif self._stop_key and HotkeyManager.is_key_combination_pressed(self._stop_key, pressed_key_codes):
            Clicker.clicker.stop_clicking()
            self._socket.emit("stopped-clicking")
            self.emit("stopped-clicking")
        elif self._toggle_key and HotkeyManager.is_key_combination_pressed(self._toggle_key, pressed_key_codes):
            started: bool = Clicker.clicker.toggle_clicking()

            if started:
                self._socket.emit("started-clicking")
            else:
                self._socket.emit("stopped-clicking")
