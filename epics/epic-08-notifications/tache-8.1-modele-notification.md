# Tâche 8.1 - Modèle Notification

**Epic :** 08 - Système de Notifications
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/schemas.py`

## Actions à réaliser

1. **Modèle SQLAlchemy :**
   ```python
   class Notification(Base):
       __tablename__ = "notifications"
       id = Column(String, primary_key=True)
       user_id = Column(String, ForeignKey("users.id"), nullable=False)
       type = Column(String)  # appointment, forum, payment, scholarship, system
       title = Column(String)
       message = Column(Text)
       link = Column(String, nullable=True)  # URL vers la ressource concernée
       is_read = Column(Boolean, default=False)
       created_at = Column(DateTime, server_default=func.now())
   ```

2. **Schemas Pydantic :** NotificationOut avec tous les champs

## Critères d'acceptation

- [ ] Le modèle est créé et la table est auto-générée
- [ ] Les schemas Pydantic sont créés
