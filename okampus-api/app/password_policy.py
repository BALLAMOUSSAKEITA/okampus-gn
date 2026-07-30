import re

MIN_PASSWORD_LENGTH = 8
_COMMON_PASSWORDS = frozenset(
    {
        "1234567890",
        "password123",
        "motdepasse",
        "motdepasse1",
        "bachelio123",
        "okampus123",
    }
)


def validate_password_strength(password: str) -> None:
    if len(password) < MIN_PASSWORD_LENGTH:
        raise ValueError(
            f"Le mot de passe doit contenir au moins {MIN_PASSWORD_LENGTH} caractères"
        )
    if not re.search(r"[A-Za-z]", password):
        raise ValueError("Le mot de passe doit contenir au moins une lettre")
    if not re.search(r"\d", password):
        raise ValueError("Le mot de passe doit contenir au moins un chiffre")
    if password.lower() in _COMMON_PASSWORDS:
        raise ValueError("Ce mot de passe est trop courant")
