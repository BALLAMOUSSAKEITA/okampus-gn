# Tâche 13.2 - Migration initiale

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Haute
**Statut :** [ ] À faire

## Actions à réaliser

1. **Générer la migration initiale :** `alembic revision --autogenerate -m "initial"`
2. **Vérifier que toutes les tables et relations sont correctes**
3. **Appliquer la migration :** `alembic upgrade head`
4. **Ajouter au pipeline de déploiement Railway**

## Critères d'acceptation

- [ ] La migration initiale crée toutes les tables existantes
- [ ] La migration est appliquée sans erreur
- [ ] Le déploiement Railway exécute les migrations automatiquement
