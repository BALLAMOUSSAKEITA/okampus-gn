# Tâche 13.6 - Health checks avancés

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Basse
**Statut :** [ ] À faire

## Actions à réaliser

1. **Enrichir `GET /health` :**
   ```json
   {
     "status": "ok",
     "version": "1.0.0",
     "database": "connected",
     "openai": "configured",
     "uptime_seconds": 3600
   }
   ```
2. **Vérifier la connexion DB** avec un `SELECT 1`
3. **Vérifier que la clé OpenAI est configurée**

## Critères d'acceptation

- [ ] Le health check vérifie la DB et les services
- [ ] La version de l'API est retournée
