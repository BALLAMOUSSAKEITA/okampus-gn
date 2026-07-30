import time
from collections import defaultdict

from fastapi import HTTPException, Request

_buckets: dict[str, list[float]] = defaultdict(list)


def check_rate_limit(request: Request, scope: str, max_calls: int, window_seconds: int) -> None:
    """Limite simple en mémoire par IP + scope."""
    now = time.time()
    host = request.client.host if request.client else "unknown"
    key = f"{scope}:{host}"
    times = _buckets[key]
    times[:] = [t for t in times if now - t < window_seconds]
    if len(times) >= max_calls:
        raise HTTPException(
            status_code=429,
            detail="Trop de requêtes. Réessaie dans quelques minutes.",
        )
    times.append(now)
