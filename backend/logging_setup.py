import logging


# Define a custom level lower than DEBUG
ALL_LEVEL_NUM = 0
logging.addLevelName(ALL_LEVEL_NUM, "ALL")

# Add a custom logging method for the new level


def all(self, message, *args, **kwargs):
    if self.isEnabledFor(ALL_LEVEL_NUM):
        self._log(ALL_LEVEL_NUM, message, args, **kwargs)


# Create a custom logger
logger = logging.getLogger(__name__)

level = ALL_LEVEL_NUM

# Set the overall logging level
logger.setLevel(level)

# Create handlers
console_handler = logging.StreamHandler()
file_handler = logging.FileHandler('app.log')

# Set level for handlers
console_handler.setLevel(level)
file_handler.setLevel(level)

# Create formatters and add them to handlers
formatter = logging.Formatter('%(asctime)s [%(levelname)s]: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)
