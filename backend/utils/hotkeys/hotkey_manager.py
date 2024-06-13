import keyboard

from utils.events.event_emitter import EventEmitter


class HotkeyManager(EventEmitter):
    def __init__(self) -> None:
        super().__init__()

        # Contains key code and name
        self._pressed_keys: dict = {}

    def get_pressed_keys(self) -> dict:
        return self._pressed_keys

    def on_key_event(self, event: keyboard.KeyboardEvent) -> None:
        """
        Handles a key-event.

        :param event: Key event
        """

        scan_code = str(event.scan_code)
        key_name: str = event.name
        if event.event_type == keyboard.KEY_DOWN:
            # If we are already pressing that key
            if scan_code in self._pressed_keys:
                return

            self._pressed_keys[scan_code] = key_name

            self.emit("press", code=scan_code, name=key_name)
        elif event.event_type == keyboard.KEY_UP:
            # Remove the key from pressed keys if it's inside them
            if scan_code in self._pressed_keys:
                self._pressed_keys.pop(scan_code)

            self.emit("release", code=scan_code, name=key_name)

    def start_listening_to_keys(self) -> None:
        """
        Starts listening for keys
        """

        keyboard.hook(self.on_key_event)

    def stop_listening_to_keys(self) -> None:
        """
        Stops listening to keys
        """

        keyboard.unhook(self.on_key_event)

    @staticmethod
    def is_key_combination_pressed(combination: set, pressed_keys: set) -> bool:
        if len(combination) != len(pressed_keys):
            return False

        # Check if any of the pressed keys don't match
        for key in combination:
            if key not in pressed_keys:
                return False

        return True
