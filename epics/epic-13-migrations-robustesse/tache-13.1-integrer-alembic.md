# Tâche 13.1 - Intégrer Alembic

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/alembic.ini` (nouveau)
- `okampus-api/alembic/` (nouveau dossier)
- `okampus-api/requirements.txt`

## Actions à réaliser

1. **Installer Alembic :** `pip install alembic`
2. **Initialiser :** `alembic init alembic`
3. **Configurer pour async PostgreSQL :**
   - Modifier `env.py` pour utiliser `asyncpg`
   - Pointer vers les modèles SQLAlchemy existants
   - Utiliser `DATABASE_URL` depuis les settings
4. **Retirer l'auto-create du lifespan dans `main.py`**
5. **Documenter les commandes :** `alembic upgrade head`, `alembic revision --autogenerate`

## Critères d'acceptation

- [ ] Alembic est configuré et fonctionne avec async PostgreSQL
- [ ] Les commandes de migration fonctionnent
- [ ] L'auto-create est retiré du démarrage
