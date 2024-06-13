import pyautogui

pyautogui.PAUSE = 0
pyautogui.MINIMUM_DURATION = 0
pyautogui.MINIMUM_SLEEP = 0
pyautogui.FAILSAFE = False


class ClickUtil:

    @staticmethod
    def click(x: int, y: int, button: str) -> None:
        pyautogui.click(x, y, button=button)

    @staticmethod
    def hold(x: int, y: int, button: str) -> None:
        pyautogui.mouseDown(x, y, button)

    @staticmethod
    def release(x: int, y: int, button: str) -> None:
        pyautogui.mouseUp(x, y, button)
