# Tâche 9.4 - Gestion des utilisateurs

**Epic :** 09 - Dashboard Admin
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/admin.py`

## Actions à réaliser

1. **Endpoints :**
   - `GET /admin/users` → Liste paginée avec recherche et filtres (rôle, date inscription)
   - `PATCH /admin/users/{id}` → Modifier rôle, activer/désactiver
   - `DELETE /admin/users/{id}` → Supprimer un utilisateur (soft delete)

2. **Actions admin :**
   - Promouvoir en admin
   - Bannir/débannir un utilisateur
   - Voir le détail complet d'un utilisateur

## Critères d'acceptation

- [ ] La liste des utilisateurs est paginée et filtrable
- [ ] Le ban/déban fonctionne
- [ ] La promotion en admin fonctionne
