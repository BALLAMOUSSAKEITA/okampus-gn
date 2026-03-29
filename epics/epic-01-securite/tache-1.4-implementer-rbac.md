# Tâche 1.4 - Implémenter RBAC (Role-Based Access Control)

**Epic :** 01 - Corrections Critiques & Sécurité
**Priorité :** Haute
**Statut :** [x] Terminé
**Fichiers concernés :**
- `okampus-api/app/models.py` (modèle User)
- `okampus-api/app/schemas.py`
- `okampus-api/app/auth.py`
- `okampus-api/app/routers/auth.py`
- Tous les routers nécessitant des permissions admin

## Description

Actuellement, le champ `role` ne supporte que "bachelier" et "etudiant". Il n'y a aucun rôle admin. Les endpoints de création de bourses et stages sont ouverts à tous.

## Actions à réaliser

1. **Étendre les rôles disponibles :**
   ```python
   # Dans models.py / schemas.py
   # Roles: "bachelier", "etudiant", "admin"
   ```

2. **Créer une dépendance `require_role()` :**
   ```python
   # Dans auth.py
   def require_role(*roles: str):
       async def dependency(current_user: User = Depends(get_current_user)):
           if current_user.role not in roles:
               raise HTTPException(403, "Accès refusé : rôle insuffisant")
           return current_user
       return dependency
   ```

3. **Protéger les endpoints admin :**
   - `POST /scholarships` → `Depends(require_role("admin"))`
   - `POST /stages` → `Depends(require_role("admin"))`
   - `POST /calendar` → `Depends(require_role("admin"))`
   - Futurs endpoints admin (Epic 09)

4. **Script de création admin :**
   - Créer un script CLI `create_admin.py` pour créer le premier compte admin

5. **Inclure le rôle dans le JWT :**
   - Vérifier que le champ `role` est déjà dans le payload JWT (c'est le cas)
   - S'assurer que NextAuth côté frontend propage le rôle dans la session

## Critères d'acceptation

- [x] Le rôle "admin" est supporté dans le modèle User
- [x] La dépendance `require_role()` fonctionne et retourne 403 si le rôle est insuffisant
- [x] Les endpoints de création bourses/stages/calendar requièrent le rôle admin
- [x] Un script permet de créer le premier admin
- [x] Le rôle est correctement propagé dans le JWT et la session NextAuth
