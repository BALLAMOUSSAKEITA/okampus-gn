import os
import re
from urllib.parse import urlparse

_BLOCKED_SCHEMES = {"javascript", "data", "vbscript", "file"}
_HOST_PATTERN = re.compile(r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")


def validate_external_url(value: str) -> str:
    """Normalise et valide une URL externe (https obligatoire en production)."""
    raw = value.strip()
    if not raw or raw.startswith("//") or "\\" in raw:
        raise ValueError("URL invalide")

    if not raw.startswith(("http://", "https://")):
        raw = f"https://{raw}"

    parsed = urlparse(raw)
    scheme = (parsed.scheme or "").lower()

    if scheme in _BLOCKED_SCHEMES:
        raise ValueError("Schéma d'URL non autorisé")
    if scheme not in ("http", "https"):
        raise ValueError("Seules les URLs http(s) sont acceptées")

    is_prod = os.getenv("ENVIRONMENT", "development").lower() not in (
        "development",
        "dev",
        "local",
    )
    if is_prod and scheme != "https":
        raise ValueError("Seules les URLs HTTPS sont acceptées en production")

    host = parsed.netloc.split("@")[-1].split(":")[0].lower()
    if host in ("localhost", "127.0.0.1"):
        if is_prod:
            raise ValueError("URL invalide")
        return raw
    if not host or not _HOST_PATTERN.match(host):
        raise ValueError("URL invalide")

    return raw


def validate_optional_external_url(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = str(value).strip()
    if not stripped:
        return None
    return validate_external_url(stripped)
