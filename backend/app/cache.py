"""
Redis caching utilities.
"""

import json
import os
from typing import Any, cast

import redis

from app.logging_config import get_logger

logger = get_logger(__name__)

# Redis connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client: redis.Redis | None = None


def get_redis_client() -> redis.Redis:
    """
    Get or create Redis client connection.

    Returns:
        Redis client instance
    """
    global redis_client
    if redis_client is None:
        try:
            # Cast to Redis to satisfy Pylance if types are missing/incomplete
            client = redis.from_url(REDIS_URL, decode_responses=True)
            redis_client = cast(redis.Redis, client)
            redis_client.ping()  # Test connection
            logger.info("Connected to Redis", extra={"url": REDIS_URL})
        except Exception as e:
            logger.warning(
                "Failed to connect to Redis, caching disabled",
                extra={"error": str(e)},
            )
            return None  # type: ignore[return-value]
    return redis_client


def cache_get(key: str) -> Any | None:
    """
    Get value from cache.

    Args:
        key: Cache key

    Returns:
        Cached value or None if not found
    """
    try:
        client = get_redis_client()
        if client is None:
            return None

        value = cast(str | None, client.get(key))
        if value:
            logger.debug("Cache hit", extra={"key": key})
            return json.loads(value)

        logger.debug("Cache miss", extra={"key": key})
        return None
    except Exception as e:
        logger.error("Cache get error", extra={"key": key, "error": str(e)})
        return None


def cache_set(key: str, value: Any, ttl: int = 300) -> bool:
    """
    Set value in cache.

    Args:
        key: Cache key
        value: Value to cache (must be JSON serializable)
        ttl: Time to live in seconds (default: 5 minutes)

    Returns:
        True if successful, False otherwise
    """
    try:
        client = get_redis_client()
        if client is None:
            return False

        serialized = json.dumps(value)
        client.setex(key, ttl, serialized)
        logger.debug("Cache set", extra={"key": key, "ttl": ttl})
        return True
    except Exception as e:
        logger.error("Cache set error", extra={"key": key, "error": str(e)})
        return False


def cache_delete(key: str) -> bool:
    """
    Delete value from cache.

    Args:
        key: Cache key

    Returns:
        True if successful, False otherwise
    """
    try:
        client = get_redis_client()
        if client is None:
            return False

        client.delete(key)
        logger.debug("Cache delete", extra={"key": key})
        return True
    except Exception as e:
        logger.error("Cache delete error", extra={"key": key, "error": str(e)})
        return False
