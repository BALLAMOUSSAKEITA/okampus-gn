# Tâche 8.3 - Service de création de notifications

**Epic :** 08 - Système de Notifications
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/services/notifications.py` (nouveau)

## Actions à réaliser

1. **Service utilitaire :**
   ```python
   async def create_notification(
       db: AsyncSession,
       user_id: str,
       type: str,
       title: str,
       message: str,
       link: Optional[str] = None
   ) -> Notification:
       notif = Notification(id=str(uuid4()), user_id=user_id, type=type, title=title, message=message, link=link)
       db.add(notif)
       await db.commit()
       return notif
   ```

2. **Appeler ce service depuis les autres routers** (tâche 8.4)

## Critères d'acceptation

- [ ] La fonction `create_notification` est réutilisable
- [ ] Elle crée correctement les notifications en DB
