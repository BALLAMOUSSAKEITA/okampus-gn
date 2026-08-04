# Tâche 9.1 - Rôle admin et protection

**Epic :** 09 - Dashboard Admin
**Priorité :** Haute
**Statut :** [ ] À faire
**Dépendances :** Epic 01, Tâche 1.4

## Description

S'assurer que le rôle admin est pleinement fonctionnel (créé dans l'Epic 01) et que les pages admin sont protégées côté frontend.

## Actions à réaliser

1. **Vérifier que le rôle admin fonctionne** (implémenté dans tâche 1.4)
2. **Protéger les routes `/admin/*` dans le middleware frontend**
3. **Rediriger les non-admins vers `/` avec un message d'erreur**
4. **Ajouter un lien "Admin" dans la navbar pour les admins uniquement**

## Critères d'acceptation

- [ ] Seuls les admins accèdent aux pages /admin
- [ ] Les non-admins sont redirigés
- [ ] Le lien admin apparaît dans la navbar pour les admins
