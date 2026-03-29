# Tâche 9.2 - Middleware admin backend

**Epic :** 09 - Dashboard Admin
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/auth.py`
- `okampus-api/app/routers/admin.py` (nouveau)

## Actions à réaliser

1. **Dépendance `require_admin` :**
   ```python
   async def require_admin(current_user: User = Depends(get_current_user)):
       if current_user.role != "admin":
           raise HTTPException(403, "Accès réservé aux administrateurs")
       return current_user
   ```

2. **Appliquer sur tous les endpoints `/admin/*`**

## Critères d'acceptation

- [ ] Tous les endpoints admin retournent 403 pour les non-admins
- [ ] La dépendance est réutilisable
