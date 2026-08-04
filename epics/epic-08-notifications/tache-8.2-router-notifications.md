# Tâche 8.2 - Router notifications

**Epic :** 08 - Système de Notifications
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/routers/notifications.py` (nouveau)
- `okampus-api/app/main.py`

## Actions à réaliser

1. **Endpoints :**
   - `GET /notifications` → Notifications de l'utilisateur connecté (non-lues d'abord, triées par date)
   - `GET /notifications/count` → Nombre de non-lues (pour le badge)
   - `PATCH /notifications/{id}/read` → Marquer comme lue
   - `POST /notifications/read-all` → Marquer toutes comme lues
   - `DELETE /notifications/{id}` → Supprimer une notification

2. **Pagination :** skip/limit avec défaut 20

## Critères d'acceptation

- [ ] Tous les endpoints fonctionnent avec authentification
- [ ] Le compteur de non-lues est correct
- [ ] Marquer comme lu fonctionne (individuel et bulk)
