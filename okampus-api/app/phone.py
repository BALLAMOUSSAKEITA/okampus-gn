"""Normalisation des numeros de telephone guineens (+224)."""

from __future__ import annotations

import re


def looks_like_email(value: str) -> bool:
    return "@" in value.strip()


def normalize_phone(value: str) -> str:
    """Retourne un numero au format +224XXXXXXXXX ou leve ValueError."""
    raw = value.strip()
    digits = re.sub(r"\D", "", raw)

    if digits.startswith("00224"):
        digits = digits[5:]
    elif digits.startswith("224"):
        digits = digits[3:]
    elif digits.startswith("0") and len(digits) == 10:
        digits = digits[1:]

    if len(digits) != 9 or not digits.startswith(("6", "7")):
        raise ValueError("Numero de telephone guineen invalide")

    return f"+224{digits}"


def try_normalize_phone(value: str) -> str | None:
    try:
        return normalize_phone(value)
    except ValueError:
        return None
