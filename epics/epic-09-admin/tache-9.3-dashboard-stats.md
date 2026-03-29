# Tâche 9.3 - Dashboard statistiques

**Epic :** 09 - Dashboard Admin
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/admin.py`

## Actions à réaliser

1. **Endpoint `GET /admin/stats` :**
   ```json
   {
     "users": { "total": 150, "bacheliers": 80, "etudiants": 65, "advisors": 5 },
     "forum": { "posts": 45, "replies": 230 },
     "resources": { "total": 30, "premium": 12, "revenue_gnf": 500000 },
     "stages": { "offers": 15, "applications": 45 },
     "scholarships": { "total": 10, "active": 8 },
     "appointments": { "total": 25, "pending": 5, "completed": 15 },
     "new_users_this_week": 12
   }
   ```

2. **Endpoint `GET /admin/stats/chart` :** Inscriptions par semaine (30 derniers jours)

## Critères d'acceptation

- [ ] Les statistiques sont correctes et calculées en temps réel
- [ ] Les données de graphique sont disponibles
