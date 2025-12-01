"""Redis caching utilities."""

import json
import os
from typing import TypeVar

import redis

from app.core.logging import get_logger

logger = get_logger(__name__)

# Redis connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client: redis.Redis | None = None


def get_redis_client() -> redis.Redis | None:
    """Get or create Redis client connection.

    Returns:
        Redis client instance or None if connection fails

    """
    global redis_client
    if redis_client is None:
        try:
            # Cast to Redis to satisfy Pylance if types are missing/incomplete
            client = redis.from_url(REDIS_URL, decode_responses=True)  # type: ignore
            client.ping()  # type: ignore
            redis_client = client
            logger.info("Connected to Redis", extra={"url": REDIS_URL})
        except Exception as e:
            logger.warning(
                "Failed to connect to Redis, caching disabled",
                extra={"error": str(e)},
            )
            return None
    return redis_client


# TypeVar for cached values
CacheValue = TypeVar("CacheValue")


def cache_get(key: str) -> object | None:
    """Get value from cache.

    Args:
        key: Cache key

    Returns:
        Cached value or None if not found

    """
    try:
        client = get_redis_client()
        if client is None:
            return None

        value = client.get(key)
        if value:
            logger.debug("Cache hit", extra={"key": key})
            return json.loads(str(value))

        logger.debug("Cache miss", extra={"key": key})
        return None
    except Exception as e:
        logger.error("Cache get error", extra={"key": key, "error": str(e)})
        return None


def cache_set(key: str, value: object, ttl: int = 300) -> bool:
    """Set value in cache.

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
    """Delete value from cache.

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


def cache_clear_pattern(pattern: str) -> int:
    """Clear all cache keys matching a pattern.

    Args:
        pattern: Key pattern to match (e.g., "player:*")

    Returns:
        Number of keys deleted

    """
    try:
        client = get_redis_client()
        if client is None:
            return 0

        keys = client.keys(pattern)
        if keys:
            deleted = client.delete(*keys)
            logger.info(
                "Cache pattern clear",
                extra={"pattern": pattern, "deleted": deleted},
            )
            return int(deleted)
        return 0
    except Exception as e:
        logger.error("Cache pattern clear error", extra={"pattern": pattern, "error": str(e)})
        return 0
