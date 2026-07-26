import json
import logging
from typing import Iterable

from pywebpush import WebPushException, webpush

from app.config import settings

logger = logging.getLogger(__name__)


def send_push_notifications(
    subscriptions: Iterable,
    *,
    title: str,
    body: str,
    url: str = "/profil",
) -> None:
    if not settings.vapid_private_key or not settings.vapid_public_key:
        return

    payload = json.dumps({"title": title, "body": body, "url": url})

    for sub in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
                },
                data=payload,
                vapid_private_key=settings.vapid_private_key,
                vapid_claims={"sub": settings.vapid_subject},
            )
        except WebPushException as exc:
            logger.warning("Push notification failed: %s", exc)
