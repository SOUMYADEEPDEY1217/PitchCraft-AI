"""
Structured logging module.
Scrubs sensitive tokens and formats log messages cleanly.
"""

import logging
import sys
import re

SENSITIVE_PATTERNS = [
    re.compile(r"bearer\s+[a-zA-Z0-9_\-\.]+", re.IGNORECASE),
    re.compile(r"api[-_]?key['\":\s=]+['\"]?([a-zA-Z0-9_\-]+)['\"]?", re.IGNORECASE),
    re.compile(r"password['\":\s=]+['\"]?([^'\"\s,]+)['\"]?", re.IGNORECASE),
]


class SanitizingFormatter(logging.Formatter):
    """Sanitizes sensitive information from log records."""

    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        sanitized = original
        for pattern in SENSITIVE_PATTERNS:
            sanitized = pattern.sub("[REDACTED]", sanitized)
        return sanitized


def setup_logger(name: str = "pitchcraft") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        formatter = SanitizingFormatter(
            fmt="%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d) - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.propagate = False
    return logger


logger = setup_logger("pitchcraft")
