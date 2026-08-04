"""
Configuration loguru : JSON en production, texte lisible en dev.
Intercepte aussi les logs stdlib (uvicorn, sqlalchemy, alembic).
"""

import logging
import os
import sys

from loguru import logger


# Intercepteur stdlib -> loguru
class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno
        frame, depth = logging.currentframe(), 0
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1
        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def setup_logging() -> None:
    env = os.getenv("ENVIRONMENT", "development").lower()
    is_prod = env == "production"

    # Reset loguru
    logger.remove()

    if is_prod:
        # JSON structure en production
        logger.add(
            sys.stderr,
            level="INFO",
            serialize=True,
        )
    else:
        # Format lisible en dev
        logger.add(
            sys.stderr,
            level="DEBUG",
            format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        )

    # Rediriger les loggers stdlib vers loguru
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "sqlalchemy.engine", "alembic"):
        stdlib_logger = logging.getLogger(name)
        stdlib_logger.handlers = [InterceptHandler()]
        stdlib_logger.propagate = False

    # Rediriger le logger "okampus" utilise dans main.py
    okampus_logger = logging.getLogger("okampus")
    okampus_logger.handlers = [InterceptHandler()]
    okampus_logger.propagate = False
