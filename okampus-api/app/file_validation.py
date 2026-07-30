from fastapi import HTTPException

# Signatures magic bytes par extension
_MAGIC_CHECKS: dict[str, list[tuple[bytes, int | None]]] = {
    ".pdf": [(b"%PDF", 0)],
    ".png": [(b"\x89PNG\r\n\x1a\n", 0)],
    ".jpg": [(b"\xff\xd8\xff", 0)],
    ".jpeg": [(b"\xff\xd8\xff", 0)],
    ".webp": [(b"RIFF", 0), (b"WEBP", 8)],
    ".docx": [(b"PK\x03\x04", 0)],
    ".pptx": [(b"PK\x03\x04", 0)],
    ".doc": [(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1", 0)],
    ".ppt": [(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1", 0)],
}


def verify_upload_magic(content: bytes, ext: str) -> None:
    """Vérifie que le contenu correspond à l'extension déclarée."""
    ext = ext.lower()
    if ext == ".txt":
        return

    checks = _MAGIC_CHECKS.get(ext)
    if not checks:
        raise HTTPException(status_code=400, detail="Type de fichier non supporté")

    for signature, offset in checks:
        start = offset or 0
        end = start + len(signature)
        if len(content) < end or content[start:end] != signature:
            raise HTTPException(
                status_code=400,
                detail="Le contenu du fichier ne correspond pas à son extension",
            )
