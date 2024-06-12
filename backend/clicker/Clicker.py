class Clicker:

    clicker = None

    def __init__(self) -> None:
        Clicker.clicker = self

        self._click_button: str = ""
        self._click_action: str = ""
        self._click_x: int = 0
        self._click_y: int = 0
        self._clicks_per_second: int = 0
        self._click_interval_ms: float = 0
        self._click_speed_type: str = ""
        self._click_position_type: str = ""

        self._play_state: str = "stopped"

    def get_play_state(self) -> str:
        return self._play_state

    def deserialize(self, data: dict) -> None:
        if "click-button" in data:
            self._click_button = data["click-button"]

        if "click-action" in data:
            self._click_action = data["click-action"]

        if "click-x" in data:
            self._click_x = int(data["click-x"])

        if "click-y" in data:
            self._click_y = int(data["click-y"])

        if "clicks-per-second" in data:
            self._clicks_per_second = int(data["clicks-per-second"])

        if "click-interval-ms" in data:
            self._click_interval_ms = float(data["click-interval-ms"])

        if "click-speed-type" in data:
            self._click_speed_type = data["click-speed-type"]

        if "click-position-type" in data:
            self._click_position_type = data["click-position-type"]

    def start_clicking(self) -> None:
        pass

    def stop_clicking(self) -> None:
        pass

    def toggle_clicking(self) -> None:
        pass
