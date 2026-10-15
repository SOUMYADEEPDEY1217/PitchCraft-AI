"""
Cryptographic security, password hashing, session tokens, and authentication rate limiting.
Enforces Argon2id/PBKDF2-SHA256 password hashing, single-use reset token generation,
and brute-force defense.
"""

import hashlib
import hmac
import os
import secrets
import time
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional, Tuple


# In-memory sliding window rate limiter
# Maps identifier (e.g. ip or ip:action) to list of request timestamps
_rate_limits = defaultdict(list)


class RateLimiter:
    """In-memory sliding window rate limiter for auth endpoints."""

    @staticmethod
    def is_rate_limited(key: str, max_attempts: int = 5, window_seconds: int = 900) -> bool:
        """
        Check if key has exceeded max_attempts within window_seconds.
        Cleans expired timestamps automatically.
        """
        now = time.time()
        timestamps = _rate_limits[key]
        # Keep only timestamps within window
        valid_timestamps = [t for t in timestamps if now - t < window_seconds]
        _rate_limits[key] = valid_timestamps

        if len(valid_timestamps) >= max_attempts:
            return True

        valid_timestamps.append(now)
        _rate_limits[key] = valid_timestamps
        return False

    @staticmethod
    def reset(key: str) -> None:
        if key in _rate_limits:
            del _rate_limits[key]


def hash_password(password: str) -> str:
    """
    Hashes password using PBKDF2-HMAC-SHA256 with 600,000 iterations and 32-byte salt,
    compliant with OWASP / NIST standards.
    """
    salt = secrets.token_bytes(32)
    iterations = 600000
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return f"pbkdf2_sha256${iterations}${salt.hex()}${derived.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Constant-time verification of plain password against stored hash.
    """
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = bytes.fromhex(parts[2])
        expected = bytes.fromhex(parts[3])
        computed = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(expected, computed)
    except Exception:
        return False


def generate_session_token() -> str:
    """Generates cryptographically secure 64-character URL-safe session token."""
    return secrets.token_urlsafe(48)


def generate_reset_token() -> Tuple[str, str]:
    """
    Generates a single-use password reset token.
    Returns:
        (raw_token, token_hash)
    The raw_token is sent to user; only token_hash is stored in the database.
    """
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    return raw_token, token_hash


def hash_token(raw_token: str) -> str:
    """Hashes token with SHA256 for secure database lookup."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
