# Tâche 13.4 - Gestion d'erreurs backend

**Epic :** 13 - Migrations DB & Robustesse Backend
**Priorité :** Moyenne
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-api/app/main.py`

## Actions à réaliser

1. **Middleware global d'erreurs :**
   - Attraper les exceptions non gérées
   - Logger l'erreur complète (stack trace)
   - Retourner un message générique au client (pas de stack trace en prod)
   - Format : `{"detail": "Une erreur interne est survenue", "error_id": "uuid"}`

2. **Erreurs spécifiques :**
   - IntegrityError → 409 Conflict (ex: email déjà utilisé)
   - ValueError → 400 Bad Request
   - Timeout → 504 Gateway Timeout

## Critères d'acceptation

- [ ] Aucune stack trace n'est exposée en production
- [ ] Les erreurs sont loggées avec un ID unique
- [ ] Les erreurs de DB sont mappées en HTTP codes appropriés
