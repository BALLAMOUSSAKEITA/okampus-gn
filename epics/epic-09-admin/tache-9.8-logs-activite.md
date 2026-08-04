# Tâche 9.8 - Logs d'activité admin

**Epic :** 09 - Dashboard Admin
**Priorité :** Basse
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/models.py`
- `okampus-api/app/routers/admin.py`

## Actions à réaliser

1. **Modèle `AdminLog` :**
   - admin_id, action, target_type, target_id, details, created_at

2. **Logger les actions :** Chaque action admin crée un log
3. **Page de consultation :** Liste des logs avec filtres par admin et action

## Critères d'acceptation

- [ ] Toutes les actions admin sont loggées
- [ ] Les logs sont consultables depuis le dashboard
