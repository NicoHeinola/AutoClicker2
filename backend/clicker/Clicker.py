import time
import keyboard
from utils.ClickUtil import ClickUtil


class Clicker:

    clicker = None

    def __init__(self) -> None:
        Clicker.clicker = self

        self._click_button: str = ""
        self._click_action: str = ""
        self._click_x: int = 0
        self._click_y: int = 0
        self._clicks_per_second: float = 0
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

    def is_playing(self) -> bool:
        return self._play_state == "playing"

    def start_clicking(self) -> None:
        """
        Starts the clicking process.
        """

        # If we are already clicking
        if self.is_playing():
            return

        # Update the play state
        self._play_state = "playing"

        # Determine how often we click
        click_interval_s: float = 0
        if self._click_speed_type == "cps":
            if self._clicks_per_second <= 0:
                return
            click_interval_s = 1.0 / self._clicks_per_second
        else:
            if self._click_interval_ms <= 0:
                return
            click_interval_s = self._click_interval_ms / 1000.0

        # Determine is it possible to sleep instead of running the while loop non-stop
        MIN_SLEEP_TIME_S: float = 0.03

        # We don't want to sleep forever
        MAX_SLEEP_TIME_S: float = 5

        should_sleep: bool = click_interval_s >= MIN_SLEEP_TIME_S
        sleep_time_s: float = max(click_interval_s / 4, MIN_SLEEP_TIME_S)
        sleep_time_s: float = min(sleep_time_s, MAX_SLEEP_TIME_S)
        sleep_time_safe_check: float = sleep_time_s * 2

        # What position and button to click
        click_x, click_y = None, None
        if self._click_position_type == "at":
            click_x, click_y = self._click_x, self._click_y
        click_button: str = self._click_button

        # Determine what type of click function to call (click, hold, release)
        if self._click_action == "click":
            click_func = ClickUtil.click
        elif self._click_action == "hold":
            click_func = ClickUtil.hold
        else:
            click_func = ClickUtil.release

        start_time_s: float = time.perf_counter()
        elapsed_time_s: float = 0

        while self.is_playing():
            # If sleeping is good at this point. We need to account for error in time.sleep
            if should_sleep and click_interval_s - elapsed_time_s > sleep_time_safe_check:
                time.sleep(sleep_time_s)

            elapsed_time_s = time.perf_counter() - start_time_s

            # Perform click every "sleep_time_ms"
            if elapsed_time_s > click_interval_s:
                if keyboard.is_pressed("g"):
                    self.stop_clicking()

                # How much we offset from the target cps
                overflow_time_s: float = elapsed_time_s - click_interval_s
                start_time_s = time.perf_counter() - overflow_time_s
                elapsed_time_s = 0

                click_func(click_x, click_y, click_button)

    def stop_clicking(self) -> None:
        self._play_state = "stopped"

    def toggle_clicking(self) -> None:
        if self.is_playing():
            self.stop_clicking()
        else:
            self.start_clicking()
